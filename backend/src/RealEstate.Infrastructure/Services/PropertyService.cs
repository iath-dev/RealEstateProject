using AutoMapper;
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
        private readonly IMapper _mapper;

        public PropertyService(
            IPropertyRepository propertyRepository,
            IOwnerRepository ownerRepository,
            IPropertyImageRepository propertyImageRepository,
            IPropertyTraceRepository propertyTraceRepository,
            IMapper mapper
        )
        {
            _propertyRepository = propertyRepository;
            _ownerRepository = ownerRepository;
            _propertyImageRepository = propertyImageRepository;
            _propertyTraceRepository = propertyTraceRepository;
            _mapper = mapper;
        }

        /// <summary>
        /// Gets a paginated list of properties based on the provided filters.
        /// </summary>
        /// <param name="filters">The filters to apply.</param>
        /// <returns>A paginated list of properties.</returns>
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

                var propertyDto = _mapper.Map<PropertyDto>(property);
                propertyDto.OwnerName = owner?.Name ?? string.Empty;
                propertyDto.Image = firstImage?.File;

                propertyDtos.Add(propertyDto);
            }

            return new PagedResultDto<PropertyDto>
            {
                Items = propertyDtos,
                TotalCount = pagedProperties.TotalCount,
                Page = pagedProperties.Page,
                PageSize = pagedProperties.PageSize,
            };
        }

        /// <summary>
        /// Gets the details of a specific property by its ID.
        /// </summary>
        /// <param name="id">The ID of the property.</param>
        /// <returns>The property details.</returns>
        public async Task<PropertyDetailDto?> GetPropertyByIdAsync(int id)
        {
            var property = await _propertyRepository.GetWithDetailsAsync(id);

            return property == null ? null : _mapper.Map<PropertyDetailDto>(property);
        }

        /// <summary>
        /// Creates a new property.
        /// </summary>
        /// <param name="propertyDto">The property data.</param>
        /// <returns>The created property.</returns>
        public async Task<PropertyDto> CreatePropertyAsync(PropertyDto propertyDto)
        {
            var existingProperties = await _propertyRepository.GetAllAsync();
            var newId = existingProperties.Any()
                ? existingProperties.Max(p => p.IdProperty) + 1
                : 1;

            var property = _mapper.Map<Property>(propertyDto);
            property.IdProperty = newId;

            await _propertyRepository.AddAsync(property);

            var owner = await _ownerRepository.GetByIdAsync(property.IdOwner);
            var resultDto = _mapper.Map<PropertyDto>(property);
            resultDto.OwnerName = owner?.Name ?? string.Empty;

            return resultDto;
        }

        /// <summary>
        /// Updates an existing property.
        /// </summary>
        /// <param name="id">The ID of the property to update.</param>
        /// <param name="propertyDto">The new property data.</param>
        /// <returns>The updated property.</returns>
        public async Task<PropertyDto?> UpdatePropertyAsync(int id, PropertyDto propertyDto)
        {
            var existingProperty = await _propertyRepository.GetByIdAsync(id);
            if (existingProperty == null)
                return null;

            _mapper.Map(propertyDto, existingProperty);
            existingProperty.IdProperty = id;

            await _propertyRepository.UpdateAsync(existingProperty);

            var owner = await _ownerRepository.GetByIdAsync(existingProperty.IdOwner);
            var firstImage = await _propertyImageRepository.GetFirstEnabledByPropertyIdAsync(
                existingProperty.IdProperty
            );

            var resultDto = _mapper.Map<PropertyDto>(existingProperty);
            resultDto.OwnerName = owner?.Name ?? string.Empty;
            resultDto.Image = firstImage?.File;

            return resultDto;
        }

        /// <summary>
        /// Deletes a property by its ID.
        /// </summary>
        /// <param name="id">The ID of the property to delete.</param>
        /// <returns>True if the property was deleted, otherwise false.</returns>
        public async Task<bool> DeletePropertyAsync(int id)
        {
            var property = await _propertyRepository.GetByIdAsync(id);
            if (property == null)
                return false;

            await _propertyRepository.DeleteAsync(property);
            return true;
        }

        /// <summary>
        /// Checks if a property exists by its ID.
        /// </summary>
        /// <param name="id">The ID of the property to check.</param>
        /// <returns>True if the property exists, otherwise false.</returns>
        public async Task<bool> PropertyExistsAsync(int id)
        {
            return await _propertyRepository.ExistsAsync(id);
        }
    }
}
