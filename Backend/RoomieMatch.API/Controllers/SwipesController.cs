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

        public SwipesController(ISwipeRepository swipeRepository, IMatchRepository matchRepository)
        {
            _swipeRepository = swipeRepository;
            _matchRepository = matchRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Swipe([FromBody] Swipe swipe)
        {
            if (swipe == null) return BadRequest();

            // Save the swipe
            await _swipeRepository.CreateOrUpdateSwipeAsync(swipe);

            if (!swipe.Liked)
            {
                return Ok(new { isMatch = false });
            }

            // Check if there is a mutual like
            // Does TargetUser also like SwiperUser?
            var otherSwipe = await _swipeRepository.GetSwipeAsync(swipe.TargetUserId, swipe.SwiperUserId);
            
            if (otherSwipe != null && otherSwipe.Liked)
            {
                // It's a match!
                await _matchRepository.CreateMatchAsync(swipe.SwiperUserId, swipe.TargetUserId);
                return Ok(new { isMatch = true });
            }

            return Ok(new { isMatch = false });
        }
    }
}
