using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IPreferenceRepository _preferenceRepository;
        private readonly RoomieMatch.API.Services.IPhotoService _photoService;

        public UsersController(IUserRepository userRepository, IPreferenceRepository preferenceRepository, RoomieMatch.API.Services.IPhotoService photoService)
        {
            _userRepository = userRepository;
            _preferenceRepository = preferenceRepository;
            _photoService = photoService;
        }

        [HttpPost("upload-photo")]
        public async Task<IActionResult> UploadPhoto(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            // Get current user ID from JWT Token
            var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);

            var user = await _userRepository.GetByIdAsync(userId);
            user.ProfileImage = result.SecureUrl.AbsoluteUri;
            
            await _userRepository.UpdateAsync(user);

            return Ok(new { url = user.ProfileImage });
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try 
            {
                // Get current user ID from JWT Token
                var userId = int.Parse(User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier).Value);
                
                // Get Current User to check their type
                var currentUser = await _userRepository.GetByIdAsync(userId);
                if (currentUser == null) return Unauthorized();

                // Get user's preferences to filter matches
                var preference = await _preferenceRepository.GetByUserIdAsync(userId);

                // Get matches based on type AND preferences
                var users = await _userRepository.GetPotentialMatchesAsync(userId, currentUser.UserType, preference);
                return Ok(users);
            }
            catch(Exception) 
            {
                 // Fallback if not logged in or other error
                 return Ok(await _userRepository.GetAllAsync());
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            if (user == null) return BadRequest("User cannot be null");
            if (string.IsNullOrWhiteSpace(user.FirstName) || string.IsNullOrWhiteSpace(user.LastName) || string.IsNullOrWhiteSpace(user.Email))
            {
                return BadRequest("Missing required fields");
            }

            // Simple check for valid UserType
            if (user.UserType != "HAS_ROOM" && user.UserType != "NEEDS_ROOM")
            {
                return BadRequest("Invalid UserType");
            }

            try 
            {
                var id = await _userRepository.CreateAsync(user);
                user.Id = id;
                return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
            }
            catch (Exception ex)
            {
                // In a real app we'd log this. 
                // Postgres unique constraint violation on email would throw here.
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User user)
        {
            if (user == null || id != user.Id) return BadRequest();
            
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _userRepository.UpdateAsync(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existing = await _userRepository.GetByIdAsync(id);
            if (existing == null) return NotFound();

            await _userRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
