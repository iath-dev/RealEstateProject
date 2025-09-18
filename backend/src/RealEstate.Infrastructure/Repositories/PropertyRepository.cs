using System.Linq.Expressions;
using MongoDB.Driver;
using RealEstate.Core.DTOs;
using RealEstate.Core.Entities;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public class PropertyRepository : GenericRepository<Property>, IPropertyRepository
    {
        private readonly MongoDbContext _context;

        public PropertyRepository(MongoDbContext context)
            : base(context, nameof(context.Properties))
        {
            _context = context;
        }

        public async Task<PagedResultDto<Property>> GetPagedAsync(
            int page,
            int pageSize,
            Expression<Func<Property, bool>>? filter = null
        )
        {
            var filterDefinition =
                filter != null
                    ? Builders<Property>.Filter.Where(filter)
                    : Builders<Property>.Filter.Empty;

            var totalCount = (int)await _collection.CountDocumentsAsync(filterDefinition);

            var items = await _collection
                .Find(filterDefinition)
                .Skip((page - 1) * pageSize)
                .Limit(pageSize)
                .ToListAsync();

            return new PagedResultDto<Property>
            {
                Items = items,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
            };
        }

        public async Task<Property?> GetWithDetailsAsync(int id)
        {
            var agg = _context
                .Properties.Aggregate()
                .Match(p => p.IdProperty == id)
                .Lookup<Property, Owner, Property>(
                    _context.Owners,
                    p => p.IdOwner,
                    o => o.IdOwner,
                    p => p.Owner
                )
                .Unwind<Property, Property>(
                    p => p.Owner,
                    new AggregateUnwindOptions<Property> { PreserveNullAndEmptyArrays = true }
                )
                .Lookup<Property, PropertyImage, Property>(
                    _context.PropertyImages,
                    p => p.IdProperty,
                    i => i.IdProperty,
                    p => p.PropertyImages
                )
                .Lookup<Property, PropertyTrace, Property>(
                    _context.PropertyTraces,
                    p => p.IdProperty,
                    t => t.IdProperty,
                    p => p.PropertyTraces
                );

            var result = await agg.FirstOrDefaultAsync();
            return result;
        }

        public async Task<IEnumerable<Property>> GetByFiltersAsync(PropertyFilterDto filters)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(filters.Name))
            {
                filter &= filterBuilder.Regex(
                    p => p.Name,
                    new MongoDB.Bson.BsonRegularExpression(filters.Name, "i")
                );
            }

            if (!string.IsNullOrEmpty(filters.Address))
            {
                filter &= filterBuilder.Regex(
                    p => p.Address,
                    new MongoDB.Bson.BsonRegularExpression(filters.Address, "i")
                );
            }

            if (filters.MinPrice.HasValue)
            {
                filter &= filterBuilder.Gte(p => p.Price, filters.MinPrice.Value);
            }

            if (filters.MaxPrice.HasValue)
            {
                filter &= filterBuilder.Lte(p => p.Price, filters.MaxPrice.Value);
            }

            return await _collection.Find(filter).ToListAsync();
        }

        public async Task<PagedResultDto<Property>> GetPagedByFiltersAsync(
            PropertyFilterDto filters
        )
        {
            var filterBuilder = Builders<Property>.Filter;
            var filter = filterBuilder.Empty;

            if (!string.IsNullOrEmpty(filters.Name))
            {
                filter &= filterBuilder.Regex(
                    p => p.Name,
                    new MongoDB.Bson.BsonRegularExpression(filters.Name, "i")
                );
            }

            if (!string.IsNullOrEmpty(filters.Address))
            {
                filter &= filterBuilder.Regex(
                    p => p.Address,
                    new MongoDB.Bson.BsonRegularExpression(filters.Address, "i")
                );
            }

            if (filters.MinPrice.HasValue)
            {
                filter &= filterBuilder.Gte(p => p.Price, filters.MinPrice.Value);
            }

            if (filters.MaxPrice.HasValue)
            {
                filter &= filterBuilder.Lte(p => p.Price, filters.MaxPrice.Value);
            }

            var totalCount = (int)await _collection.CountDocumentsAsync(filter);

            var items = await _collection
                .Find(filter)
                .Skip((filters.Page - 1) * filters.PageSize)
                .Limit(filters.PageSize)
                .ToListAsync();

            return new PagedResultDto<Property>
            {
                Items = items,
                TotalCount = totalCount,
                Page = filters.Page,
                PageSize = filters.PageSize,
            };
        }

        protected override FilterDefinition<Property> CreateIdFilter(int id)
        {
            return Builders<Property>.Filter.Eq(p => p.IdProperty, id);
        }

        protected override int GetEntityId(Property entity)
        {
            return entity.IdProperty;
        }
    }
}
