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
const propertyTypes = ["Casa", "Apartamento", "Penthouse", "Loft", "Villa", "Duplex", "Finca"];
const propertyAdjectives = ["Moderno", "Lujoso", "Amplio", "Céntrico", "Restaurado", "Familiar", "Industrial", "Tradicional"];
const propertyFeatures = ["con Vista", "con Jardín", "con Piscina", "en Zona Norte", "en Conjunto Cerrado", "cerca a Universidad"];
const streetTypes = ["Calle", "Carrera", "Avenida", "Transversal"];
const neighborhoods = ["El Peñón", "Granada", "Normandía", "San Antonio", "Ciudad Jardín", "Pance", "Centro", "Zona Rosa", "Alto de las Palmas"];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

const generatedProperties = [];
const numberOfProperties = 40;
const existingOwnerIds = owners.map(o => o._id);

for (let i = 1; i <= numberOfProperties; i++) {
    const name = `${getRandomItem(propertyTypes)} ${getRandomItem(propertyAdjectives)} ${getRandomItem(propertyFeatures)}`;
    const address = `${getRandomItem(streetTypes)} ${Math.floor(Math.random() * 100) + 1} #${Math.floor(Math.random() * 100) + 1}-${Math.floor(Math.random() * 100) + 1}, ${getRandomItem(neighborhoods)}, Cali`;
    const price = NumberDecimal(String(Math.floor(Math.random() * (8000 - 1000 + 1) + 1000) * 100)); // 100,000 to 800,000
    const year = Math.floor(Math.random() * (2024 - 1990 + 1)) + 1990;
    const creationDate = new Date(new Date() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)); // Within the last year

    generatedProperties.push({
        _id: i,
        name: name,
        address: address,
        price: price,
        codeInternal: `PROP-2024-${String(i).padStart(3, '0')}`,
        year: year,
        idOwner: getRandomItem(existingOwnerIds),
        createdAt: creationDate,
        updatedAt: creationDate,
    });
}

db.properties.insertMany(generatedProperties);

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
