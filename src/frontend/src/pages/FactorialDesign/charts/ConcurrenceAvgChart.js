import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@material-ui/core/styles';

// material
import { Typography, Box, Grid } from '@material-ui/core';
//
import { BaseOptionChart } from '../../../components/charts';

// ----------------------------------------------------------------------


const ConcurrenceAvgChart = (props) => {
  const { benchmark, title } = props

  const theme = useTheme();

  const calcAvgLatency = (benchmark) => {
    if (benchmark && benchmark.execution && benchmark.execution.results){
      let sum = 0
      let counter = 0
      Object.keys(benchmark.execution.results.summary).map(row=>{
        Object.keys(benchmark.execution.results.summary[row].concurrences).map(subrow=>{
          sum += benchmark.execution.results.summary[row].concurrences[subrow].avg
          counter += 1
          return subrow
        })
        return row
      })
      return (counter) ? sum / counter : 0
    }
    return 0
  }

  const extractLabels = (benchmark) => {
    if (benchmark && benchmark.execution && benchmark.execution.results){
      const list = {}
      Object.keys(benchmark.execution.results.raw).map(row=>{
        list[row] = []
        Object.keys(benchmark.execution.results.raw[row]).map(subrow=>{
          list[row].push(subrow)
          return subrow
        })
        return row
      })
      const position = Object.keys(list)[0] 
      return list[position]
    }
    return []
  }

  const consolidateResults = (benchmark) => {
    if (benchmark && benchmark.execution && benchmark.execution.results){
      const concurrences = {}
      Object.keys(benchmark.execution.results.summary).map(row=>{
        Object.keys(benchmark.execution.results.summary[row].concurrences).map(subrow=>{
          concurrences[subrow] = (concurrences[subrow]) ? concurrences[subrow] + benchmark.execution.results.summary[row].concurrences[subrow].avg : benchmark.execution.results.summary[row].concurrences[subrow].avg
          return subrow
        })
        return row
      })
      const values = []
      Object.values(concurrences).map(row=>{
        values.push(row/Object.keys(benchmark.execution.results.raw).length)
        return row
      })
      return values
    }
    return []
  }

  
  const series = consolidateResults(benchmark)

  const chart = [
    {
      name: 'Avg latency',
      type: 'line',
      data: series
    }
  ]

  const labels = extractLabels(benchmark)


  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [1] },
    colors: [theme.palette.info.darker],
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid'] },
    "labels": labels,
    xaxis: { type: 'number', title:{ text: "Concurrences" }, decimalsInFloat: 0 },
    yaxis: { type: 'number', title:{ text: "Avg latency" }, decimalsInFloat: 0 },    
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

export default ConcurrenceAvgChart
