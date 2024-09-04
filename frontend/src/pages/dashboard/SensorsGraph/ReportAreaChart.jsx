import { useEffect, useState } from 'react';
import axios from 'axios';
// material-ui
import { useTheme } from '@mui/material/styles';

// third-party
import ReactApexChart from 'react-apexcharts';
import config from 'config';

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

export default function ReportAreaChart({limit}) {
  const theme = useTheme();

  const { primary, secondary } = theme.palette.text;
  const line = theme.palette.divider;

  const [options, setOptions] = useState(areaChartOptions);
  const [series1, setSeries] = useState([]);
  const [tempData, setTempData] = useState([]);

  // Function to fetch data
  const fetchData = async () => {
    try {      
      let qry = `${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station/`;
        
      if(limit) qry = qry+`?limit=${limit}`;
      const response = await axios.get(qry);
      const combinedData = [...response.data];
      setTempData(combinedData);
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

  // Update chart options and series when tempData changes
  useEffect(() => {
    if (tempData.length > 0) {
      const timestamps = tempData.map(data => {
        const date = new Date(data.timeStamp);
        date.setHours(date.getHours() + 1);
        return date.toISOString();
      });

      const temperatures = tempData.map(data => data.parameterValue);
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
          name: 'Temperature',
          data: temperatures
        }
      ]);
    }
  }, [tempData, primary, secondary, line, theme]);

  return <ReactApexChart options={options} series={series1} type="area" height={340} />;
}
