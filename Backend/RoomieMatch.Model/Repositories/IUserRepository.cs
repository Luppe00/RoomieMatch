using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IUserRepository
    {
        Task<IEnumerable<User>> GetAllAsync();
        Task<IEnumerable<User>> GetPotentialMatchesAsync(int currentUserId, string currentUserType, Preference? preference = null);
        Task<User?> GetByIdAsync(int id);
        Task<int> CreateAsync(User user);
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
}
