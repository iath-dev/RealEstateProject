using Microsoft.Extensions.Options;
using MongoDB.Driver;
using RealEstate.Core.Entities;

namespace RealEstate.Infrastructure.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
        }

        public IMongoCollection<Property> Properties =>
            _database.GetCollection<Property>("properties");

        public IMongoCollection<Owner> Owners => _database.GetCollection<Owner>("owners");

        public IMongoCollection<PropertyImage> PropertyImages =>
            _database.GetCollection<PropertyImage>("propertyImages");

        public IMongoCollection<PropertyTrace> PropertyTraces =>
            _database.GetCollection<PropertyTrace>("propertyTraces");
    }

    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}
