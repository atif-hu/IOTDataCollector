using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Moq;
using Sensors;
using SensorsAPI.Controllers;
using SensorsAPI.Models;
using System.Net;
using Xunit;
using Moq.Protected;

namespace SensorsAPI.Tests
{
    public class UnitTest
    {
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly TemperatureSensorController _controller;

        public UnitTest()
        {
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
            _configurationMock = new Mock<IConfiguration>();
            _controller = new TemperatureSensorController(_httpClientFactoryMock.Object, _configurationMock.Object);
        }

        [Fact]
        public async Task GetTemperature_ReturnsOkResult_WithTemperatureData()
        {
            // Arrange
            var sensorId = 1;
            var interval = 30;
            var temperatureValue = 25.0;
            var warning = false;

            var sensorMock = new Mock<TemperatureSensor>();
            sensorMock.Setup(s => s.GetTemperature()).Returns(temperatureValue);

            var httpClientHandlerMock = new Mock<HttpMessageHandler>();
            httpClientHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("Success")
                });

            var httpClient = new HttpClient(httpClientHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _controller.GetTemperature(sensorId, interval);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var temperatureData = Assert.IsType<SensorsData>(okResult.Value);
            Assert.Equal(sensorId, temperatureData.SensorId);
            Assert.Equal("Temperature", temperatureData.SensorName);
            Assert.Equal("Celcius", temperatureData.Unit);
            Assert.Equal(temperatureValue, temperatureData.ParameterValue);
            Assert.Equal(warning, temperatureData.Alert);
            Assert.Equal($"{interval} minutes", temperatureData.DataCollectionInterval);
        }

        [Fact]
        public async Task GetTemperature_ReturnsInternalServerError_OnException()
        {
            // Arrange
            var sensorId = 1;
            var interval = 30;

            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Throws(new Exception("Some error"));

            // Act
            var result = await _controller.GetTemperature(sensorId, interval);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            Assert.Equal("An error occurred while processing the request.", statusCodeResult.Value);
        }

        [Fact]
        public async Task GetTemperature_ReturnsStatusCodeResult_OnHttpClientError()
        {
            // Arrange
            var sensorId = 1;
            var interval = 30;
            var temperatureValue = 25.0;

            var sensorMock = new Mock<TemperatureSensor>();
            sensorMock.Setup(s => s.GetTemperature()).Returns(temperatureValue);

            var httpClientHandlerMock = new Mock<HttpMessageHandler>();
            httpClientHandlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Content = new StringContent("Internal Server Error")
                });

            var httpClient = new HttpClient(httpClientHandlerMock.Object);
            _httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            // Act
            var result = await _controller.GetTemperature(sensorId, interval);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal((int)HttpStatusCode.InternalServerError, statusCodeResult.StatusCode);
            Assert.Equal("Sending temperature data to IOT data collector FAILED.", statusCodeResult.Value);
        }
    }
}
