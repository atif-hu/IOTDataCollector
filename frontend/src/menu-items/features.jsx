// assets
import { DashboardOutlined, RadarChartOutlined, EnvironmentOutlined, GlobalOutlined, ClusterOutlined, ApartmentOutlined, HistoryOutlined } from '@ant-design/icons';
import london from 'assets/images/city/london.png';
import analysis from 'assets/images/icons/analysis.png';
import visualization from 'assets/images/icons/data-visualization.png';


// icons
const icons = {
  DashboardOutlined,
  london,
  RadarChartOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  ClusterOutlined,
  ApartmentOutlined,
  analysis,
  visualization,
  HistoryOutlined
};


// ==============================|| MENU ITEMS - Features ||============================== //

const features = {
  id: 'features',
  title: 'Features',
  type: 'group',
  children: [
    {
      id: 'data-processing',
      title: 'Data Processing',
      type: 'item',
      url: '/data-processing',
      icon: icons.ClusterOutlined,
      breadcrumbs: false
    },
    {
      id: 'data-visualisation',
      title: 'Data Visualisation',
      type: 'item',
      url: '/data-visualisation',
      icon: icons.GlobalOutlined,
      breadcrumbs: false
    },
    {
      id: 'historical-data',
      title: 'Historical data',
      type: 'item',
      url: '/historical-data',
      icon: icons.HistoryOutlined,
      breadcrumbs: false
    },
  ]
};

export default features;
