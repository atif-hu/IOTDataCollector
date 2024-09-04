using MonitoringStationAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace MonitoringStationAPI.Database
{
    public class IoTDataCollectorDBContext : DbContext
    {
        public IoTDataCollectorDBContext(DbContextOptions<IoTDataCollectorDBContext> options)
            : base(options)
        {
        }

        public DbSet<SensorsData> SensorsData { get; set; }
        public DbSet<Sensors> Sensors { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite("Data Source=IOTDataCollector.db");
    }
}