// backend/data/seed/01-init-database.js

// Cambiar a la base de datos realestate
db = db.getSiblingDB("realestate");

// Crear usuario específico para la aplicación
db.createUser({
  user: "realestate_user",
  pwd: "realestate_password",
  roles: [
    {
      role: "readWrite",
      db: "realestate",
    },
  ],
});

// Crear colecciones según el esquema
db.createCollection("owners");
db.createCollection("properties");
db.createCollection("property_images");
db.createCollection("property_traces");

print("✅ Database initialized successfully");
