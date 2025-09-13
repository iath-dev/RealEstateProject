using System.Linq.Expressions;
using MongoDB.Driver;
using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Infrastructure.Data;

namespace RealEstate.Infrastructure.Repositories
{
    public abstract class GenericRepository<T> : IGenericRepository<T>
        where T : class
    {
        protected readonly IMongoCollection<T> _collection;

        protected GenericRepository(MongoDbContext context, string collectionName)
        {
            _collection =
                context.GetType().GetProperty(collectionName)?.GetValue(context)
                    as IMongoCollection<T>
                ?? throw new ArgumentException($"Collection {collectionName} not found");
        }

        public virtual async Task<T?> GetByIdAsync(int id)
        {
            var filter = CreateIdFilter(id);
            return await _collection.Find(filter).FirstOrDefaultAsync();
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _collection.Find(_ => true).ToListAsync();
        }

        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> expression)
        {
            return await _collection.Find(expression).ToListAsync();
        }

        public virtual async Task<T> AddAsync(T entity)
        {
            await _collection.InsertOneAsync(entity);
            return entity;
        }

        public virtual async Task UpdateAsync(T entity)
        {
            var id = GetEntityId(entity);
            var filter = CreateIdFilter(id);
            await _collection.ReplaceOneAsync(filter, entity);
        }

        public virtual async Task DeleteAsync(T entity)
        {
            var id = GetEntityId(entity);
            var filter = CreateIdFilter(id);
            await _collection.DeleteOneAsync(filter);
        }

        public virtual async Task<bool> ExistsAsync(int id)
        {
            var filter = CreateIdFilter(id);
            var count = await _collection.CountDocumentsAsync(filter);
            return count > 0;
        }

        public virtual async Task<int> CountAsync()
        {
            return (int)await _collection.CountDocumentsAsync(_ => true);
        }

        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> expression)
        {
            return (int)await _collection.CountDocumentsAsync(expression);
        }

        protected abstract FilterDefinition<T> CreateIdFilter(int id);
        protected abstract int GetEntityId(T entity);
    }
}
