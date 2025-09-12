var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddControllers();

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
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
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
app.Run();
