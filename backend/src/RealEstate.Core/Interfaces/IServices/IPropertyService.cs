using RealEstate.Core.DTOs;

namespace RealEstate.Core.Interfaces.IServices
{
    public interface IPropertyService
    {
        Task<PagedResultDto<PropertyDto>> GetPropertiesAsync(PropertyFilterDto filters);
        Task<PropertyDetailDto?> GetPropertyByIdAsync(int id);
        Task<PropertyDto> CreatePropertyAsync(PropertyDto propertyDto);
        Task<PropertyDto?> UpdatePropertyAsync(int id, PropertyDto propertyDto);
        Task<bool> DeletePropertyAsync(int id);
        Task<bool> PropertyExistsAsync(int id);
    }
}
