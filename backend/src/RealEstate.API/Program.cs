using RealEstate.Core.Interfaces.IRepositories;
using RealEstate.Core.Interfaces.IServices;
using RealEstate.Infrastructure.Data;
using RealEstate.Infrastructure.Repositories;
using RealEstate.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();

// Register AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

// Configure MongoDB Context
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection("MongoDb"));

// Register MongoDB Context
builder.Services.AddSingleton<MongoDbContext>();

// Register Repositories
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();
builder.Services.AddScoped<IPropertyTraceRepository, PropertyTraceRepository>();

// Register Services
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IOwnerService, OwnerService>();

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new Microsoft.OpenApi.Models.OpenApiInfo
        {
            Title = "RealEstate API",
            Version = "v1",
            Description = "API for RealEstate application",
            Contact = new Microsoft.OpenApi.Models.OpenApiContact
            {
                Name = "Daniel Neira",
                Email = "jdnl95@gmail.com",
                Url = new Uri("https://danielneira-developer.vercel.app/"),
            },
        }
    );

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

builder.Services.AddCors(options =>
{
    // Política para desarrollo (más permisiva)
    options.AddPolicy(
        "DevelopmentPolicy",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://127.0.0.1:5173",
                    "http://localhost:5173",
                    "http://127.0.0.1:3000",
                    "http://localhost:3000"
                )
                .AllowAnyMethod() // GET, POST, PUT, DELETE, etc.
                .AllowAnyHeader() // Content-Type, Authorization, etc.
                .AllowCredentials() // Permite cookies y headers de autenticación
                .WithExposedHeaders("X-Total-Count", "X-Page-Number"); // Headers personalizados expuestos
        }
    );
});

// Add logging services
builder.Services.AddLogging(logging =>
{
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseCors("DevelopmentPolicy");
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "RealEstate API V1");
        options.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
        options.DisplayRequestDuration(); // Optional: Display request duration
        options.EnableTryItOutByDefault(); // Optional: Enable "Try it out" by default
        options.EnableDeepLinking(); // Optional: Enable deep linking
        options.ShowExtensions();
    });
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Logger.LogInformation("🚀 Real Estate API starting up...");
app.Logger.LogInformation(
    "📝 Swagger UI available at: {SwaggerUrl}",
    app.Environment.IsDevelopment() ? "https://localhost:5001" : "Disabled in production"
);

await app.RunAsync();
