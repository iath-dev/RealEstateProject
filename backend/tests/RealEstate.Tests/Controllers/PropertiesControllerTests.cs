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
    public class PropertiesControllerTests
    {
        private Mock<IPropertyService> _mockPropertyService;
        private Mock<ILogger<PropertiesController>> _mockLogger;
        private PropertiesController _controller;

        [SetUp]
        public void SetUp()
        {
            _mockPropertyService = new Mock<IPropertyService>();
            _mockLogger = new Mock<ILogger<PropertiesController>>();
            _controller = new PropertiesController(_mockPropertyService.Object, _mockLogger.Object);
        }

        #region GetProperties Tests

        [Test]
        public async Task GetProperties_ShouldReturnOkResult_WhenPropertiesExist()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            var properties = new List<PropertyDto>
            {
                TestDataHelper.CreateTestPropertyDto(1),
                TestDataHelper.CreateTestPropertyDto(2),
            };
            var pagedResult = TestDataHelper.CreateTestPagedResult(properties);

            _mockPropertyService
                .Setup(s => s.GetPropertiesAsync(filters))
                .ReturnsAsync(pagedResult);

            // Act
            var result = await _controller.GetProperties(filters);

            // Assert
            result.Should().BeOfType<ActionResult<PagedResultDto<PropertyDto>>>();
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as PagedResultDto<PropertyDto>;
            returnedData.Should().NotBeNull();
            returnedData!.Items.Should().HaveCount(2);
        }

        [Test]
        public async Task GetProperties_ShouldReturnEmptyResult_WhenNoPropertiesExist()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            var emptyResult = TestDataHelper.CreateTestPagedResult(new List<PropertyDto>());

            _mockPropertyService
                .Setup(s => s.GetPropertiesAsync(filters))
                .ReturnsAsync(emptyResult);

            // Act
            var result = await _controller.GetProperties(filters);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();

            var returnedData = okResult!.Value as PagedResultDto<PropertyDto>;
            returnedData!.Items.Should().BeEmpty();
            returnedData.TotalCount.Should().Be(0);
        }

        [Test]
        public async Task GetProperties_ShouldReturn500_WhenExceptionOccurs()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            _mockPropertyService
                .Setup(s => s.GetPropertiesAsync(filters))
                .ThrowsAsync(new Exception("Database error"));

            // Act
            var result = await _controller.GetProperties(filters);

            // Assert
            var statusResult = result.Result as ObjectResult;
            statusResult.Should().NotBeNull();
            statusResult!.StatusCode.Should().Be(500);
        }

        #endregion

        #region GetProperty Tests

        [Test]
        public async Task GetProperty_ShouldReturnOkResult_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            var propertyDetail = TestDataHelper.CreateTestPropertyDetailDto(propertyId);

            _mockPropertyService
                .Setup(s => s.GetPropertyByIdAsync(propertyId))
                .ReturnsAsync(propertyDetail);

            // Act
            var result = await _controller.GetProperty(propertyId);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as PropertyDetailDto;
            returnedData.Should().NotBeNull();
            returnedData!.IdProperty.Should().Be(propertyId);
        }

        [Test]
        public async Task GetProperty_ShouldReturnNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyService
                .Setup(s => s.GetPropertyByIdAsync(propertyId))
                .ReturnsAsync((PropertyDetailDto?)null);

            // Act
            var result = await _controller.GetProperty(propertyId);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        [Test]
        public async Task GetProperty_ShouldReturn500_WhenExceptionOccurs()
        {
            // Arrange
            var propertyId = 1;
            _mockPropertyService
                .Setup(s => s.GetPropertyByIdAsync(propertyId))
                .ThrowsAsync(new Exception("Service error"));

            // Act
            var result = await _controller.GetProperty(propertyId);

            // Assert
            var statusResult = result.Result as ObjectResult;
            statusResult.Should().NotBeNull();
            statusResult!.StatusCode.Should().Be(500);
        }

        #endregion

        #region CreateProperty Tests

        [Test]
        public async Task CreateProperty_ShouldReturnCreatedResult_WhenPropertyIsValid()
        {
            // Arrange
            var propertyDto = TestDataHelper.CreateTestPropertyDto();
            propertyDto.IdProperty = 0; // Sin ID para creación

            var createdProperty = TestDataHelper.CreateTestPropertyDto(1);

            _mockPropertyService
                .Setup(s => s.CreatePropertyAsync(propertyDto))
                .ReturnsAsync(createdProperty);

            // Act
            var result = await _controller.CreateProperty(propertyDto);

            // Assert
            var createdResult = result.Result as CreatedAtActionResult;
            createdResult.Should().NotBeNull();
            createdResult!.StatusCode.Should().Be(201);
            createdResult.ActionName.Should().Be(nameof(PropertiesController.GetProperty));

            var returnedData = createdResult.Value as PropertyDto;
            returnedData.Should().NotBeNull();
            returnedData!.IdProperty.Should().Be(1);
        }

        [Test]
        public async Task CreateProperty_ShouldReturnBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            var propertyDto = new PropertyDto(); // Objeto inválido
            _controller.ModelState.AddModelError("Name", "Name is required");

            // Act
            var result = await _controller.CreateProperty(propertyDto);

            // Assert
            var badRequestResult = result.Result as BadRequestObjectResult;
            badRequestResult.Should().NotBeNull();
            badRequestResult!.StatusCode.Should().Be(400);
        }

        [Test]
        public async Task CreateProperty_ShouldReturn500_WhenExceptionOccurs()
        {
            // Arrange
            var propertyDto = TestDataHelper.CreateTestPropertyDto();
            _mockPropertyService
                .Setup(s => s.CreatePropertyAsync(propertyDto))
                .ThrowsAsync(new Exception("Creation failed"));

            // Act
            var result = await _controller.CreateProperty(propertyDto);

            // Assert
            var statusResult = result.Result as ObjectResult;
            statusResult.Should().NotBeNull();
            statusResult!.StatusCode.Should().Be(500);
        }

        #endregion

        #region UpdateProperty Tests

        [Test]
        public async Task UpdateProperty_ShouldReturnOkResult_WhenPropertyIsUpdated()
        {
            // Arrange
            var propertyId = 1;
            var propertyDto = TestDataHelper.CreateTestPropertyDto(propertyId);
            var updatedProperty = TestDataHelper.CreateTestPropertyDto(
                propertyId,
                1,
                "Updated Property"
            );

            _mockPropertyService
                .Setup(s => s.UpdatePropertyAsync(propertyId, propertyDto))
                .ReturnsAsync(updatedProperty);

            // Act
            var result = await _controller.UpdateProperty(propertyId, propertyDto);

            // Assert
            var okResult = result.Result as OkObjectResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);

            var returnedData = okResult.Value as PropertyDto;
            returnedData.Should().NotBeNull();
            returnedData!.Name.Should().Be("Updated Property");
        }

        [Test]
        public async Task UpdateProperty_ShouldReturnNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            var propertyDto = TestDataHelper.CreateTestPropertyDto();

            _mockPropertyService
                .Setup(s => s.UpdatePropertyAsync(propertyId, propertyDto))
                .ReturnsAsync((PropertyDto?)null);

            // Act
            var result = await _controller.UpdateProperty(propertyId, propertyDto);

            // Assert
            var notFoundResult = result.Result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        #endregion

        #region DeleteProperty Tests

        [Test]
        public async Task DeleteProperty_ShouldReturnNoContent_WhenPropertyIsDeleted()
        {
            // Arrange
            var propertyId = 1;
            _mockPropertyService.Setup(s => s.DeletePropertyAsync(propertyId)).ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteProperty(propertyId);

            // Assert
            var noContentResult = result as NoContentResult;
            noContentResult.Should().NotBeNull();
            noContentResult!.StatusCode.Should().Be(204);
        }

        [Test]
        public async Task DeleteProperty_ShouldReturnNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyService.Setup(s => s.DeletePropertyAsync(propertyId)).ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteProperty(propertyId);

            // Assert
            var notFoundResult = result as NotFoundObjectResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        #endregion

        #region PropertyExists Tests

        [Test]
        public async Task PropertyExists_ShouldReturnOk_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            _mockPropertyService.Setup(s => s.PropertyExistsAsync(propertyId)).ReturnsAsync(true);

            // Act
            var result = await _controller.PropertyExists(propertyId);

            // Assert
            var okResult = result as OkResult;
            okResult.Should().NotBeNull();
            okResult!.StatusCode.Should().Be(200);
        }

        [Test]
        public async Task PropertyExists_ShouldReturnNotFound_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyService.Setup(s => s.PropertyExistsAsync(propertyId)).ReturnsAsync(false);

            // Act
            var result = await _controller.PropertyExists(propertyId);

            // Assert
            var notFoundResult = result as NotFoundResult;
            notFoundResult.Should().NotBeNull();
            notFoundResult!.StatusCode.Should().Be(404);
        }

        #endregion
    }
}
