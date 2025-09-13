using RealEstate.Core.Entities;

namespace RealEstate.Core.Interfaces.IRepositories
{
    public interface IPropertyImageRepository : IGenericRepository<PropertyImage>
    {
        Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(int propertyId);
        Task<PropertyImage?> GetFirstEnabledByPropertyIdAsync(int propertyId);
    }
}
