using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Core.Interfaces.IServices;

namespace RealEstate.Infrastructure.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IPropertyRepository _propertyRepository;
        private readonly IOwnerRepository _ownerRepository;
        private readonly IPropertyImageRepository _propertyImageRepository;
        private readonly IPropertyTraceRepository _propertyTraceRepository;

        public PropertyService(
            IPropertyRepository propertyRepository,
            IOwnerRepository ownerRepository,
            IPropertyImageRepository propertyImageRepository,
            IPropertyTraceRepository propertyTraceRepository
        )
        {
            _propertyRepository = propertyRepository;
            _ownerRepository = ownerRepository;
            _propertyImageRepository = propertyImageRepository;
            _propertyTraceRepository = propertyTraceRepository;
        }

        public async Task<PagedResultDto<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filters)
        {
            var pagedProperties = await _propertyRepository.GetPagedByFiltersAsync(filters);
            var propertyDtos = new List<PropertyDto>();

            foreach (var property in pagedProperties.Items)
            {
                var owner = await _ownerRepository.GetByIdAsync(property.IdOwner);
                var firstImage = await _propertyImageRepository.GetFirstEnabledByPropertyIdAsync(
                    property.IdProperty
                );

                propertyDtos.Add(
                    new PropertyDto
                    {
                        IdProperty = property.IdProperty,
                        Name = property.Name,
                        Address = property.Address,
                        Price = property.Price,
                        CodeInternal = property.CodeInternal,
                        Year = property.Year,
                        IdOwner = property.IdOwner,
                        OwnerName = owner?.Name ?? string.Empty,
                        Image = firstImage?.File,
                    }
                );
            }

            return new PagedResultDto<PropertyDto>
            {
                Items = propertyDtos,
                TotalCount = pagedProperties.TotalCount,
                Page = pagedProperties.Page,
                PageSize = pagedProperties.PageSize,
            };
        }

        public async Task<PropertyDetailDto?> GetPropertyByIdAsync(int id)
        {
            var property = await _propertyRepository.GetWithDetailsAsync(id);
            if (property == null)
                return null;

            var images = await _propertyImageRepository.GetByPropertyIdAsync(id);
            var traces = await _propertyTraceRepository.GetByPropertyIdAsync(id);

            return new PropertyDetailDto
            {
                IdProperty = property.IdProperty,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                CodeInternal = property.CodeInternal,
                Year = property.Year,
                Owner =
                    property.Owner != null
                        ? new OwnerDto
                        {
                            IdOwner = property.Owner.IdOwner,
                            Name = property.Owner.Name,
                            Address = property.Owner.Address,
                            Photo = property.Owner.Photo,
                            Birthday = property.Owner.Birthday,
                        }
                        : new OwnerDto(),
                Images = images
                    .Select(img => new PropertyImageDto
                    {
                        IdPropertyImage = img.IdPropertyImage,
                        File = img.File,
                        Enabled = img.Enabled,
                    })
                    .ToList(),
            };
        }

        public async Task<PropertyDto> CreatePropertyAsync(PropertyDto propertyDto)
        {
            // Generar nuevo ID (en un escenario real, MongoDB puede manejar esto automáticamente)
            var existingProperties = await _propertyRepository.GetAllAsync();
            var newId = existingProperties.Any()
                ? existingProperties.Max(p => p.IdProperty) + 1
                : 1;

            var property = new Property
            {
                IdProperty = newId,
                Name = propertyDto.Name,
                Address = propertyDto.Address,
                Price = propertyDto.Price,
                CodeInternal = propertyDto.CodeInternal,
                Year = propertyDto.Year,
                IdOwner = propertyDto.IdOwner,
            };

            await _propertyRepository.AddAsync(property);

            // Retornar el DTO actualizado
            var owner = await _ownerRepository.GetByIdAsync(property.IdOwner);
            propertyDto.IdProperty = property.IdProperty;
            propertyDto.OwnerName = owner?.Name ?? string.Empty;

            return propertyDto;
        }

        public async Task<PropertyDto?> UpdatePropertyAsync(int id, PropertyDto propertyDto)
        {
            var existingProperty = await _propertyRepository.GetByIdAsync(id);
            if (existingProperty == null)
                return null;

            existingProperty.Name = propertyDto.Name;
            existingProperty.Address = propertyDto.Address;
            existingProperty.Price = propertyDto.Price;
            existingProperty.CodeInternal = propertyDto.CodeInternal;
            existingProperty.Year = propertyDto.Year;
            existingProperty.IdOwner = propertyDto.IdOwner;

            await _propertyRepository.UpdateAsync(existingProperty);

            var owner = await _ownerRepository.GetByIdAsync(existingProperty.IdOwner);
            var firstImage = await _propertyImageRepository.GetFirstEnabledByPropertyIdAsync(
                existingProperty.IdProperty
            );

            return new PropertyDto
            {
                IdProperty = existingProperty.IdProperty,
                Name = existingProperty.Name,
                Address = existingProperty.Address,
                Price = existingProperty.Price,
                CodeInternal = existingProperty.CodeInternal,
                Year = existingProperty.Year,
                IdOwner = existingProperty.IdOwner,
                OwnerName = owner?.Name ?? string.Empty,
                Image = firstImage?.File,
            };
        }

        public async Task<bool> DeletePropertyAsync(int id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
                return false;

            await _propertyRepository.DeleteAsync(property);
            return true;
        }

        public async Task<bool> PropertyExistsAsync(int id)
        {
            return await _propertyRepository.ExistsAsync(id);
        }
    }
}
