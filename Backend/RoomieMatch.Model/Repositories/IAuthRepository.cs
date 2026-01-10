using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IAuthRepository
    {
        Task<User> Register(User user, string password);
        Task<User?> Login(string email, string password);
        Task<bool> UserExists(string email);
    }
}
