using Microsoft.AspNetCore.Mvc;
using MonitoringStationAPI.Database;
using MonitoringStationAPI.Models;

namespace TemperatureMonitoringController.Controllers
{
    [Route("api/temperature-monitoring-station")]
    [ApiController]
    public class TemperatureMonitoringController : ControllerBase
    {
        private readonly IoTDataCollectorDBContext _dbContext;

        public TemperatureMonitoringController(IoTDataCollectorDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost]
        public IActionResult PostTemperatureData([FromBody] SensorsData temperatureData)
        {
            if (temperatureData == null)
            {
                return BadRequest("Invalid temperature data");
            }

            _dbContext.SensorsData.Add(temperatureData);
            _dbContext.SaveChanges();

            return Ok(temperatureData);
        }

        [HttpPut("{id}")]
        public IActionResult PutTemperatureData(int id, [FromBody] SensorsData updatedTemperatureData)
        {
            var temperatureData = _dbContext.SensorsData.FirstOrDefault(s => s.id == id);
            if (temperatureData == null)
            {
                return NotFound();
            }

            if (updatedTemperatureData == null || id != updatedTemperatureData.id)
            {
                return BadRequest();
            }

            temperatureData.ParameterValue = updatedTemperatureData.ParameterValue;

            _dbContext.SaveChanges();

            return NoContent();
        }

        [HttpGet]
        public IActionResult GetAllTemperatureData(int limit=120)
        {
            List<SensorsData> allTemperatureData = _dbContext.SensorsData
                .OrderByDescending(s => s.id) // Order by SensorId
                .Take(limit) // Limit to 1200 results
                .ToList();

            return Ok(allTemperatureData);
        }

        [HttpGet("{id}")]
        public IActionResult GetTemperatureData(int id)
        {
            var temperatureData = _dbContext.SensorsData.FirstOrDefault(s => s.SensorId == id);
            if (temperatureData == null)
            {
                return NotFound();
            }

            return Ok(temperatureData);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTemperatureData(int id)
        {
            var temperatureData = _dbContext.SensorsData.FirstOrDefault(s => s.id == id);
            if (temperatureData == null)
            {
                return NotFound();
            }

            _dbContext.SensorsData.Remove(temperatureData);
            _dbContext.SaveChanges();

            return NoContent();
        }
    }
}
