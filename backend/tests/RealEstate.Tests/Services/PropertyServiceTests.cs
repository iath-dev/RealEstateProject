// RealEstate.Tests/Services/PropertyServiceTests.cs
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
    public class PropertyServiceTests
    {
        private Mock<IPropertyRepository> _mockPropertyRepository;
        private Mock<IOwnerRepository> _mockOwnerRepository;
        private Mock<IPropertyImageRepository> _mockPropertyImageRepository;
        private Mock<IPropertyTraceRepository> _mockPropertyTraceRepository;
        private IMapper _mapper;
        private PropertyService _propertyService;

        [SetUp]
        public void SetUp()
        {
            // Configurar mocks
            _mockPropertyRepository = new Mock<IPropertyRepository>();
            _mockOwnerRepository = new Mock<IOwnerRepository>();
            _mockPropertyImageRepository = new Mock<IPropertyImageRepository>();
            _mockPropertyTraceRepository = new Mock<IPropertyTraceRepository>();

            // Configurar AutoMapper
            var mapperConfig = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });
            _mapper = mapperConfig.CreateMapper();

            // Crear servicio con dependencias mockeadas
            _propertyService = new PropertyService(
                _mockPropertyRepository.Object,
                _mockOwnerRepository.Object,
                _mockPropertyImageRepository.Object,
                _mockPropertyTraceRepository.Object,
                _mapper
            );
        }

        #region GetPropertiesAsync Tests

        [Test]
        public async Task GetPropertiesAsync_ShouldReturnPagedResult_WhenValidFilters()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            var properties = TestDataHelper.CreateTestProperties(3);
            var pagedProperties = TestDataHelper.CreateTestPagedResult(properties, 3);
            var owner = TestDataHelper.CreateTestOwner();
            var image = TestDataHelper.CreateTestPropertyImage();

            _mockPropertyRepository
                .Setup(r => r.GetPagedByFiltersAsync(filters))
                .ReturnsAsync(pagedProperties);
            _mockOwnerRepository.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync(owner);
            _mockPropertyImageRepository
                .Setup(r => r.GetFirstEnabledByPropertyIdAsync(It.IsAny<int>()))
                .ReturnsAsync(image);

            // Act
            var result = await _propertyService.GetPropertiesAsync(filters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(3);
            result.TotalCount.Should().Be(3);
            result.Page.Should().Be(1);
            result.PageSize.Should().Be(10);

            result.Items.First().OwnerName.Should().Be(owner.Name);
            result.Items.First().Image.Should().Be(image.File);

            _mockPropertyRepository.Verify(r => r.GetPagedByFiltersAsync(filters), Times.Once);
            _mockOwnerRepository.Verify(r => r.GetByIdAsync(It.IsAny<int>()), Times.Exactly(3));
        }

        [Test]
        public async Task GetPropertiesAsync_ShouldReturnEmptyResult_WhenNoPropertiesFound()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            var emptyPagedResult = TestDataHelper.CreateTestPagedResult(new List<Property>(), 0);

            _mockPropertyRepository
                .Setup(r => r.GetPagedByFiltersAsync(filters))
                .ReturnsAsync(emptyPagedResult);

            // Act
            var result = await _propertyService.GetPropertiesAsync(filters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().BeEmpty();
            result.TotalCount.Should().Be(0);
        }

        [Test]
        public async Task GetPropertiesAsync_ShouldHandleMissingOwner_WhenOwnerNotFound()
        {
            // Arrange
            var filters = TestDataHelper.CreateTestPropertyFilter();
            var properties = TestDataHelper.CreateTestProperties(1);
            var pagedProperties = TestDataHelper.CreateTestPagedResult(properties);

            _mockPropertyRepository
                .Setup(r => r.GetPagedByFiltersAsync(filters))
                .ReturnsAsync(pagedProperties);
            _mockOwnerRepository
                .Setup(r => r.GetByIdAsync(It.IsAny<int>()))
                .ReturnsAsync((Owner?)null);
            _mockPropertyImageRepository
                .Setup(r => r.GetFirstEnabledByPropertyIdAsync(It.IsAny<int>()))
                .ReturnsAsync((PropertyImage?)null);

            // Act
            var result = await _propertyService.GetPropertiesAsync(filters);

            // Assert
            result.Should().NotBeNull();
            result.Items.Should().HaveCount(1);
            result.Items.First().OwnerName.Should().BeEmpty();
            result.Items.First().Image.Should().BeNull();
        }

        #endregion

        #region GetPropertyByIdAsync Tests

        [Test]
        public async Task GetPropertyByIdAsync_ShouldReturnPropertyDetail_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            var property = TestDataHelper.CreateTestProperty(propertyId);
            property.Owner = TestDataHelper.CreateTestOwner();

            var images = TestDataHelper.CreateTestPropertyImages(propertyId);
            var traces = TestDataHelper.CreateTestPropertyTraces(propertyId);

            _mockPropertyRepository
                .Setup(r => r.GetWithDetailsAsync(propertyId))
                .ReturnsAsync(property);
            _mockPropertyImageRepository
                .Setup(r => r.GetByPropertyIdAsync(propertyId))
                .ReturnsAsync(images);
            _mockPropertyTraceRepository
                .Setup(r => r.GetByPropertyIdAsync(propertyId))
                .ReturnsAsync(traces);

            // Act
            var result = await _propertyService.GetPropertyByIdAsync(propertyId);

            // Assert
            result.Should().NotBeNull();
            result!.IdProperty.Should().Be(propertyId);
            result.Name.Should().Be(property.Name);
            result.Owner.Should().NotBeNull();
            result.Owner.Name.Should().Be(property.Owner.Name);
            result.Images.Should().HaveCount(2);
            result.Traces.Should().HaveCount(2);
        }

        [Test]
        public async Task GetPropertyByIdAsync_ShouldReturnNull_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyRepository
                .Setup(r => r.GetWithDetailsAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _propertyService.GetPropertyByIdAsync(propertyId);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task GetPropertyByIdAsync_ShouldLoadMissingRelations_WhenNotLoaded()
        {
            // Arrange
            var propertyId = 1;
            var property = TestDataHelper.CreateTestProperty(propertyId);
            // Property sin Owner cargado
            property.Owner = null;

            var owner = TestDataHelper.CreateTestOwner();
            var images = TestDataHelper.CreateTestPropertyImages(propertyId);
            var traces = TestDataHelper.CreateTestPropertyTraces(propertyId);

            _mockPropertyRepository
                .Setup(r => r.GetWithDetailsAsync(propertyId))
                .ReturnsAsync(property);
            _mockOwnerRepository.Setup(r => r.GetByIdAsync(property.IdOwner)).ReturnsAsync(owner);
            _mockPropertyImageRepository
                .Setup(r => r.GetByPropertyIdAsync(propertyId))
                .ReturnsAsync(images);
            _mockPropertyTraceRepository
                .Setup(r => r.GetByPropertyIdAsync(propertyId))
                .ReturnsAsync(traces);

            // Act
            var result = await _propertyService.GetPropertyByIdAsync(propertyId);

            // Assert
            result.Should().NotBeNull();
            result!.Owner.Should().NotBeNull();
            result.Owner.Name.Should().Be(owner.Name);

            _mockOwnerRepository.Verify(r => r.GetByIdAsync(property.IdOwner), Times.Once);
        }

        #endregion

        #region CreatePropertyAsync Tests

        [Test]
        public async Task CreatePropertyAsync_ShouldReturnCreatedProperty_WithGeneratedId()
        {
            // Arrange
            var propertyDto = TestDataHelper.CreateTestPropertyDto();
            propertyDto.IdProperty = 0; // Simular que no tiene ID

            var existingProperties = TestDataHelper.CreateTestProperties(2);
            var owner = TestDataHelper.CreateTestOwner(propertyDto.IdOwner);
            var createdProperty = TestDataHelper.CreateTestProperty(
                3,
                propertyDto.IdOwner,
                propertyDto.Name
            );

            _mockPropertyRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(existingProperties);
            _mockPropertyRepository
                .Setup(r => r.AddAsync(It.IsAny<Property>()))
                .Returns(Task.FromResult(createdProperty));
            _mockOwnerRepository
                .Setup(r => r.GetByIdAsync(propertyDto.IdOwner))
                .ReturnsAsync(owner);

            // Act
            var result = await _propertyService.CreatePropertyAsync(propertyDto);

            // Assert
            result.Should().NotBeNull();
            result.IdProperty.Should().Be(3); // Max ID (2) + 1
            result.Name.Should().Be(propertyDto.Name);
            result.OwnerName.Should().Be(owner.Name);

            _mockPropertyRepository.Verify(
                r => r.AddAsync(It.Is<Property>(p => p.IdProperty == 3)),
                Times.Once
            );
        }

        [Test]
        public async Task CreatePropertyAsync_ShouldGenerateIdOne_WhenNoExistingProperties()
        {
            // Arrange
            var propertyDto = TestDataHelper.CreateTestPropertyDto();
            var owner = TestDataHelper.CreateTestOwner(propertyDto.IdOwner);

            _mockPropertyRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(new List<Property>()); // Sin propiedades existentes
            _mockPropertyRepository
                .Setup(r => r.AddAsync(It.IsAny<Property>()))
                .ReturnsAsync((Property p) => p); // Retornar la misma propiedad
            _mockOwnerRepository
                .Setup(r => r.GetByIdAsync(propertyDto.IdOwner))
                .ReturnsAsync(owner);

            // Act
            var result = await _propertyService.CreatePropertyAsync(propertyDto);

            // Assert
            result.IdProperty.Should().Be(1);
            _mockPropertyRepository.Verify(
                r => r.AddAsync(It.Is<Property>(p => p.IdProperty == 1)),
                Times.Once
            );
        }

        #endregion

        #region UpdatePropertyAsync Tests

        [Test]
        public async Task UpdatePropertyAsync_ShouldReturnUpdatedProperty_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            var existingProperty = TestDataHelper.CreateTestProperty(propertyId);
            var updateDto = TestDataHelper.CreateTestPropertyDto(propertyId, 2, "Updated Property");
            var newOwner = TestDataHelper.CreateTestOwner(2, "New Owner");
            var image = TestDataHelper.CreateTestPropertyImage();

            _mockPropertyRepository
                .Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _mockOwnerRepository
                .Setup(r => r.GetByIdAsync(updateDto.IdOwner))
                .ReturnsAsync(newOwner);
            _mockPropertyImageRepository
                .Setup(r => r.GetFirstEnabledByPropertyIdAsync(propertyId))
                .ReturnsAsync(image);

            // Act
            var result = await _propertyService.UpdatePropertyAsync(propertyId, updateDto);

            // Assert
            result.Should().NotBeNull();
            result!.IdProperty.Should().Be(propertyId);
            result.Name.Should().Be("Updated Property");
            result.OwnerName.Should().Be("New Owner");
            result.IdOwner.Should().Be(2);
        }

        [Test]
        public async Task UpdatePropertyAsync_ShouldReturnNull_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            var updateDto = TestDataHelper.CreateTestPropertyDto();

            _mockPropertyRepository
                .Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _propertyService.UpdatePropertyAsync(propertyId, updateDto);

            // Assert
            result.Should().BeNull();
        }

        [Test]
        public async Task UpdatePropertyAsync_ShouldOnlyUpdateNonEmptyFields_WhenPartialUpdate()
        {
            // Arrange
            var propertyId = 1;
            var existingProperty = TestDataHelper.CreateTestProperty(propertyId);
            var originalName = existingProperty.Name;
            var originalPrice = existingProperty.Price;

            var partialUpdateDto = new PropertyDto
            {
                Name = "Updated Name", // Solo actualizar nombre
                Address = "", // Campo vacío - no debe actualizarse
                Price = 0, // Precio 0 - no debe actualizarse
                IdOwner = existingProperty.IdOwner,
            };

            var owner = TestDataHelper.CreateTestOwner(existingProperty.IdOwner);

            _mockPropertyRepository
                .Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _mockOwnerRepository
                .Setup(r => r.GetByIdAsync(existingProperty.IdOwner))
                .ReturnsAsync(owner);
            _mockPropertyImageRepository
                .Setup(r => r.GetFirstEnabledByPropertyIdAsync(propertyId))
                .ReturnsAsync((PropertyImage?)null);

            // Act
            var result = await _propertyService.UpdatePropertyAsync(propertyId, partialUpdateDto);

            // Assert
            result.Should().NotBeNull();
            result!.Name.Should().Be("Updated Name"); // Campo actualizado
            result.Address.Should().Be(partialUpdateDto.Address); // Campo original conservado
            result.Price.Should().Be(partialUpdateDto.Price); // Precio original conservado
        }

        #endregion

        #region DeletePropertyAsync Tests

        [Test]
        public async Task DeletePropertyAsync_ShouldReturnTrue_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            var existingProperty = TestDataHelper.CreateTestProperty(propertyId);

            _mockPropertyRepository
                .Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync(existingProperty);
            _mockPropertyRepository
                .Setup(r => r.DeleteAsync(existingProperty))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _propertyService.DeletePropertyAsync(propertyId);

            // Assert
            result.Should().BeTrue();
            _mockPropertyRepository.Verify(r => r.DeleteAsync(existingProperty), Times.Once);
        }

        [Test]
        public async Task DeletePropertyAsync_ShouldReturnFalse_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyRepository
                .Setup(r => r.GetByIdAsync(propertyId))
                .ReturnsAsync((Property?)null);

            // Act
            var result = await _propertyService.DeletePropertyAsync(propertyId);

            // Assert
            result.Should().BeFalse();
            _mockPropertyRepository.Verify(r => r.DeleteAsync(It.IsAny<Property>()), Times.Never);
        }

        #endregion

        #region PropertyExistsAsync Tests

        [Test]
        public async Task PropertyExistsAsync_ShouldReturnTrue_WhenPropertyExists()
        {
            // Arrange
            var propertyId = 1;
            _mockPropertyRepository.Setup(r => r.ExistsAsync(propertyId)).ReturnsAsync(true);

            // Act
            var result = await _propertyService.PropertyExistsAsync(propertyId);

            // Assert
            result.Should().BeTrue();
        }

        [Test]
        public async Task PropertyExistsAsync_ShouldReturnFalse_WhenPropertyDoesNotExist()
        {
            // Arrange
            var propertyId = 999;
            _mockPropertyRepository.Setup(r => r.ExistsAsync(propertyId)).ReturnsAsync(false);

            // Act
            var result = await _propertyService.PropertyExistsAsync(propertyId);

            // Assert
            result.Should().BeFalse();
        }

        #endregion
    }
}
