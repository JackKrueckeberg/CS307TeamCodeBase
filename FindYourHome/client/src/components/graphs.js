// Graphs.js
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

const Graphs = ({ city1, city2 }) => {
  const [chartData, setChartData] = useState(null);
  const [isGraphVisible, setIsGraphVisible] = useState(true);

  useEffect(() => {
    // Prepare data for ApexCharts
    const chartData = {
      options: {
        xaxis: {
          categories: ['Population', 'Median Income'],
        },
      },
      series: [
        {
          name: city1.name,
          data: [city1.population, city1.median_income],
        },
        {
          name: city2.name,
          data: [city2.population, city2.median_income],
        },
      ],
    };

    setChartData(chartData);
  }, [city1, city2]);

  const toggleGraphVisibility = () => {
    setIsGraphVisible(!isGraphVisible);
  };

  return (
    <div>
      <button onClick={toggleGraphVisibility}>
        {isGraphVisible ? 'Hide Graphs' : 'Show Graphs'}
      </button>
      {isGraphVisible && chartData && (
        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
      )}
    </div>
  );
};

export default Graphs;
