import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@material-ui/core/styles';

// material
import { Typography, Box, Grid } from '@material-ui/core';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------


const RepetitionAvgChart = (props) => {
  const { benchmark, title } = props
  const labels = (benchmark && benchmark.execution && benchmark.execution.results) ? Object.keys(benchmark.execution.results.raw) : []
  const series = (benchmark && benchmark.execution && benchmark.execution.results) ? Object.keys(benchmark.execution.results.summary).map(row =>(benchmark.execution.results.summary[row].avg.toFixed(2))) : []

  const theme = useTheme();


  const chart = [
    {
      name: 'Avg latency',
      type: 'line',
      data: series
    }
  ]

  const calcAvgLatency = (benchmark) => {
    let sum = 0
    let counter = 0
    if (benchmark && benchmark.execution && benchmark.execution.results  && benchmark.execution.results.raw && benchmark.execution.results.summary){
      Object.keys(benchmark.execution.results.summary).map(row=>{
          sum += benchmark.execution.results.summary[row].avg
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
      <Box mt={3} sx={{ p: 3, pb: 1 }} dir="ltr">
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
        >
            <Grid item xs={3}>
                <Typography variant="h6">{title}</Typography>
            </Grid>   
        </Grid> 
        <Typography variant="caption">Avg latency: </Typography><Typography variant="overline">{calcAvgLatency(benchmark).toFixed(2)}</Typography>
        <ReactApexChart type="line" series={chart} options={chartOptions} height={200} />
      </Box>
  );
}

export default RepetitionAvgChart
