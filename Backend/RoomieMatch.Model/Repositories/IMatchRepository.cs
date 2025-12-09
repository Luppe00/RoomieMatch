using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IMatchRepository
    {
        Task CreateMatchAsync(int userAId, int userBId);
        Task<IEnumerable<User>> GetMatchesForUserAsync(int userId);
    }
}
