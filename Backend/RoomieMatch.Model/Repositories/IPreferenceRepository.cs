using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IPreferenceRepository
    {
        Task<Preference?> GetByUserIdAsync(int userId);
        Task UpsertAsync(Preference preference);
    }
}
