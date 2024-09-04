import { useEffect, useState } from 'react';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';

// chart options
const areaChartOptions = {
  chart: {
    height: 340,
    type: 'line',
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'smooth',
    width: 1.5
  },
  grid: {
    strokeDashArray: 4
  },
  xaxis: {
    type: 'datetime',
    categories: [],
    labels: {
      format: 'HH:mm:ss'
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  tooltip: {
    x: {
      format: 'HH:mm:ss'
    }
  }
};

// ==============================|| REPORT AREA CHART ||============================== //

export default function RainfallAreaChart() {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series1, setSeries] = useState([]);

  const fetchData = async () => {
    try {
      // Fetch data from both endpoints
      const response = await axios.get('https://localhost:7051/api/rainfall');
      const swData = await axios.get('http://localhost:5102/api/MonitoringStation/rainfall');

      // Combine the data
      const combinedData = [...response.data, ...swData.data];

      // Process the data
      const timestamps = combinedData.map(data => {
        const date = new Date(data.timestamp);
        date.setHours(date.getHours() + 1);
        return date.toISOString();
      });

      const rainfall = combinedData.map(data => data.rainfall);

      // Update the chart options and series
      setOptions((prevState) => ({
        ...prevState,
        colors: [theme.palette.warning.main],
        xaxis: {
          ...prevState.xaxis,
          categories: timestamps,
          labels: {
            style: {
              colors: Array(timestamps.length).fill(secondary)
            }
          }
        },
        grid: {
          borderColor: line
        },
        legend: {
          labels: {
            colors: 'grey.500'
          }
        }
      }));

      setSeries([
        {
          name: 'Rainfall',
          data: rainfall
        }
      ]);

    } catch (error) {
      console.error('Error fetching rainfall data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up interval to fetch data every 30 minutes (1800000 milliseconds)
    const intervalId = setInterval(fetchData, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series1} type="bar" height={340} />;
}
