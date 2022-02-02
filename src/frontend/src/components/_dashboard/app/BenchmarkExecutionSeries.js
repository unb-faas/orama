import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@material-ui/core';
//
import { useState, useEffect } from 'react';
import { BaseOptionChart } from '../../charts';

// utils
import { api } from '../../../services';

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Repetitions',
    type: 'column',
    data: []
  },
  {
    name: 'Requests',
    type: 'area',
    data: []
  }
];

export default function BenchmarkExecutionSeries() {

  const [control, setControl] = useState(0);
  const [labels, setLabels] = useState([]);
  const [chart, setChart] = useState([]);

  const getData = () =>{
    const params = {page:0,size:20}
    api.list('benchmarkExecution/series','backend',params).then(res=>{
      if (res){
        const labels = Object.keys(res.data)
        const repetitions = Object.keys(res.data).map((row => res.data[row].repetitions))
        const requests = Object.keys(res.data).map((row => res.data[row].requests))
        CHART_DATA[0].data = repetitions
        CHART_DATA[1].data = requests
        setLabels(labels)
        setChart(CHART_DATA)
      }
    })
  }

  useEffect(() => {
    getData()
  },[control]); 

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '11%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    "labels": labels,
    xaxis: { type: 'number' },
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
    <Card>
      <CardHeader title="Benchmark executions" subheader="Last 20 executions" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={chart} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
