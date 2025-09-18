using RealEstate.Core.Entities;

namespace RealEstate.Core.Interfaces.IRepositories
{
    public interface IPropertyTraceRepository : IGenericRepository<PropertyTrace>
    {
        Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(int propertyId);
    }
}
