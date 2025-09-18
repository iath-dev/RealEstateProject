using System.Linq.Expressions;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;

namespace RealEstate.Core.Interfaces.IRepositories
{
    public interface IPropertyRepository : IGenericRepository<Property>
    {
        Task<PagedResultDto<Property>> GetPagedAsync(
            int page,
            int pageSize,
            Expression<Func<Property, bool>>? filter = null
        );

        Task<Property?> GetWithDetailsAsync(int id);

        Task<IEnumerable<Property>> GetByFiltersAsync(PropertyFilterDto filters);

        Task<PagedResultDto<Property>> GetPagedByFiltersAsync(PropertyFilterDto filters);
    }
}
