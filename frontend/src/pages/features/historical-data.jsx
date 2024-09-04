import React, { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import axios from 'axios';
import dayjs from 'dayjs';
import { Box, Typography, Button, Grid } from '@mui/material';
import config from 'config';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

const HistoricalTrends = () => {
    const [period, setPeriod] = useState('day');
    const [chartData, setChartData] = useState({
      labels: [],
      datasets: [
        {
          label: 'Temperature (°C)',
          data: [],
          borderColor: '#42A5F5',
          backgroundColor: '#90caf9',
          fill: false,
        },
      ],
    });
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station`);
          const data = response.data;
  
          let groupedData;
          if (period === 'day') {
            groupedData = data.map(item => ({
              time: dayjs(item.timeStamp).format('YYYY-MM-DD HH:mm'),
              temperature: item.parameterValue,
            }));
          } else if (period === 'week') {
            groupedData = data.map(item => ({
              time: dayjs(item.timeStamp).format('YYYY-WW'),
              temperature: item.parameterValue,
            }));
          } else if (period === 'month') {
            groupedData = data.map(item => ({
              time: dayjs(item.timeStamp).format('YYYY-MM'),
              temperature: item.parameterValue,
            }));
          }
  
          const timeLabels = groupedData.map(item => item.time);
          const tempData = groupedData.map(item => item.temperature);
  
          setChartData({
            labels: timeLabels,
            datasets: [
              {
                label: 'Temperature (°C)',
                data: tempData,
                borderColor: '#42A5F5',
                backgroundColor: '#571010',
                fill: false,
              },
            ],
          });
        } catch (error) {
          console.error('Error fetching historical data:', error);
        }
      };
  
      fetchData();
    }, [period]);
  
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h3" gutterBottom>
          Historical Temperature Trends
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Button variant="contained" sx={{backgroundColor:'green'}} onClick={() => setPeriod('day')}>Daily</Button>
          <Button variant="contained" sx={{backgroundColor:'green'}} onClick={() => setPeriod('week')}>Weekly</Button>
          <Button variant="contained" sx={{backgroundColor:'green'}} onClick={() => setPeriod('month')}>Monthly</Button>
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Line Chart</Typography>
            <Line data={chartData} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4">Bar Chart</Typography>
            <Bar data={chartData} />
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  export default HistoricalTrends;