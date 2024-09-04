using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Sensors;
using SensorsAPI.Models;

namespace SensorsAPI.Controllers
{
    [Route("api/temperature-sensor")]
    [ApiController]
    public class TemperatureSensorController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;

        public TemperatureSensorController(IHttpClientFactory httpClientFactory, IConfiguration configuration)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<ActionResult<double>> GetTemperature(int sensorId,int interval)
        {
            try
            {
                int MINTHRESHOLDVALUE = -10;
                int MAXTHRESHOLDVALUE = 40;
                var Sensor = new TemperatureSensor();
                double temperatureValue = Sensor.GetTemperature();

                bool warning= false;

                if(temperatureValue > MAXTHRESHOLDVALUE || temperatureValue < MINTHRESHOLDVALUE)
                {
                    warning = true;
                    Console.WriteLine("----------------------------------------------------------------------------------------------------");
                    Console.WriteLine($"Warning: Temperature levels have crossed the normal threshold with {temperatureValue} C.");
                    Console.WriteLine("----------------------------------------------------------------------------------------------------");
                }

                TimeZoneInfo ukTimeZone = TimeZoneInfo.FindSystemTimeZoneById("GMT Standard Time");
                DateTime ukTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, ukTimeZone);

                var temperatureData = new SensorsData
                {
                    id = 0,
                    SensorId = sensorId,
                    SensorName = "Temperature",
                    Unit = "Celcius",
                    ParameterValue = temperatureValue,
                    TimeStamp = ukTime,
                    Alert = warning,
                    DataCollectionInterval = $"{interval} minutes"
                };

                var jsonData = JsonSerializer.Serialize(temperatureData);
                var content = new StringContent(jsonData, Encoding.UTF8, "application/json");

                using (var httpClient = _httpClientFactory.CreateClient())
                {
                    httpClient.BaseAddress = new Uri("https://localhost:7263/");

                    var response = await httpClient.PostAsync("api/temperature-monitoring-station", content);

                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Temperature data with {sensorId} sensor id added successfully -> ",response.Content);
                        return Ok(temperatureData);
                    }
                    else
                    {
                        return StatusCode((int)response.StatusCode, "Sending temperature data to IOT data collector FAILED.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");
                return StatusCode(500, "An error occurred while processing the request.");
            }

        }
    }
}
