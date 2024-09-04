using Microsoft.AspNetCore.Mvc;
using MonitoringStationAPI.Database;
using MonitoringStationAPI.Models;

namespace MonitoringStationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorsController : ControllerBase
    {
        private readonly IoTDataCollectorDBContext _context;

        public SensorsController(IoTDataCollectorDBContext context)
        {
            _context = context;
        }

        // GET: api/Sensors
        [HttpGet]
        public ActionResult<IEnumerable<Sensors>> Get()
        {
            return _context.Sensors.ToList();
        }

        // GET: api/Sensors/5
        [HttpGet("{id}", Name = "Get")]
        public ActionResult<Sensors> Get(int id)
        {
            var sensor = _context.Sensors.Find(id);

            if (sensor == null)
            {
                return NotFound();
            }

            return sensor;
        }

        // POST: api/Sensors
        [HttpPost]
        public ActionResult<Sensors> Post(Sensors sensor)
        {
            _context.Sensors.Add(sensor);
            _context.SaveChanges();

            return CreatedAtAction(nameof(Get), new { id = sensor.SensorId }, sensor);
        }

        // PUT: api/Sensors/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, Sensors sensor)
        {
            if (id != sensor.SensorId)
            {
                return BadRequest();
            }

            _context.Entry(sensor).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
            _context.SaveChanges();

            return NoContent();
        }

        // DELETE: api/Sensors/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var sensor = _context.Sensors.Find(id);
            if (sensor == null)
            {
                return NotFound();
            }

            _context.Sensors.Remove(sensor);
            _context.SaveChanges();

            return NoContent();
        }
    }
}
