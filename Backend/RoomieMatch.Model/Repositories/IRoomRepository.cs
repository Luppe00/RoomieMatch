using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IRoomRepository
    { //This is a CRUD examples
        Task<IEnumerable<Room>> GetAllAsync();
        Task<Room?> GetByIdAsync(int id);
        Task<IEnumerable<Room>> GetByUserIdAsync(int userId);
        Task<int> CreateAsync(Room room);
        Task UpdateAsync(Room room);
        Task DeleteAsync(int id);
    }
}
