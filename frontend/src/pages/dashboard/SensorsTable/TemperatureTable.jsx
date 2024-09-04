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
import {fToNow} from '../../../utils/format-time';
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
    label: "Sensor's Name",
  },
  {
    id: 'sensorLocation',
    align: 'left',
    disablePadding: false,
    label: "Sensor's Location",
  },
  {
    id: 'sensorPostcode',
    align: 'left',
    disablePadding: false,
    label: "Sensor's Postcode",
  },
  {
    id: 'temperature',
    align: 'right',
    disablePadding: false,
    label: 'Temperature (°C)',
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

export default function TemperatureTable({ locationFilter, minTempFilter, sensorNameFilter, maxTempFilter, limit }) {
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('id');
  
  //location constants
  const newcastleLocations = [
    { location: "Newcastle City Centre", postcode: "NE1 4ST" },
    { location: "Jesmond", postcode: "NE2 2LA" },
    { location: "Heaton", postcode: "NE6 5TH" },
    { location: "Gosforth", postcode: "NE3 4AA" },
    { location: "Sandyford", postcode: "NE2 1BB" },
    { location: "Ouseburn", postcode: "NE1 2PA" },
    { location: "Fenham", postcode: "NE4 9XP" },
    { location: "Walker", postcode: "NE6 3RA" },
    { location: "Byker", postcode: "NE6 2HU" },
    { location: "West Denton", postcode: "NE15 7LT" },
    { location: "Kenton", postcode: "NE3 3AF" },
    { location: "Westerhope", postcode: "NE5 5HT" },
    { location: "Fawdon", postcode: "NE3 2PJ" },
    { location: "Cowgate", postcode: "NE5 3BA" },
    { location: "Kingston Park", postcode: "NE3 2FP" },
    { location: "Blakelaw", postcode: "NE5 3NP" },
    { location: "Newburn", postcode: "NE15 8RA" },
    { location: "Benwell", postcode: "NE15 6QQ" },
    { location: "Elswick", postcode: "NE4 6XQ" },
    { location: "Woolsington", postcode: "NE13 8BW" },
    { location: "Lemington", postcode: "NE15 8AD" },
    { location: "Denton Burn", postcode: "NE15 7HD" },
    { location: "Scotswood", postcode: "NE15 6LP" },
    { location: "Chapel House", postcode: "NE5 1JP" },
    { location: "Wallsend", postcode: "NE28 6TE" },
    { location: "North Shields", postcode: "NE29 0HJ" },
    { location: "Jesmond Dene", postcode: "NE2 2EY" },
    { location: "Arthur's Hill", postcode: "NE4 5PU" },
    { location: "Shieldfield", postcode: "NE2 1XR" },
    { location: "High Heaton", postcode: "NE7 7RN" }
  ];

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        let qry = `${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station/`;
        
        if(limit) qry = qry+`?limit=${limit}`;
        const response = await axios.get(qry);
        const data = response.data;
        
        // Transform the data to match the table format
        const transformedData = data.map((item) => ({
          id: item.id,
          sensorId: item.sensorId,
          parameterName: item.sensorName,
          temperature: item.parameterValue,
          dataInterval: item.dataInterval,
          timestamp: item.timeStamp,
          thresholdWarning: item.alert,
        }));
        
        setRows([...transformedData]);
        setFilteredRows(transformedData);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    // Set up interval to fetch data 
    const intervalId = setInterval(fetchData, 60000);

    // Clean up the interval 
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    let tempFilteredRows = rows;

    if (locationFilter) {
      tempFilteredRows = tempFilteredRows.filter(row => 
        newcastleLocations[row.sensorId - 1].location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    if (sensorNameFilter) {
      debugger
      tempFilteredRows = tempFilteredRows.filter(row => 
        `${row.parameterName}_${row.sensorId}`.toLowerCase().includes(sensorNameFilter.toLowerCase())
      );
    }

    if (minTempFilter) {
      tempFilteredRows = tempFilteredRows.filter(row => row.temperature >= parseFloat(minTempFilter));
    }

    if (maxTempFilter) {
      tempFilteredRows = tempFilteredRows.filter(row => row.temperature <= parseFloat(maxTempFilter));
    }

    setFilteredRows(tempFilteredRows);
  }, [locationFilter, minTempFilter, sensorNameFilter, maxTempFilter, rows]);


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
            {stableSort(filteredRows, getComparator(order, orderBy)).map((row, index) => {
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  role="checkbox"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  tabIndex={-1}
                  key={row.id}
                >
                  <TableCell>{row.parameterName}_{row.sensorId}</TableCell>
                  <TableCell>{newcastleLocations[row.sensorId-1].location}</TableCell>
                  <TableCell>{newcastleLocations[row.sensorId-1].postcode}</TableCell>
                  <TableCell align="right">{row.temperature}</TableCell>
                  <TableCell>{`${fToNow(row.timestamp)}`}</TableCell>
                  <TableCell >
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
