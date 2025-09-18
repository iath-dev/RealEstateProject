using MongoDB.Driver;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public class OwnerRepository : GenericRepository<Owner>, IOwnerRepository
    {
        private readonly MongoDbContext _context;

        public OwnerRepository(MongoDbContext context)
            : base(context, nameof(context.Owners))
        {
            _context = context;
        }

        public async Task<Owner?> GetWithPropertiesAsync(int id)
        {
            var owner = await GetByIdAsync(id);
            if (owner == null)
                return null;

            var properties = await _context
                .Properties.Find(p => p.IdOwner == owner.IdOwner)
                .ToListAsync();

            owner.Properties = properties;
            return owner;
        }

        protected override FilterDefinition<Owner> CreateIdFilter(int id)
        {
            return Builders<Owner>.Filter.Eq(o => o.IdOwner, id);
        }

        protected override int GetEntityId(Owner entity)
        {
            return entity.IdOwner;
        }
    }
}
