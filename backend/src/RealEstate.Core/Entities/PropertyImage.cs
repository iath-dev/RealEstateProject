using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Core.Entities
{
    public class PropertyImage
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int IdPropertyImage { get; set; }

        [BsonElement("idProperty")]
        public int IdProperty { get; set; }

        [BsonElement("file")]
        public string File { get; set; } = string.Empty;

        [BsonElement("enabled")]
        public bool Enabled { get; set; }

        [BsonIgnore]
        public virtual Property? Property { get; set; }
    }
}
