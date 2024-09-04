import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import config from 'config';
import { Grid,Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components to avoid the "category is not a registered scale" error
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const RealTimeGraph = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: '#42A5F5',
        fill: false,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station`);
        const data = response.data;

        // Extract time and temperature from the response data
        const timeLabels = data.map(item => new Date(item.timeStamp).toLocaleTimeString());
        const tempData = data.map(item => item.parameterValue);

        setChartData(prevState => ({
          ...prevState,
          labels: timeLabels,
          datasets: [{
            ...prevState.datasets[0],
            data: tempData,
          }],
        }));
      } catch (error) {
        console.error('Error fetching real-time data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 50000); // Fetch new data every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  return(
    <>
        <Grid item>
            <Typography sx={{fontSize:'30px', fontWeight:'bold'}}>Real-Time Graphs:</Typography>
            <Typography sx={{fontSize:'20px'}}> Charts and graphs that display the latest data collected from sensors, updating in real-time.</Typography>
        </Grid>
        <Line data={chartData} />
    </>
  )
};

export default RealTimeGraph;
