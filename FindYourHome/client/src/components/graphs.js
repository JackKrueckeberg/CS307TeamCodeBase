import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import './Stylings/graphs.css'; // Add your CSS file for styling

const Graphs = ({ city1, city2 }) => {
  const [chartData, setChartData] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState('population');

  useEffect(() => {
    // Prepare data for ApexCharts based on the selected graph
    const dataForSelectedGraph = {
      population: {
        options: {
          xaxis: {
            categories: ['Population'],
          },
        },
        series: [
          {
            name: city1.name,
            data: [city1.population],
          },
          {
            name: city2.name,
            data: [city2.population],
          },
        ],
      },
      medianIncome: {
        options: {
          xaxis: {
            categories: ['Median Income'],
          },
        },
        series: [
          {
            name: city1.name,
            data: [city1.median_income],
          },
          {
            name: city2.name,
            data: [city2.median_income],
          },
        ],
      },
    };

    // Set the chart data based on the selected graph
    setChartData(dataForSelectedGraph[selectedGraph]);
  }, [city1, city2, selectedGraph]);

  const toggleGraph = (graph) => {
    setSelectedGraph(graph);
  };

  return (
    <div>
      <button
        className={selectedGraph === 'population' ? 'selected' : ''}
        onClick={() => toggleGraph('population')}
      >
        Population
      </button>
      <button
        className={selectedGraph === 'medianIncome' ? 'selected' : ''}
        onClick={() => toggleGraph('medianIncome')}
      >
        Median Income
      </button>
      {chartData && (
        <Chart options={chartData.options} series={chartData.series} type="bar" height={350} />
      )}
    </div>
  );
};

export default Graphs;
