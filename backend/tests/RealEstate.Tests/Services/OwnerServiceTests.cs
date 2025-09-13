// RealEstate.Tests/Services/OwnerServiceTests.cs
using AutoMapper;
using FluentAssertions;
using Moq;
using NUnit.Framework;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Core.Mappings;
using RealEstate.Infrastructure.Services;
using RealEstate.Tests.Helpers;

namespace RealEstate.Tests.Services
{
    [TestFixture]
    public class OwnerServiceTests
    {
        private Mock<IOwnerRepository> _mockOwnerRepository;
        private IMapper _mapper;
        private OwnerService _ownerService;

        [SetUp]
        public void SetUp()
        {
            _mockOwnerRepository = new Mock<IOwnerRepository>();

            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });
            _mapper = mapperConfig.CreateMapper();

            _ownerService = new OwnerService(_mockOwnerRepository.Object, _mapper);
        }

        [TearDown]
        public void TearDown()
        {
            // En AutoMapper 12.0.1, IMapper no implementa IDisposable
        }

        #region GetAllOwnersAsync Tests

        [Test]
        public async Task GetAllOwnersAsync_ShouldReturnAllOwners_WhenOwnersExist()
        {
            // Arrange
            var owners = TestDataHelper.CreateTestOwners(3);
            _mockOwnerRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(owners);

            // Act
            var result = await _ownerService.GetAllOwnersAsync();

            // Assert
            var ownerList = result.ToList();
            ownerList.Should().HaveCount(3);
            ownerList
                .Should()
                .AllSatisfy(owner =>
                {
                    owner.Should().NotBeNull();
                    owner.IdOwner.Should().BeGreaterThan(0);
                    owner.Name.Should().NotBeEmpty();
                });
        }

        [Test]
        public async Task GetAllOwnersAsync_ShouldReturnEmptyList_WhenNoOwnersExist()
        {
            // Arrange
            _mockOwnerRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Owner>());

            // Act
            var result = await _ownerService.GetAllOwnersAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().BeEmpty();
        }

        #endregion

        #region GetOwnerByIdAsync Tests

        [Test]
        public async Task GetOwnerByIdAsync_ShouldReturnOwner_WhenOwnerExists()
        {
            // Arrange
            var ownerId = 1;
            var owner = TestDataHelper.CreateTestOwner(ownerId, "John Doe");

            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync(owner);

            // Act
            var result = await _ownerService.GetOwnerByIdAsync(ownerId);

            // Assert
            result.Should().NotBeNull();
            result!.IdOwner.Should().Be(ownerId);
            result.Name.Should().Be("John Doe");
            result.Address.Should().NotBeEmpty();
        }

        [Test]
        public async Task GetOwnerByIdAsync_ShouldReturnNull_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync((Owner?)null);

            // Act
            var result = await _ownerService.GetOwnerByIdAsync(ownerId);

            // Assert
            result.Should().BeNull();
        }

        #endregion

        #region CreateOwnerAsync Tests

        [Test]
        public async Task CreateOwnerAsync_ShouldReturnCreatedOwner_WithGeneratedId()
        {
            // Arrange
            var ownerDto = TestDataHelper.CreateTestOwnerDto();
            ownerDto.IdOwner = 0; // Sin ID asignado

            var existingOwners = TestDataHelper.CreateTestOwners(2);
            var createdOwner = TestDataHelper.CreateTestOwner(3, ownerDto.Name);

            _mockOwnerRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(existingOwners);
            _mockOwnerRepository
                .Setup(r => r.AddAsync(It.IsAny<Owner>()))
                .Returns(Task.FromResult(createdOwner));

            // Act
            var result = await _ownerService.CreateOwnerAsync(ownerDto);

            // Assert
            result.Should().NotBeNull();
            result.IdOwner.Should().Be(3); // Max ID (2) + 1
            result.Name.Should().Be(ownerDto.Name);
            result.Address.Should().Be(ownerDto.Address);

            _mockOwnerRepository.Verify(
                r => r.AddAsync(It.Is<Owner>(o => o.IdOwner == 3)),
                Times.Once
            );
        }

        [Test]
        public async Task CreateOwnerAsync_ShouldGenerateIdOne_WhenNoExistingOwners()
        {
            // Arrange
            var ownerDto = TestDataHelper.CreateTestOwnerDto();

            _mockOwnerRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Owner>());
            _mockOwnerRepository
                .Setup(r => r.AddAsync(It.IsAny<Owner>()))
                .ReturnsAsync((Owner o) => o); // Retornar el mismo owner

            // Act
            var result = await _ownerService.CreateOwnerAsync(ownerDto);

            // Assert
            result.IdOwner.Should().Be(1);
            _mockOwnerRepository.Verify(
                r => r.AddAsync(It.Is<Owner>(o => o.IdOwner == 1)),
                Times.Once
            );
        }

        #endregion

        #region UpdateOwnerAsync Tests

        [Test]
        public async Task UpdateOwnerAsync_ShouldReturnUpdatedOwner_WhenOwnerExists()
        {
            // Arrange
            var ownerId = 1;
            var existingOwner = TestDataHelper.CreateTestOwner(ownerId, "Original Name");
            var updateDto = TestDataHelper.CreateTestOwnerDto(ownerId, "Updated Name");

            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync(existingOwner);
            _mockOwnerRepository
                .Setup(r => r.UpdateAsync(It.IsAny<Owner>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _ownerService.UpdateOwnerAsync(ownerId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.IdOwner.Should().Be(ownerId);
            result.Name.Should().Be("Updated Name");

            _mockOwnerRepository.Verify(
                r =>
                    r.UpdateAsync(
                        It.Is<Owner>(o => o.IdOwner == ownerId && o.Name == "Updated Name")
                    ),
                Times.Once
            );
        }

        [Test]
        public async Task UpdateOwnerAsync_ShouldReturnNull_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            var updateDto = TestDataHelper.CreateTestOwnerDto();

            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync((Owner?)null);

            // Act
            var result = await _ownerService.UpdateOwnerAsync(ownerId, updateDto);

            // Assert
            result.Should().BeNull();
            _mockOwnerRepository.Verify(r => r.UpdateAsync(It.IsAny<Owner>()), Times.Never);
        }

        [Test]
        public async Task UpdateOwnerAsync_ShouldPreserveId_WhenUpdating()
        {
            // Arrange
            var ownerId = 5;
            var existingOwner = TestDataHelper.CreateTestOwner(ownerId);
            var updateDto = TestDataHelper.CreateTestOwnerDto(999, "Updated Name"); // DTO con ID diferente

            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync(existingOwner);
            _mockOwnerRepository
                .Setup(r => r.UpdateAsync(It.IsAny<Owner>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _ownerService.UpdateOwnerAsync(ownerId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.IdOwner.Should().Be(ownerId); // Debe conservar el ID original

            _mockOwnerRepository.Verify(
                r => r.UpdateAsync(It.Is<Owner>(o => o.IdOwner == ownerId)),
                Times.Once
            );
        }

        #endregion

        #region DeleteOwnerAsync Tests

        [Test]
        public async Task DeleteOwnerAsync_ShouldReturnTrue_WhenOwnerExists()
        {
            // Arrange
            var ownerId = 1;
            var existingOwner = TestDataHelper.CreateTestOwner(ownerId);

            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync(existingOwner);
            _mockOwnerRepository
                .Setup(r => r.DeleteAsync(existingOwner))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _ownerService.DeleteOwnerAsync(ownerId);

            // Assert
            result.Should().BeTrue();
            _mockOwnerRepository.Verify(r => r.DeleteAsync(existingOwner), Times.Once);
        }

        [Test]
        public async Task DeleteOwnerAsync_ShouldReturnFalse_WhenOwnerDoesNotExist()
        {
            // Arrange
            var ownerId = 999;
            _mockOwnerRepository.Setup(r => r.GetByIdAsync(ownerId)).ReturnsAsync((Owner?)null);

            // Act
            var result = await _ownerService.DeleteOwnerAsync(ownerId);

            // Assert
            result.Should().BeFalse();
            _mockOwnerRepository.Verify(r => r.DeleteAsync(It.IsAny<Owner>()), Times.Never);
        }

        #endregion
    }
}
