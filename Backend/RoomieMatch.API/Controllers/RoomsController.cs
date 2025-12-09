using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomsController : ControllerBase
    {
        private readonly IRoomRepository _roomRepository;

        public RoomsController(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
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
