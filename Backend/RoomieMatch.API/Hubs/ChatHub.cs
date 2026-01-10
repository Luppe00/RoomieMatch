using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RoomieMatch.API.Hubs
{
    public class ChatHub : Hub
    {
        // This method is called by the frontend to send a message
        // But for a REST-based chat (Simpler), we might just use the Controller to save 
        // and then use the Hub to NOTIFY.
        // Let's use the Hub for notification.
        
        public async Task SendMessage(string recipientId, string message)
        {
            // We can send to a specific user if we map their connection IDs.
            // For simplicity, we'll use Groups.
            // When User A connects, they join group "User_A".
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, $"User_{userId}");
            }
            await base.OnConnectedAsync();
        }
    }
}
