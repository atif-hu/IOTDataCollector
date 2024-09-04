import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// project import
import MainCard from 'components/MainCard';
import UniqueVisitorCard from './londonRegion/UniqueVisitorCard';
import WeatherUpdateTable from './londonRegion/WeatherUpdateTable';

// ===============================|| COMPONENT - COLOR ||=============================== //

export default function NorthEast() {
  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
    {/* row 3 */}
    <Grid item xs={12} md={7} lg={12}>
      <UniqueVisitorCard />
    </Grid> 
    <Grid item xs={12} md={7} lg={12}>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h3">London Weather updates</Typography>
        </Grid>
        <Grid item />
      </Grid>
      <MainCard sx={{ mt: 2 }} content={false}>
        <WeatherUpdateTable />
      </MainCard>
    </Grid>

  </Grid>
  );
}

// ColorBox.propTypes = {
//   bgcolor: PropTypes.string,
//   title: PropTypes.string,
//   data: PropTypes.object,
//   dark: PropTypes.bool,
//   main: PropTypes.bool
// };
