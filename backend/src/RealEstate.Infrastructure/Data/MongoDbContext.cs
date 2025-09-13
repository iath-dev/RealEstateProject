using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using RealEstate.Core.Entities;

namespace RealEstate.Infrastructure.Data
{
    public class MongoDbContext
    {
        private readonly IMongoDatabase _database;

        public MongoDbContext(IOptions<MongoDbSettings> settings)
        {
            ConfigureMongoDb();

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

        private static void ConfigureMongoDb()
        {
            // Solo configurar una vez
            if (!BsonClassMap.IsClassMapRegistered(typeof(Owner)))
            {
                // Configurar convenciones
                var conventionPack = new ConventionPack
                {
                    new IgnoreExtraElementsConvention(true), // Ignora campos extra
                    new CamelCaseElementNameConvention(),
                    new EnumRepresentationConvention(MongoDB.Bson.BsonType.String),
                };
                ConventionRegistry.Register("ApplicationConventions", conventionPack, t => true);

                // Mapear entidades con configuración específica
                BsonClassMap.RegisterClassMap<Owner>(cm =>
                {
                    cm.AutoMap();
                    cm.SetIgnoreExtraElements(true); // Ignora campos extra específicamente para Owner
                    cm.MapIdMember(c => c.IdOwner);
                });

                BsonClassMap.RegisterClassMap<Property>(cm =>
                {
                    cm.AutoMap();
                    cm.SetIgnoreExtraElements(true);
                    cm.MapIdMember(c => c.IdProperty);
                });

                BsonClassMap.RegisterClassMap<PropertyImage>(cm =>
                {
                    cm.AutoMap();
                    cm.SetIgnoreExtraElements(true);
                    cm.MapIdMember(c => c.IdPropertyImage);
                });

                BsonClassMap.RegisterClassMap<PropertyTrace>(cm =>
                {
                    cm.AutoMap();
                    cm.SetIgnoreExtraElements(true);
                    cm.MapIdMember(c => c.IdPropertyTrace);
                });
            }
        }
    }

    public class MongoDbSettings
    {
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}
