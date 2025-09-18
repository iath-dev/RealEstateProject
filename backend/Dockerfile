# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy solution and project files to restore dependencies
COPY ["RealEstate.sln", "RealEstate.sln"]
COPY ["src/RealEstate.API/RealEstate.API.csproj", "src/RealEstate.API/"]
COPY ["src/RealEstate.Core/RealEstate.Core.csproj", "src/RealEstate.Core/"]
COPY ["src/RealEstate.Infrastructure/RealEstate.Infrastructure.csproj", "src/RealEstate.Infrastructure/"]
COPY ["tests/RealEstate.Tests/RealEstate.Tests.csproj", "tests/RealEstate.Tests/"]

# Restore dependencies
RUN dotnet restore "RealEstate.sln"

# Copy the rest of the source code
COPY . .

# Build and publish the API
WORKDIR /src/src/RealEstate.API
RUN dotnet publish "RealEstate.API.csproj" -c Release -o /app/publish

# Stage 2: Final
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "RealEstate.API.dll"]
