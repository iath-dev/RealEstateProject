# Real Estate API Backend

This is the backend for the Real Estate project, developed with .NET 9, C#, and MongoDB, following the database schema specified in the project requirements.

## Architecture

The project follows a layered architecture pattern:

- **RealEstate.API**: Presentation layer containing controllers and DTOs.
- **RealEstate.Core**: Domain layer with entities, interfaces, and business logic.
- **RealEstate.Infrastructure**: Infrastructure layer responsible for data access and external services.

## Database Schema

The project fully implements the schema defined in the technical test:

### Entities

1. **Owner**

   - `IdOwner` (int, PK)
   - `Name` (string)
   - `Address` (string)
   - `Photo` (string)
   - `Birthday` (DateTime)

2. **Property**

   - `IdProperty` (int, PK)
   - `Name` (string)
   - `Address` (string)
   - `Price` (decimal)
   - `CodeInternal` (string)
   - `Year` (int)
   - `IdOwner` (int, FK)

3. **PropertyImage**

   - `IdPropertyImage` (int, PK)
   - `IdProperty` (int, FK)
   - `File` (string)
   - `Enabled` (bool)

4. **PropertyTrace**
   - `IdPropertyTrace` (int, PK)
   - `DateSale` (DateTime)
   - `Name` (string)
   - `Value` (decimal)
   - `Tax` (decimal)
   - `IdProperty` (int, FK)

## API Endpoints

### Properties

- `GET /api/properties`: Get all properties with filtering and pagination.
- `GET /api/properties/{id}`: Get a property by its ID.
- `POST /api/properties`: Create a new property.
- `PUT /api/properties/{id}`: Update an existing property.
- `DELETE /api/properties/{id}`: Delete a property.

### Owners

- `GET /api/owners`: Get all owners.
- `GET /api/owners/{id}`: Get an owner by their ID.
- `POST /api/owners`: Create a new owner.
- `PUT /api/owners/{id}`: Update an existing owner.
- `DELETE /api/owners/{id}`: Delete an owner.

## Available Filters

The API allows filtering properties by:

- Name (partial search)
- Address (partial search)
- Price range (minPrice, maxPrice)
- Pagination (page, pageSize)

## Development

The entire project, including this backend, is designed to be run via Docker. Please see the [main README file](../../README.md) for instructions on how to start the application.

### Running Tests

To run the unit and integration tests for the backend, you can use the following command from the root of the project:

```sh
make test
```

Alternatively, you can run the tests directly from the `backend` directory:

```sh
dotnet test
```

### Running Locally

While the recommended approach is to use Docker, you can run the backend locally for development:

```sh
dotnet run --project src/RealEstate.API
```

**Note on Ports:**

- When running locally, the API will be available at `http://localhost:5129`.
- When running inside Docker, the API is exposed on `http://localhost:8080`.
