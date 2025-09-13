using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Core.Entities
{
    public class Property
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int IdProperty { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("address")]
        public string Address { get; set; } = string.Empty;

        [BsonElement("price")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Price { get; set; }

        [BsonElement("codeInternal")]
        public string CodeInternal { get; set; } = string.Empty;

        [BsonElement("year")]
        public int Year { get; set; }

        [BsonElement("idOwner")]
        public int IdOwner { get; set; }

        [BsonIgnore]
        public virtual Owner? Owner { get; set; }

        [BsonIgnore]
        public virtual ICollection<PropertyImage> PropertyImages { get; set; } =
            new List<PropertyImage>();

        [BsonIgnore]
        public virtual ICollection<PropertyTrace> PropertyTraces { get; set; } =
            new List<PropertyTrace>();
    }
}
