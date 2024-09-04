import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
// import Yorkshire from 'pages/regions/yorkshire';
// import NorthEast from 'pages/regions/north-east';
// import SouthWest from 'pages/regions/south-west';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));
// const London = Loadable(lazy(() => import('pages/regions/london')));
const DataProcessing = Loadable(lazy(() => import('pages/features/data-processing')));
const DataVisualisation = Loadable(lazy(() => import('pages/features/data-visualisation')));
const HistoricalData = Loadable(lazy(() => import('pages/features/historical-data')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'color',
      element: <Color />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
      ]
    },
    {
      path: 'sample-page',
      element: <SamplePage />
    },
    {
      path: 'shadow',
      element: <Shadow />
    },
    {
      path: 'typography',
      element: <Typography />
    },
    {
      path: 'data-processing',
      element: <DataProcessing />
    },
    {
      path: 'data-visualisation',
      element: <DataVisualisation />
    },
    {
      path: 'historical-data',
      element: <HistoricalData />
    },
  ]
};

export default MainRoutes;
