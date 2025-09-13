using RealEstate.Core.Entities;

namespace RealEstate.Core.Interfaces.IRepositories
{
    public interface IOwnerRepository : IGenericRepository<Owner>
    {
        Task<Owner?> GetWithPropertiesAsync(int id);
    }
}
