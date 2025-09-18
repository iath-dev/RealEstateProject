using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Core.Entities
{
    public class Owner
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int IdOwner { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("address")]
        public string Address { get; set; } = string.Empty;

        [BsonElement("photo")]
        public string Photo { get; set; } = string.Empty;

        [BsonElement("birthday")]
        public DateTime Birthday { get; set; }

        [BsonIgnore]
        public virtual ICollection<Property> Properties { get; set; } = new List<Property>();
    }
}
