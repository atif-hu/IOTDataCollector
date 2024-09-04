namespace MonitoringStationAPI.Models
{
    public class Sensors
    {
        public int id { get; set; }
        public int SensorId { get; set; }
        public string SensorName { get; set; } = string.Empty;
        public TimeSpan DataCollectionInterval { get; set; }
    }
}
