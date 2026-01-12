using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;
using RoomieMatch.API.Services;

namespace RoomieMatch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;
        private readonly IPhotoService _photoService;

        public RoomsController(IRoomRepository roomRepository, IPhotoService photoService)
        {
            _roomRepository = roomRepository;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var rooms = await _roomRepository.GetAllAsync();
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var room = await _roomRepository.GetByIdAsync(id);
            if (room == null) return NotFound();
            return Ok(room);
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var rooms = await _roomRepository.GetByUserIdAsync(userId);
            return Ok(rooms);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Room room)
        {
            if (room == null) return BadRequest();
            if (string.IsNullOrWhiteSpace(room.Title) || string.IsNullOrWhiteSpace(room.Location) || room.Rent <= 0)
            {
                return BadRequest("Invalid room data");
            }

            var id = await _roomRepository.CreateAsync(room);
            room.Id = id;
            return CreatedAtAction(nameof(GetById), new { id = room.Id }, room);
        }

        [Authorize]
        [HttpPost("{roomId}/upload-photo")]
        public async Task<IActionResult> UploadRoomPhoto(int roomId, IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var room = await _roomRepository.GetByIdAsync(roomId);
            if (room == null) return NotFound("Room not found");

            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);

            room.RoomImage = result.SecureUrl.AbsoluteUri;
            await _roomRepository.UpdateAsync(room);

            return Ok(new { url = room.RoomImage });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Room room)
        {
            if (room == null || id != room.Id) return BadRequest();

            var existing = await _roomRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _roomRepository.UpdateAsync(room);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _roomRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _roomRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
