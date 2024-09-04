using SensorsAPI.Controllers;
using SensorsAPI.Services;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Configuration.AddEnvironmentVariables();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient();

// Add sensor configurations
var sensorConfigs = new List<SensorConfig>();

for (int i = 1; i <= 30; i++)
{
    TimeSpan interval;

    if (i % 30 < 9)
    {
        interval = TimeSpan.FromMinutes(5);
    }
    else if (i % 30 < 16)
    {
        interval = TimeSpan.FromMinutes(30);
    }
    else if (i % 30 < 23)
    {
        interval = TimeSpan.FromHours(1);
    }
    else
    {
        interval = TimeSpan.FromHours(3);
    }

    sensorConfigs.Add(new SensorConfig { SensorId = i, Interval = interval });
}

builder.Services.AddSingleton(sensorConfigs);

builder.Services.AddSingleton<TemperatureSensorController>(); 
builder.Services.AddHostedService<TemperatureReadingService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
