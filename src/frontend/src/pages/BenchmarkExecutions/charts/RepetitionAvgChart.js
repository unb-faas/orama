import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@material-ui/core/styles';

// material
import { Typography, Box, Grid } from '@material-ui/core';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------


const RepetitionAvgChart = (props) => {
  const { execution, title } = props
  const labels = (execution && execution.results && execution.results.raw) ? Object.keys(execution.results.raw) : []
  const series = (execution && execution.results && execution.results.summary) ? Object.keys(execution.results.summary).map(row =>(execution.results.summary[row].avg.toFixed(2))) : []

  const theme = useTheme();


  const chart = [
    {
      name: 'Avg latency',
      type: 'line',
      data: series
    }
  ]

  const calcAvgLatency = (execution) => {
    let sum = 0
    let counter = 0
    if (execution && execution.results  && execution.results.raw && execution.results.summary){
      Object.keys(execution.results.summary).map(row=>{
          sum += execution.results.summary[row].avg
          counter += 1
          return row
      })
      return (counter !== 0) ? sum / counter : 0
    }
    return 0
}

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [1] },
    colors: [theme.palette.info.darker],
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid'] },
    "labels": labels,
    xaxis: { type: 'number', title:{ text: "Repetitions" } , decimalsInFloat: 0},
    yaxis: { type: 'number', title:{ text: "Avg latency" } , decimalsInFloat: 0},    
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)}`;
          }
          return y;
        }
      }
    }
  });

  return (
      <ReactApexChart type="line" series={chart} options={chartOptions} height={130} />
  );
}

export default RepetitionAvgChart
