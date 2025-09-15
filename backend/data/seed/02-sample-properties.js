// backend/data/seed/02-sample-properties.js

db = db.getSiblingDB("realestate");

// Clean existing collections
db.owners.deleteMany({});
db.properties.deleteMany({});
db.property_images.deleteMany({});
db.property_traces.deleteMany({});

// Insert owners
const owners = [
  {
    _id: 1,
    name: "María García Rodríguez",
    address: "Carrera 15 #45-67, Barrio El Peñón, Cali",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    birthday: new Date("1985-03-15T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 2,
    name: "Carlos Andrés Rodríguez",
    address: "Calle 70 #23-45, Barrio Granada, Cali",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    birthday: new Date("1978-11-22T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 3,
    name: "Ana Lucía Martínez",
    address: "Av. Roosevelt #34-56, Barrio Normandía, Cali",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    birthday: new Date("1990-07-08T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 4,
    name: "Luis Fernando Hernández",
    address: "Calle 5 #12-34, Barrio San Antonio, Cali",
    photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400",
    birthday: new Date("1982-12-03T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 5,
    name: "Sofía Elena López",
    address: "Carrera 100 #15-25, Ciudad Jardín, Cali",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    birthday: new Date("1987-05-20T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: 6,
    name: "Miguel Ángel Torres",
    address: "Km 18 Vía Pance, Cali",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    birthday: new Date("1975-09-14T00:00:00Z"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
db.owners.insertMany(owners);

// Insert properties
const properties = [
  {
    _id: 1,
    name: "Casa Moderna en Zona Norte",
    address: "Av. Principal 123, Zona Norte, Cali",
    price: NumberDecimal("350000.00"),
    codeInternal: "PROP-2024-001",
    year: 2020,
    idOwner: 1,
    createdAt: new Date("2024-01-10T10:00:00Z"),
    updatedAt: new Date("2024-01-10T10:00:00Z"),
  },
  {
    _id: 2,
    name: "Apartamento Céntrico con Vista",
    address: "Calle 5 #45-67, Centro, Cali",
    price: NumberDecimal("180000.00"),
    codeInternal: "PROP-2024-002",
    year: 2018,
    idOwner: 2,
    createdAt: new Date("2024-01-11T14:30:00Z"),
    updatedAt: new Date("2024-01-11T14:30:00Z"),
  },
  {
    _id: 3,
    name: "Casa Familiar con Jardín",
    address: "Carrera 15 #78-90, Normandía, Cali",
    price: NumberDecimal("280000.00"),
    codeInternal: "PROP-2024-003",
    year: 2019,
    idOwner: 3,
    createdAt: new Date("2024-01-12T09:15:00Z"),
    updatedAt: new Date("2024-01-12T09:15:00Z"),
  },
  {
    _id: 4,
    name: "Penthouse de Lujo",
    address: "Av. Roosevelt #34-56, Granada, Cali",
    price: NumberDecimal("450000.00"),
    codeInternal: "PROP-2024-004",
    year: 2021,
    idOwner: 1,
    createdAt: new Date("2024-01-13T16:45:00Z"),
    updatedAt: new Date("2024-01-13T16:45:00Z"),
  },
  {
    _id: 5,
    name: "Casa de Campo con Piscina",
    address: "Km 18 Vía Pance, Cali",
    price: NumberDecimal("420000.00"),
    codeInternal: "PROP-2024-005",
    year: 2022,
    idOwner: 4,
    createdAt: new Date("2024-01-14T11:20:00Z"),
    updatedAt: new Date("2024-01-14T11:20:00Z"),
  },
  {
    _id: 6,
    name: "Apartamento Estudiantil",
    address: "Calle 70 #23-45, Cerca Universidad, Cali",
    price: NumberDecimal("120000.00"),
    codeInternal: "PROP-2024-006",
    year: 2017,
    idOwner: 5,
    createdAt: new Date("2024-01-15T08:00:00Z"),
    updatedAt: new Date("2024-01-15T08:00:00Z"),
  },
  {
    _id: 7,
    name: "Casa Tradicional Restaurada",
    address: "Barrio San Antonio, Cali",
    price: NumberDecimal("220000.00"),
    codeInternal: "PROP-2024-007",
    year: 1995,
    idOwner: 2,
    createdAt: new Date("2024-01-16T13:10:00Z"),
    updatedAt: new Date("2024-01-16T13:10:00Z"),
  },
  {
    _id: 8,
    name: "Loft Industrial",
    address: "Zona Rosa, Cali",
    price: NumberDecimal("190000.00"),
    codeInternal: "PROP-2024-008",
    year: 2016,
    idOwner: 3,
    createdAt: new Date("2024-01-17T15:30:00Z"),
    updatedAt: new Date("2024-01-17T15:30:00Z"),
  },
  {
    _id: 9,
    name: "Villa con Vista a las Montañas",
    address: "Alto de las Palmas, Cali",
    price: NumberDecimal("520000.00"),
    codeInternal: "PROP-2024-009",
    year: 2023,
    idOwner: 6,
    createdAt: new Date("2024-01-18T10:45:00Z"),
    updatedAt: new Date("2024-01-18T10:45:00Z"),
  },
  {
    _id: 10,
    name: "Duplex en Conjunto Cerrado",
    address: "Ciudad Jardín, Cali",
    price: NumberDecimal("310000.00"),
    codeInternal: "PROP-2024-010",
    year: 2020,
    idOwner: 4,
    createdAt: new Date("2024-01-19T12:00:00Z"),
    updatedAt: new Date("2024-01-19T12:00:00Z"),
  },
];
db.properties.insertMany(properties);

// Get all properties to create related data
const allProperties = db.properties.find().toArray();
const propertyImages = [];
const propertyTraces = [];
let imageIdCounter = 1;
let traceIdCounter = 1;

const sampleImages = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=800",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800"
];

allProperties.forEach(property => {
    // Add 5 to 10 images for each property
    const imageCount = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < imageCount; i++) {
        propertyImages.push({
            _id: imageIdCounter++,
            idProperty: property._id,
            file: sampleImages[Math.floor(Math.random() * sampleImages.length)],
            enabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }

    // Add 1 or 2 traces for each property
    const traceCount = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < traceCount; i++) {
        const saleDate = new Date(property.createdAt.getTime() - (i * 365 * 24 * 60 * 60 * 1000 * (Math.random() * 2 + 1))); // 1-3 years ago
        const saleValue = NumberDecimal(String(parseFloat(property.price.toString()) * (1 - i * 0.15))); // decrease price for older sales
        const tax = NumberDecimal(String(parseFloat(saleValue.toString()) * 0.06)); // 6% tax

        propertyTraces.push({
            _id: traceIdCounter++,
            dateSale: saleDate,
            name: i === 0 ? "Venta Inicial" : "Compra Anterior",
            value: saleValue,
            tax: tax,
            idProperty: property._id,
            createdAt: new Date(),
            updatedAt: new Date()
        });
    }
});

if (propertyImages.length > 0) {
    db.property_images.insertMany(propertyImages);
}

if (propertyTraces.length > 0) {
    db.property_traces.insertMany(propertyTraces);
}

var ownersCount = db.owners.countDocuments();
var propertiesCount = db.properties.countDocuments();
var imagesCount = db.property_images.countDocuments();
var tracesCount = db.property_traces.countDocuments();

print("✅ Complete sample data inserted successfully");
print("👥 Owners inserted: " + ownersCount);
print("🏠 Properties inserted: " + propertiesCount);
print("📸 Property images inserted: " + imagesCount);
print("📊 Property traces inserted: " + tracesCount);
