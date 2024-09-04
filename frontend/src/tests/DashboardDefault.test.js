import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import DashboardDefault from '../components/DashboardDefault'; // Adjust the path as necessary
import { BrowserRouter as Router } from 'react-router-dom';

// Mock components and functions
jest.mock('components/MainCard', () => ({ children }) => <div>{children}</div>);
jest.mock('pages/dashboard/SensorsGraph/ReportAreaChart', () => () => <div>Report Area Chart</div>);
jest.mock('pages/dashboard/SensorsTable/TemperatureTable', () => () => <div>Temperature Table</div>);
jest.mock('./dataAggregationUtils/data-aggregation', () => () => <div>Data Aggregation</div>);

// Helper function to render component
const renderComponent = () => {
  return render(
    <Router>
      <DashboardDefault />
    </Router>
  );
};

describe('DashboardDefault Component', () => {
  test('renders filter and aggregation options correctly', () => {
    renderComponent();

    expect(screen.getByLabelText(/Filter by Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Min Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Max Temperature/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Sensor's name/i)).toBeInTheDocument();
    expect(screen.getByText(/Aggregate Data by:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Aggregation Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Period/i)).toBeInTheDocument();
  });

  test('handles filter input changes', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Filter by Location/i), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText(/Min Temperature/i), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText(/Max Temperature/i), { target: { value: '30' } });
    fireEvent.change(screen.getByLabelText(/Sensor's name/i), { target: { value: 'Sensor1' } });

    expect(screen.getByLabelText(/Filter by Location/i).value).toBe('New York');
    expect(screen.getByLabelText(/Min Temperature/i).value).toBe('10');
    expect(screen.getByLabelText(/Max Temperature/i).value).toBe('30');
    expect(screen.getByLabelText(/Sensor's name/i).value).toBe('Sensor1');
  });

  test('handles aggregation options changes', () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/Aggregation Type/i), { target: { value: 'sum' } });
    fireEvent.change(screen.getByLabelText(/Period/i), { target: { value: 'week' } });

    expect(screen.getByLabelText(/Aggregation Type/i).value).toBe('sum');
    expect(screen.getByLabelText(/Period/i).value).toBe('week');
  });

  test('renders child components', () => {
    renderComponent();

    expect(screen.getByText(/Data Aggregation/i)).toBeInTheDocument();
    expect(screen.getByText(/Temperature Table/i)).toBeInTheDocument();
    expect(screen.getByText(/Report Area Chart/i)).toBeInTheDocument();
  });
});
