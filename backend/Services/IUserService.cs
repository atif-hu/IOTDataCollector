using backend.Models;

namespace backend.Services
{
    public interface IUserService
    {
        UserRegister Authenticate(string username, string password);
        bool UserExists(string username, string email);
        void AddUser(UserRegister user);
    }
}
