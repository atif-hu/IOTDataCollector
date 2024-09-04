//react import
import { useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import ReportAreaChart from './SensorsGraph/ReportAreaChart';
import TemperatureTable from './SensorsTable/TemperatureTable';

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
  
  const handleRoute = (path)=>{
    router(path)
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid item xs={12} sx={{ mb: -2.25 }}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item xs={12} sm={6} md={4} sx={{marginLeft:"20px"}} >
          <AnalyticEcommerce title="Location : Newcastle"/>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <AnalyticEcommerce title="Real time updates and alerts"/>
        </Grid>
      </Grid>

      {/* row 2 temperature table*/}
      <Grid item xs={12} md={7} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h3">Temperature updates</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <TemperatureTable />
        </MainCard>
      </Grid>

      {/* row 2 temperature graph */}
      <Grid item xs={12} md={5} lg={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h5">Temperature Report (HH:mm:ss)</Typography>
          </Grid>
          <Grid item />
        </Grid>
        <MainCard sx={{ mt: 2 }} content={false}>
          <ReportAreaChart />
        </MainCard>
      </Grid>

    </Grid>
  );
}
