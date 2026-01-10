using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchRepository _matchRepository;

        public MatchesController(IMatchRepository matchRepository)
        {
            _matchRepository = matchRepository;
        }

        // [HttpGet]: Defines this as a GET request (fetching data).
        // URL: /api/matches/{userId}
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMatches(int userId)
        {
            // Talk to the Repository (SQL) to find people I matched with.
            var matches = await _matchRepository.GetMatchesForUserAsync(userId);
            return Ok(matches);
        }
    }
}
