//react import
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// material-ui
import {Grid, Typography, TextField, FormControl, Select, MenuItem, InputLabel } from '@mui/material';

// project import
import MainCard from 'components/MainCard';
import ReportAreaChart from 'pages/dashboard/SensorsGraph/ReportAreaChart';
import TemperatureTable from 'pages/dashboard/SensorsTable/TemperatureTable';
import DataAggregation from './dataAggregationUtils/data-aggregation';

// avatar style
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

// action style
const actionSX = {
  mt: 0.75,
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};


// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const router = useNavigate();
  const [locationFilter, setLocationFilter] = useState('');
  const [minTempFilter, setMinTempFilter] = useState('');
  const [maxTempFilter, setMaxTempFilter] = useState('');
  const [sensorNameFilter, setSensorNameFilter] = useState('');
  const [aggregationType, setAggregationType] = useState('average');
  const [aggregationPeriod, setAggregationPeriod] = useState('day');
  
  const handleRoute = (path)=>{
    router(path)
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 filters */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Filter by:</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Filter by Location"
              variant="outlined"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Min Temperature"
              variant="outlined"
              type="number"
              value={minTempFilter}
              onChange={(e) => setMinTempFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Max Temperature"
              variant="outlined"
              type="number"
              value={maxTempFilter}
              onChange={(e) => setMaxTempFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Sensor's name"
              variant="outlined"
              value={sensorNameFilter}
              onChange={(e) => setSensorNameFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>

    {/* row 2 Aggregation Options */}
    <Grid item xs={12} lg={6} sx={{ mb: -2.25 }}>
            <Typography variant="h5">Aggregate Data by:</Typography>
            <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                <InputLabel>Aggregation Type</InputLabel>
                <Select
                    value={aggregationType}
                    onChange={(e) => setAggregationType(e.target.value)}
                    label="Aggregation Type"
                >
                    <MenuItem value="average">Average</MenuItem>
                    <MenuItem value="sum">Sum</MenuItem>
                    <MenuItem value="max">Max</MenuItem>
                    <MenuItem value="min">Min</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
                <FormControl fullWidth variant="outlined">
                <InputLabel>Period</InputLabel>
                <Select
                    value={aggregationPeriod}
                    onChange={(e) => setAggregationPeriod(e.target.value)}
                    label="Period"
                >
                    <MenuItem value="day">Day</MenuItem>
                    <MenuItem value="week">Week</MenuItem>
                    <MenuItem value="month">Month</MenuItem>
                </Select>
                </FormControl>
            </Grid>
            </Grid>
        </Grid>

      {/* row 2 Data Aggregation Results */}
     <Grid item xs={12} md={5} lg={6} >
        <MainCard sx={{ mt: 2 }}  content={false}>
          <DataAggregation 
            aggregationType={aggregationType}
            aggregationPeriod={aggregationPeriod}
            locationFilter={locationFilter}
          />
        </MainCard>
      </Grid>


      {/* row 3 temperature table*/}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3">Temperature updates</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TemperatureTable 
            locationFilter={locationFilter}
            minTempFilter={minTempFilter}
            sensorNameFilter={sensorNameFilter}
            maxTempFilter={maxTempFilter}
            limit={1000}/>
        </MainCard>
      </Grid>

     
      {/* row 4 temperature graph */}
      <Grid item xs={12} md={5} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Temperature Report (HH:mm:ss)</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ReportAreaChart limit={120} />
        </MainCard>
      </Grid>

    </Grid>
  );
}
3