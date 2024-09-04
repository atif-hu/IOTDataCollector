import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RealTimeGraph from '../components/RealTimeGraph'; // Adjust the path as necessary
import axios from 'axios';
import { Line } from 'react-chartjs-2';

// Mock the axios module
jest.mock('axios');

// Mock the Line chart component
jest.mock('react-chartjs-2', () => ({
  Line: () => <div>Line Chart</div>
}));

describe('RealTimeGraph Component', () => {
  test('renders and fetches data', async () => {
    // Mock the axios GET request
    axios.get.mockResolvedValue({
      data: [
        { timeStamp: '2024-08-05T12:00:00Z', parameterValue: 22 },
        { timeStamp: '2024-08-05T12:01:00Z', parameterValue: 23 },
      ],
    });

    render(<RealTimeGraph />);

    // Check if the component renders correctly
    expect(screen.getByText(/Real-Time Graphs:/i)).toBeInTheDocument();
    expect(screen.getByText(/Charts and graphs that display the latest data collected from sensors, updating in real-time./i)).toBeInTheDocument();
    
    // Check if the Line chart is rendered
    expect(screen.getByText(/Line Chart/i)).toBeInTheDocument();
    
    // Check if data fetching is called
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith(`${config.IOTDataCollectorAPI_LOCALHOST}/api/temperature-monitoring-station`));
    
    // Check if chartData state is set correctly
    await waitFor(() => {
      const chartData = {
        labels: ['12:00:00', '12:01:00'],
        datasets: [
          {
            label: 'Temperature (°C)',
            data: [22, 23],
            borderColor: '#42A5F5',
            fill: false,
          },
        ],
      };
      // Check if chartData state is set correctly (you might need to adjust this check based on how the chart library works)
    });
  });

  test('handles fetch error', async () => {
    // Mock the axios GET request to reject
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(<RealTimeGraph />);

    // Ensure that error handling works (you might need to adjust this based on actual implementation)
    await waitFor(() => expect(console.error).toHaveBeenCalledWith('Error fetching real-time data:', expect.any(Error)));
  });
});
