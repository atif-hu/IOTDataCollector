import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from 'config';
import { calculateAverage, calculateSum, calculateMax, calculateMin } from './aggregationUtils';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';

export default function DataAggregation({ aggregationType, aggregationPeriod, locationFilter }) {
  const [aggregatedData, setAggregatedData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station?limit=1000`);
        const data = response.data;
        
        // Filter by location if specified
        let filteredData = data;
        if (locationFilter) {
          filteredData = data.filter(item => item.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }
        // Aggregate data based on the selected type and period
        let aggregatedResult = [];
        switch (aggregationType) {
          case 'average':
            aggregatedResult = calculateAverage(filteredData, aggregationPeriod);
            break;
          case 'sum':
            aggregatedResult = calculateSum(filteredData, aggregationPeriod);
            break;
          case 'max':
            aggregatedResult = calculateMax(filteredData, aggregationPeriod);
            break;
          case 'min':
            aggregatedResult = calculateMin(filteredData, aggregationPeriod);
            break;
          default:
            break;
        }

        setAggregatedData(aggregatedResult);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [aggregationType, aggregationPeriod, locationFilter]);

  return (
    <MainCard contentSX={{ p: 2.25 }} sx={{ color: '#002766', bgcolor: 'inherit' }}>
  <Stack>
    <Typography variant="h5" color="inherit">
      Aggregated Data
    </Typography>
    <Grid container direction="column">
      {aggregatedData ? (
        aggregatedData.map((item, index) => (
          <Grid item key={index}>
            <Typography variant="h4" component="span" color="inherit">
              {item.label}:
            </Typography>
            <Typography variant="h4" component="span" color="inherit" sx={{ marginLeft: 1 }}>
              {item.value.toFixed(2)}
            </Typography>
          </Grid>
        ))
      ) : (
        <p>No data available</p>
      )}
    </Grid>
  </Stack>
</MainCard>
    
  );
}
