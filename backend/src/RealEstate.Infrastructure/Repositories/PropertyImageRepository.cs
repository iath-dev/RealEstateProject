using MongoDB.Driver;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public class PropertyImageRepository
        : GenericRepository<PropertyImage>,
            IPropertyImageRepository
    {
        public PropertyImageRepository(MongoDbContext context)
            : base(context, nameof(context.PropertyImages)) { }

        public async Task<IEnumerable<PropertyImage>> GetByPropertyIdAsync(int propertyId)
        {
            return await _collection.Find(img => img.IdProperty == propertyId).ToListAsync();
        }

        public async Task<PropertyImage?> GetFirstEnabledByPropertyIdAsync(int propertyId)
        {
            return await _collection
                .Find(img => img.IdProperty == propertyId && img.Enabled)
                .FirstOrDefaultAsync();
        }

        protected override FilterDefinition<PropertyImage> CreateIdFilter(int id)
        {
            return Builders<PropertyImage>.Filter.Eq(img => img.IdPropertyImage, id);
        }

        protected override int GetEntityId(PropertyImage entity)
        {
            return entity.IdPropertyImage;
        }
    }
}
