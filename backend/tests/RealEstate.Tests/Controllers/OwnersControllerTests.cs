using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;
using RealEstate.API.Controllers;
using RealEstate.Core.DTOs;
using RealEstate.Core.Interfaces.IServices;
using RealEstate.Tests.Helpers;

namespace RealEstate.Tests.Controllers
{
    [TestFixture]
    public class OwnersControllerTests
    {
        private Mock<IOwnerService> _mockOwnerService;
        private Mock<ILogger<OwnersController>> _mockLogger;
        private OwnersController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockOwnerService = new Mock<IOwnerService>();
            _mockLogger = new Mock<ILogger<OwnersController>>();
            _controller = new OwnersController(_mockOwnerService.Object, _mockLogger.Object);
        }

        #region GetOwners Tests

        [Test]
        public async Task GetOwners_ShouldReturnOkResult_WhenOwnersExist()
        {
            // Arrange
            var owners = new List<OwnerDto>
            {
                TestDataHelper.CreateTestOwnerDto(1, "Owner 1"),
                TestDataHelper.CreateTestOwnerDto(2, "Owner 2"),
            };

            _mockOwnerService.Setup(s => s.GetAllOwnersAsync()).ReturnsAsync(owners);

            // Act
            var result = await _controller.GetOwners();

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as IEnumerable<OwnerDto>;
            returnedData.Should().NotBeNull();
            returnedData!.Should().HaveCount(2);
        }

        [Test]
        public async Task GetOwners_ShouldReturn500_WhenExceptionOccurs()
        {
            // Arrange
            _mockOwnerService
                .Setup(s => s.GetAllOwnersAsync())
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetOwners();

            // Assert
            var statusResult = result.Result as ObjectResult;
            statusResult.Should().NotBeNull();
            statusResult!.StatusCode.Should().Be(500);
        }

        #endregion

        #region GetOwner Tests

        [Test]
        public async Task GetOwner_ShouldReturnOkResult_WhenOwnerExists()
        {
            // Arrange
            var ownerId = 1;
            var owner = TestDataHelper.CreateTestOwnerDto(ownerId, "John Doe");

            _mockOwnerService.Setup(s => s.GetOwnerByIdAsync(ownerId)).ReturnsAsync(owner);

            // Act
            var result = await _controller.GetOwner(ownerId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as OwnerDto;
            returnedData.Should().NotBeNull();
            returnedData!.IdOwner.Should().Be(ownerId);
            returnedData.Name.Should().Be("John Doe");
        }

        [Test]
        public async Task GetOwner_ShouldReturnNotFound_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            _mockOwnerService
                .Setup(s => s.GetOwnerByIdAsync(ownerId))
                .ReturnsAsync((OwnerDto?)null);

            // Act
            var result = await _controller.GetOwner(ownerId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        #endregion

        #region CreateOwner Tests

        [Test]
        public async Task CreateOwner_ShouldReturnCreatedResult_WhenOwnerIsValid()
        {
            // Arrange
            var ownerDto = TestDataHelper.CreateTestOwnerDto();
            ownerDto.IdOwner = 0;

            var createdOwner = TestDataHelper.CreateTestOwnerDto(1);

            _mockOwnerService.Setup(s => s.CreateOwnerAsync(ownerDto)).ReturnsAsync(createdOwner);

            // Act
            var result = await _controller.CreateOwner(ownerDto);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();
            createdResult!.StatusCode.Should().Be(201);
            createdResult.ActionName.Should().Be(nameof(OwnersController.GetOwner));

            var returnedData = createdResult.Value as OwnerDto;
            returnedData.Should().NotBeNull();
            returnedData!.IdOwner.Should().Be(1);
        }

        #endregion

        #region UpdateOwner Tests

        [Test]
        public async Task UpdateOwner_ShouldReturnOkResult_WhenOwnerIsUpdated()
        {
            // Arrange
            var ownerId = 1;
            var ownerDto = TestDataHelper.CreateTestOwnerDto(ownerId, "Original Name");
            var updatedOwner = TestDataHelper.CreateTestOwnerDto(ownerId, "Updated Name");

            _mockOwnerService
                .Setup(s => s.UpdateOwnerAsync(ownerId, ownerDto))
                .ReturnsAsync(updatedOwner);

            // Act
            var result = await _controller.UpdateOwner(ownerId, ownerDto);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as OwnerDto;
            returnedData.Should().NotBeNull();
            returnedData!.Name.Should().Be("Updated Name");
        }

        [Test]
        public async Task UpdateOwner_ShouldReturnNotFound_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            var ownerDto = TestDataHelper.CreateTestOwnerDto();

            _mockOwnerService
                .Setup(s => s.UpdateOwnerAsync(ownerId, ownerDto))
                .ReturnsAsync((OwnerDto?)null);

            // Act
            var result = await _controller.UpdateOwner(ownerId, ownerDto);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        [Test]
        public async Task UpdateOwner_ShouldReturnBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var ownerId = 1;
            var ownerDto = new OwnerDto();
            _controller.ModelState.AddModelError("Name", "Name is required");

            // Act
            var result = await _controller.UpdateOwner(ownerId, ownerDto);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            badRequestResult.Should().NotBeNull();
            badRequestResult!.StatusCode.Should().Be(400);
        }

        #endregion

        #region DeleteOwner Tests

        [Test]
        public async Task DeleteOwner_ShouldReturnNoContent_WhenOwnerIsDeleted()
        {
            // Arrange
            var ownerId = 1;
            _mockOwnerService.Setup(s => s.DeleteOwnerAsync(ownerId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteOwner(ownerId);

            // Assert
            var noContentResult = result as NoContentResult;
            noContentResult.Should().NotBeNull();
            noContentResult!.StatusCode.Should().Be(204);
        }

        [Test]
        public async Task DeleteOwner_ShouldReturnNotFound_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            _mockOwnerService.Setup(s => s.DeleteOwnerAsync(ownerId)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteOwner(ownerId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        [Test]
        public async Task DeleteOwner_ShouldReturn500_WhenExceptionOccurs()
        {
            // Arrange
            var ownerId = 1;
            _mockOwnerService
                .Setup(s => s.DeleteOwnerAsync(ownerId))
                .ThrowsAsync(new Exception("Delete failed"));

            // Act
            var result = await _controller.DeleteOwner(ownerId);

            // Assert
            var statusResult = result as ObjectResult;
            statusResult.Should().NotBeNull();
            statusResult!.StatusCode.Should().Be(500);
        }

        #endregion
    }
}
