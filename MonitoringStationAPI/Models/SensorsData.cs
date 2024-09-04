namespace MonitoringStationAPI.Models
{
    public class SensorsData
    {
        public int id { get; set; }
        public int SensorId { get; set; }
        public string? SensorName { get; set; }
        public string? Unit { get; set; }
        public double ParameterValue { get; set; }
        public DateTime TimeStamp { get; set; }
        public bool Alert { get; set; }
        public string? DataCollectionInterval { get; set; }
    }
}
