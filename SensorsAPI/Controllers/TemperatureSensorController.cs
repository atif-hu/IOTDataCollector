using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using Sensors;
using SensorsAPI.Models;
using System.Net.Http;
using System.Security.Cryptography.X509Certificates;
using System.Net.Security;

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
        public async Task<ActionResult<double>> GetTemperature(int sensorId, int interval)
        {
            try
            {
                int MINTHRESHOLDVALUE = -10;
                int MAXTHRESHOLDVALUE = 40;
                var sensor = new TemperatureSensor();
                double temperatureValue = sensor.GetTemperature();

                bool warning = temperatureValue > MAXTHRESHOLDVALUE || temperatureValue < MINTHRESHOLDVALUE;

                if (warning)
                {
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

                // Create HttpClient with handler for SSL bypass (for development purposes)
                var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, certificate, chain, sslErrors) => true
                };

                using (var httpClient = new HttpClient(handler))
                {
                    httpClient.BaseAddress = new Uri("http://monitoring-station-api:80"); // Replace with the actual port number if different

                    var response = await httpClient.PostAsync("api/temperature-monitoring-station", content);

                    if (response.IsSuccessStatusCode)
                    {
                        Console.WriteLine($"Temperature data with sensorId {sensorId} added successfully.");
                        return Ok(temperatureData);
                    }
                    else
                    {
                        // Log more details about the response failure
                        string responseContent = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Error: {response.StatusCode}, Response: {responseContent}");
                        return StatusCode((int)response.StatusCode, "Sending temperature data to IOT data collector FAILED.");
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred: {ex.Message}");

                // Log inner exception if it exists
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner Exception: {ex.InnerException.Message}");
                }

                return StatusCode(500, "An error occurred while processing the request.");
            }
        }
    }
}
