using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly string? _jwtSecret;

        public AuthController(IUserService userService, IConfiguration config)
        {
            _userService = userService;
            _jwtSecret = config["Jwt:Secret"];
        }

        [HttpPost("signup")]
        public IActionResult SignUp(UserRegister user)
        {
            // Check if the username or email already exists
            if (_userService.UserExists(user.Email, user.Email))
            {
                return Conflict(new { message = "Username or email already exists" });
            }

            _userService.AddUser(user);

            var token = GenerateJwtToken(user);

            var response = new
            {
                UserId = user.Id,
                AccessToken = token
            };

            return Ok(response);
        }

        [HttpPost("login")]
        public IActionResult Login(UserLogin loginModel)
        {
            var user = _userService.Authenticate(loginModel.Email, loginModel.Password);

            if (user == null)
                return Unauthorized();

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return user id, initials, and access token
            var response = new
            {
                UserId = user.Id,
                AccessToken = token
            };

            return Ok(response);
        }

        [HttpGet]
        public IActionResult IsAuthenticated()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");

            if (string.IsNullOrEmpty(token))
            {
                return Ok(new { isAuthenticated = false });
            }

            var user = ValidateToken(token);
            if (user == null)
            {
                return Ok(new { isAuthenticated = false });
            }

            return Ok(new { isAuthenticated = true, user });
        }

        private object ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            try
            {
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                };

                SecurityToken validatedToken;
                var principal = tokenHandler.ValidateToken(token, validationParameters, out validatedToken);

                if (!(validatedToken is JwtSecurityToken jwtSecurityToken) ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }

                var userId = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var userEmail = principal.FindFirst(ClaimTypes.Name)?.Value;

                if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(userEmail))
                {
                    return null;
                }

                return new
                {
                    Id = int.Parse(userId),
                    Email = userEmail
                };
            }
            catch
            {
                return null;
            }
        }

        private string GenerateJwtToken(UserRegister user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_jwtSecret);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, user.Email)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
