namespace backend.Models
{
    public class UserRegister
    {
        public int Id { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required long PhoneNumber { get; set; }
    }
}
