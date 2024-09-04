import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
dayjs.extend(isoWeek);

export const groupByPeriod = (data, period) => {
  return data.reduce((acc, item) => {
    const date = dayjs(item.timestamp);
    let periodLabel;

    switch (period) {
      case 'day':
        periodLabel = date.format('YYYY-MM-DD');
        break;
      case 'week':
        periodLabel = `Week ${date.isoWeek()} ${date.year()}`;
        break;
      case 'month':
        periodLabel = date.format('YYYY-MM');
        break;
      default:
        periodLabel = date.format('YYYY-MM-DD');
    }

    if (!acc[periodLabel]) {
      acc[periodLabel] = [];
    }
    acc[periodLabel].push(item);
    return acc;
  }, {});
};

export const calculateAverage = (data, period) => {
  const groupedData = groupByPeriod(data, period);
  return Object.keys(groupedData).map(key => {
    const averageTemp = groupedData[key].reduce((sum, item) => sum + item.parameterValue, 0) / groupedData[key].length;
    return { label: key, value: averageTemp };
  });
};

export const calculateSum = (data, period) => {
  const groupedData = groupByPeriod(data, period);
  return Object.keys(groupedData).map(key => {
    const sumTemp = groupedData[key].reduce((sum, item) => sum + item.parameterValue, 0);
    return { label: key, value: sumTemp };
  });
};

export const calculateMax = (data, period) => {
  const groupedData = groupByPeriod(data, period);
  return Object.keys(groupedData).map(key => {
    const maxTemp = Math.max(...groupedData[key].map(item => item.parameterValue));
    return { label: key, value: maxTemp };
  });
};

export const calculateMin = (data, period) => {
  const groupedData = groupByPeriod(data, period);
  return Object.keys(groupedData).map(key => {
    const minTemp = Math.min(...groupedData[key].map(item => item.parameterValue));
    return { label: key, value: minTemp };
  });
};
