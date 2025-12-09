using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface ISwipeRepository
    {
        Task CreateOrUpdateSwipeAsync(Swipe swipe);
        Task<Swipe?> GetSwipeAsync(int swiperUserId, int targetUserId);
    }
}
