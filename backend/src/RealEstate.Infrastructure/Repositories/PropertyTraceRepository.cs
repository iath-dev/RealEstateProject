using MongoDB.Driver;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public class PropertyTraceRepository
        : GenericRepository<PropertyTrace>,
            IPropertyTraceRepository
    {
        public PropertyTraceRepository(MongoDbContext context)
            : base(context, nameof(context.PropertyTraces)) { }

        public async Task<IEnumerable<PropertyTrace>> GetByPropertyIdAsync(int propertyId)
        {
            return await _collection.Find(trace => trace.IdProperty == propertyId).ToListAsync();
        }

        protected override FilterDefinition<PropertyTrace> CreateIdFilter(int id)
        {
            return Builders<PropertyTrace>.Filter.Eq(trace => trace.IdPropertyTrace, id);
        }

        protected override int GetEntityId(PropertyTrace entity)
        {
            return entity.IdPropertyTrace;
        }
    }
}
