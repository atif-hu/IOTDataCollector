import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import config from 'config';

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: 'area',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 2
  },
  grid: {
    strokeDashArray: 0
  }
};

// ==============================|| INCOME AREA CHART ||============================== //

export default function IncomeAreaChart({ slot }) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series, setSeries] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [cO2Data, setcO2Data] = useState([]);
  const [airPollutionData, setAirPollutionData] = useState([]);

    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.LONDON_LOCALHOST}/temperature`);
        const co2Response = await axios.get(`${config.LONDON_LOCALHOST}/CO2Emissions`);
        const rainfallResponse = await axios.get(`${config.LONDON_LOCALHOST}/rainfall`);
        const humidityResponse = await axios.get(`${config.LONDON_LOCALHOST}/humidity`);
        const airPollutionResponse = await axios.get(`${config.LONDON_LOCALHOST}/airpollution`);
        
        setTempData(response.data);
        setRainfallData(rainfallResponse.data);
        setHumidityData(humidityResponse.data);
        setcO2Data(co2Response.data);
        setAirPollutionData(airPollutionResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    // Initial data fetch and setting up interval
    useEffect(() => {
      fetchData();
      const intervalId = setInterval(fetchData, 1800000);
      return () => clearInterval(intervalId);
    }, []);

  useEffect(() => {

    if (tempData.length > 0) {
      const timestamps = tempData.map(data => {
        const date = new Date(data.timestamp);
        date.setHours(date.getHours() + 1);
        return date.toISOString();
      });
      
      const temperatures = tempData.map(data => data.temperature);
      const rainfall = rainfallData.map(data => data.rainfall);
      const humidity = humidityData.map(data => data.humidity);
      const co2 = cO2Data.map(data => data.cO2Emissions);
      const airPollution = airPollutionData.map(data => data.airPollution);

    setOptions((prevState) => ({
      ...prevState,
      colors: [theme.palette.primary.main, theme.palette.primary[700]],
      xaxis: {
        categories:timestamps,
        labels: {
          style: {
            colors: Array(timestamps.length).fill(secondary)
          }
        },
        axisBorder: {
          show: true,
          color: line
        },
        tickAmount: slot === 'month' ? 11 : 7
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary]
          }
        }
      },
      grid: {
        borderColor: line
      }
    }));
    setSeries([
      {
        name: 'Temperature',
        data: temperatures
      },
      {
        name: 'Rainfall',
        data: rainfall
      },
      {
        name: 'Humidity',
        data: humidity
      },
      {
        name: 'CO2 Emissions',
        data: co2
      },
      {
        name: 'Air Pollution',
        data: airPollution
      },
    ]);
    }
  }, [tempData, primary, secondary, line, theme]);


  return <ReactApexChart options={options} series={series} type="bar" height={450} />;
}

IncomeAreaChart.propTypes = { slot: PropTypes.string };
