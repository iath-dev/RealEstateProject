// backend/data/seed/03-indexes.js

db = db.getSiblingDB("realestate");

// Índices para la colección owners
db.owners.createIndex({ name: "text" });
db.owners.createIndex({ createdAt: -1 });

// Índices para la colección properties
db.properties.createIndex({ name: "text", address: "text" });
db.properties.createIndex({ price: 1 });
db.properties.createIndex({ idOwner: 1 });
db.properties.createIndex({ year: 1 });
db.properties.createIndex({ codeInternal: 1 }, { unique: true });
db.properties.createIndex({ createdAt: -1 });

// Índice compuesto para filtros múltiples en properties
db.properties.createIndex({
  price: 1,
  year: 1,
  idOwner: 1,
});

// Índices para la colección property_images
db.property_images.createIndex({ idProperty: 1 });
db.property_images.createIndex({ enabled: 1 });
db.property_images.createIndex({ idProperty: 1, enabled: 1 });

// Índices para la colección property_traces
db.property_traces.createIndex({ idProperty: 1 });
db.property_traces.createIndex({ dateSale: -1 });
db.property_traces.createIndex({ idProperty: 1, dateSale: -1 });

print("✅ Database indexes created successfully for all collections");
