using System.Collections.Generic;
using System.Threading.Tasks;
using RoomieMatch.Model.Entities;

namespace RoomieMatch.Model.Repositories
{
    public interface IMessageRepository
    {
        Task AddMessage(Message message);
        Task<IEnumerable<Message>> GetMessageThread(int currentUserId, int recipientId);
        Task MarkMessagesAsRead(int currentUserId, int senderId);
        Task<int> GetUnreadCount(int userId);
    }
}
