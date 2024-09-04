namespace Sensors
{
    public class TemperatureSensor
    {
        public double GetTemperature()
        {
            Random r = new Random();
            double temperature = r.Next(-20, 50);
            return temperature;
        }
    }
}
