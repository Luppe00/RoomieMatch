using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using RoomieMatch.API.Hubs;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;
using System.Security.Claims;
using System.Threading.Tasks;

namespace RoomieMatch.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _repo;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesController(IMessageRepository repo, IHubContext<ChatHub> hubContext)
        {
            _repo = repo;
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(MessageCreateDto messageDto)
        {
            var senderId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            
            var message = new Message
            {
                SenderId = senderId,
                RecipientId = messageDto.RecipientId,
                Content = messageDto.Content,
                DateSent = DateTime.UtcNow
            };

            await _repo.AddMessage(message);

            // Notify Recipient via SignalR (if connected)
            await _hubContext.Clients.Group($"User_{messageDto.RecipientId}").SendAsync("NewMessage", message);
            
            return Ok(message);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMessageThread(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            var messages = await _repo.GetMessageThread(currentUserId, userId);
            return Ok(messages);
        }
    }

    public class MessageCreateDto 
    {
        public int RecipientId { get; set; }
        public string Content { get; set; }
    }
}
