using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PreferencesController : ControllerBase
    {
        private readonly IPreferenceRepository _preferenceRepository;

        public PreferencesController(IPreferenceRepository preferenceRepository)
        {
            _preferenceRepository = preferenceRepository;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetByUserId(int userId)
        {
            var pref = await _preferenceRepository.GetByUserIdAsync(userId);
            if (pref == null)
            {
                // Return empty preference object or 404? 
                // Returning empty/default is often easier for frontend forms
                return Ok(new Preference { UserId = userId }); 
            }
            return Ok(pref);
        }

        [HttpPut("{userId}")]
        public async Task<IActionResult> Upsert(int userId, [FromBody] Preference preference)
        {
            if (preference == null || userId != preference.UserId) return BadRequest();

            await _preferenceRepository.UpsertAsync(preference);
            return Ok(preference);
        }
    }
}
