import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
// material-ui
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TableSortLabel from '@mui/material/TableSortLabel';

// project import
import Dot from 'components/@extended/Dot';
import {fToNow} from '../../../utils/format-time'
import config from 'config';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function OrderStatus({ status }) {
  let color;
  let title;

  if (status === true) {
    color = 'warning';
    title = 'Warning';
  } else {
    color = 'success';
    title = 'Normal';
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Dot color={color} />
      <Typography>{title}</Typography>
    </Stack>
  );
}

const headCells = [
  {
    id: 'parameterName',
    align: 'left',
    disablePadding: false,
    label: 'Sensors Name',
  },
  {
    id: 'value',
    align: 'right',
    disablePadding: false,
    label: 'Value',
  },
  {
    id: 'unit',
    align: 'left',
    disablePadding: false,
    label: 'Unit',
  },
  {
    id: 'timestamp',
    align: 'left',
    disablePadding: false,
    label: 'Timestamp',
  },
  {
    id: 'thresholdWarning',
    align: 'left',
    disablePadding: false,
    label: 'Threshold Warning',
  },
];

// ==============================|| ORDER TABLE - HEADER ||============================== //

function OrderTableHead({ order, orderBy, onRequestSort }) {
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ visuallyHidden: true, ml:"3px" }}>
                  {order === 'desc' ? ' sorted descending' : ' sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

OrderTableHead.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
};

// ==============================|| ORDER TABLE ||============================== //

export default function WeatherUpdateTable() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        //Yorkshire data
        const tempResponse = await axios.get(`${config.LONDON_LOCALHOST}/temperature`);

        const tempData = tempResponse.data;
        
        // Transform the data to match the table format
        const transformedData = tempData.map((item) => ({
          id: item.id,
          parameterName: item.parameterName,
          value: item.temperature,
          unit: item.unit,
          dataInterval: item.dataInterval,
          timestamp: item.timestamp,
          thresholdWarning: item.thresholdWarning,
        }));

        //Yorkshire data
        const rainfallResponse = await axios.get(`${config.LONDON_LOCALHOST}/rainfall`);
        const rainfallData = rainfallResponse.data;
        
        // Transform the data to match the table format
        const rainfallTransformedData = rainfallData.map((item) => ({
          id: item.id,
          parameterName: item.parameterName,
          value: item.rainfall,
          unit: item.unit,
          dataInterval: item.dataInterval,
          timestamp: item.timestamp,
          thresholdWarning: item.thresholdWarning,
        }));

        //Yorkshire data
        const humidityResponse = await axios.get(`${config.LONDON_LOCALHOST}/humidity`);
        const humidityData = humidityResponse.data;
        
        // Transform the data to match the table format
        const humidityTransformedData = humidityData.map((item) => ({
          id: item.id,
          parameterName: item.parameterName,
          value: item.humidity,
          unit: item.unit,
          dataInterval: item.dataInterval,
          timestamp: item.timestamp,
          thresholdWarning: item.thresholdWarning,
        }));

        //Yorkshire data
        const airPollutionResponse = await axios.get(`${config.LONDON_LOCALHOST}/airpollution`);
        const airPollutionData = airPollutionResponse.data;
        
        // Transform the data to match the table format
        const airPollutionTransformedData = airPollutionData.map((item) => ({
          id: item.id,
          parameterName: item.parameterName,
          value: item.airPollution,
          unit: item.unit,
          dataInterval: item.dataInterval,
          timestamp: item.timestamp,
          thresholdWarning: item.thresholdWarning,
        }));

        //Yorkshire data
        const cO2EmissionsResponse = await axios.get(`${config.LONDON_LOCALHOST}/co2emissions`);
        const cO2EmissionsData = cO2EmissionsResponse.data;
        
        // Transform the data to match the table format
        const cO2EmissionsTransformedData = cO2EmissionsData.map((item) => ({
          id: item.id,
          parameterName: item.parameterName,
          value: item.cO2,
          unit: item.unit,
          dataInterval: item.dataInterval,
          timestamp: item.timestamp,
          thresholdWarning: item.thresholdWarning,
        }));
        
      

        setRows([...transformedData, ...rainfallTransformedData, ...humidityTransformedData, ...airPollutionTransformedData, ...cO2EmissionsTransformedData]);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up interval to fetch data every 30 minutes (1800000 milliseconds)
    const intervalId = setInterval(fetchData, 60000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  return (
    <Box>
      <TableContainer
        sx={{
          width: '100%',
          overflowX: 'auto',
          position: 'relative',
          display: 'block',
          maxWidth: '100%',
          '& td, & th': { whiteSpace: 'nowrap' },
          height: '345px'
        }}
      >
        <Table aria-labelledby="tableTitle">
          <OrderTableHead
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell>{row.parameterName}</TableCell>
                  <TableCell align="right">{row.value}</TableCell>
                  <TableCell align="left">{row.unit}</TableCell>
                  <TableCell>{`${fToNow(row.timestamp)}`}</TableCell>
                  <TableCell>
                    <OrderStatus status={row.thresholdWarning} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
