using Microsoft.EntityFrameworkCore;
using MonitoringStationAPI.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add DbContext with SQLite connection
builder.Services.AddDbContext<IoTDataCollectorDBContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SQLiteConnection")));

// Add Swagger for API documentation
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Automatically apply database migrations during startup
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<IoTDataCollectorDBContext>();
    dbContext.Database.Migrate(); // This will apply any pending migrations
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(builder => builder
    .WithOrigins("http://13.60.33.37:3000") 
    .AllowAnyHeader()
    .AllowAnyMethod());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
