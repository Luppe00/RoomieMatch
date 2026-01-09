using Microsoft.AspNetCore.Mvc;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;

namespace RoomieMatch.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SwipesController : ControllerBase
    {
        private readonly ISwipeRepository _swipeRepository;
        private readonly IMatchRepository _matchRepository;

        // DEPENDENCY INJECTION 
        // We ask for "ISwipeRepository" in the constructor.
        // The Program.cs gives us the tool we need.
        public SwipesController(ISwipeRepository swipeRepository, IMatchRepository matchRepository)
        {
            _swipeRepository = swipeRepository;
            _matchRepository = matchRepository;
        }

        // This Controller receives the request. It checks if the input is valid, and then asks the Repository to save it
        [HttpPost]
        public async Task<IActionResult> Swipe([FromBody] Swipe swipe)
        {
            // 1. Validation: Ensure we actually received data
            if (swipe == null) return BadRequest();

            // 2. Repository Call: Save the swipe to the database immediately
            await _swipeRepository.CreateOrUpdateSwipeAsync(swipe);

            // If the user said "Pass" (Liked = false), we stop here. No match possible.
            if (!swipe.Liked)
            {
                return Ok(new { isMatch = false });
            }

            // 3. My own Logic: Check if the *other* user also liked *us*
            // "Did TargetUser alread swipe Right on SwiperUser?"
            var otherSwipe = await _swipeRepository.GetSwipeAsync(swipe.TargetUserId, swipe.SwiperUserId);
            
            if (otherSwipe != null && otherSwipe.Liked)
            {
                // 4. IT'S A MATCH! Both users liked each other.
                // Create the record in the 'Matches' table
                await _matchRepository.CreateMatchAsync(swipe.SwiperUserId, swipe.TargetUserId);
                return Ok(new { isMatch = true });
            }

            // If only we liked them (but they haven't liked back), return false
            return Ok(new { isMatch = false });
        }
    }
}
