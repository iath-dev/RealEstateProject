using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace RealEstate.Core.Entities
{
    public class PropertyTrace
    {
        [BsonId]
        [BsonRepresentation(BsonType.Int32)]
        public int IdPropertyTrace { get; set; }

        [BsonElement("dateSale")]
        public DateTime DateSale { get; set; }

        [BsonElement("name")]
        public string Name { get; set; } = string.Empty;

        [BsonElement("value")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Value { get; set; }

        [BsonElement("tax")]
        [BsonRepresentation(BsonType.Decimal128)]
        public decimal Tax { get; set; }

        [BsonElement("idProperty")]
        public int IdProperty { get; set; }

        [BsonIgnore]
        public virtual Property? Property { get; set; }
    }
}
