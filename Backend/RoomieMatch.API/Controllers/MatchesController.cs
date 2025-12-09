using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly IMatchRepository _matchRepository;

        public MatchesController(IMatchRepository matchRepository)
        {
            _matchRepository = matchRepository;
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetMatches(int userId)
        {
            var matches = await _matchRepository.GetMatchesForUserAsync(userId);
            return Ok(matches);
        }
    }
}
