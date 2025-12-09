using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using RoomieMatch.API.Controllers;
using RoomieMatch.Model.Entities;
using RoomieMatch.Model.Repositories;
using Xunit;

namespace RoomieMatch.Tests
{
    public class SwipesControllerTests
    {
        private readonly Mock<ISwipeRepository> _mockSwipeRepo;
        private readonly Mock<IMatchRepository> _mockMatchRepo;
        private readonly SwipesController _controller;

        public SwipesControllerTests()
        {
            _mockSwipeRepo = new Mock<ISwipeRepository>();
            _mockMatchRepo = new Mock<IMatchRepository>();
            _controller = new SwipesController(_mockSwipeRepo.Object, _mockMatchRepo.Object);
        }

        [Fact]
        public async Task PostSwipe_CreatesMatch_WhenMutualLike()
        {
            // Arrange
            var swipe = new Swipe { SwiperUserId = 1, TargetUserId = 2, Liked = true };
            var otherSwipe = new Swipe { SwiperUserId = 2, TargetUserId = 1, Liked = true };

            _mockSwipeRepo.Setup(repo => repo.CreateOrUpdateSwipeAsync(swipe)).Returns(Task.CompletedTask);
            _mockSwipeRepo.Setup(repo => repo.GetSwipeAsync(2, 1)).ReturnsAsync(otherSwipe);
            _mockMatchRepo.Setup(repo => repo.CreateMatchAsync(1, 2)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.Swipe(swipe);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            // Use reflection or dynamic to check anonymous object properties if needed, 
            // or just rely on the fact that it's OK result for now in this simple test.
            // Ideally we'd return a typed response, but anonymous object is used in controller.
            
            // Verifying the Match creation was called
            _mockMatchRepo.Verify(repo => repo.CreateMatchAsync(1, 2), Times.Once);
        }

        [Fact]
        public async Task PostSwipe_NoMatch_WhenOtherHasNotLiked()
        {
             // Arrange
            var swipe = new Swipe { SwiperUserId = 1, TargetUserId = 2, Liked = true };
            // Other user swipe not found or false
            _mockSwipeRepo.Setup(repo => repo.CreateOrUpdateSwipeAsync(swipe)).Returns(Task.CompletedTask);
            _mockSwipeRepo.Setup(repo => repo.GetSwipeAsync(2, 1)).ReturnsAsync((Swipe?)null);

            // Act
            var result = await _controller.Swipe(swipe);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            _mockMatchRepo.Verify(repo => repo.CreateMatchAsync(It.IsAny<int>(), It.IsAny<int>()), Times.Never);
        }
    }
}
