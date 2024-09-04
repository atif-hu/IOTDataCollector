using SensorsAPI.Controllers;

namespace SensorsAPI.Services
{
    public class TemperatureReadingService : BackgroundService
    {
        private readonly IServiceProvider _services;
        private readonly List<SensorConfig> _sensorConfigs;

        public TemperatureReadingService(IServiceProvider services, List<SensorConfig> sensorConfigs)
        {
            _services = services;
            _sensorConfigs = sensorConfigs;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            var sensorTasks = _sensorConfigs.Select(config => MonitorSensorAsync(config, stoppingToken)).ToArray();
            await Task.WhenAll(sensorTasks);
        }

        private async Task MonitorSensorAsync(SensorConfig config, CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                using (var scope = _services.CreateScope())
                {
                    var temperatureSensorController = scope.ServiceProvider.GetRequiredService<TemperatureSensorController>();
                    await temperatureSensorController.GetTemperature(config.SensorId, (int)config.Interval.TotalMinutes);
                }

                await Task.Delay(config.Interval, stoppingToken);
            }
        }
    }

    public class SensorConfig
    {
        public int SensorId { get; set; }
        public TimeSpan Interval { get; set; }
    }

}
