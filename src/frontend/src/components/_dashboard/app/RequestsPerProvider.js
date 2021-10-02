import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@material-ui/core/styles';

// material
import { Box, Card, CardHeader } from '@mui/material';
// utils
import { fNumber } from '../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../charts';

// ----------------------------------------------------------------------


export default function RequestsPerProvider(props) {
  const { requestCounter } = props
  const theme = useTheme();

  const categories = (requestCounter && requestCounter.providerCounter)?Object.keys(requestCounter.providerCounter).map(row=>requestCounter.providerCounter[row].provider.acronym) : []
  const counters = (requestCounter && requestCounter.providerCounter)?Object.keys(requestCounter.providerCounter).map(row=>requestCounter.providerCounter[row].requestCounter) : []
  const CHART_DATA = [{ data: counters, name: 'Requests' }];
  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: true },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `${seriesName}`
        }
      }
    },
    colors: [theme.palette.info.darker,
             theme.palette.success.darker,
             theme.palette.error.darker,
             theme.palette.warning.darker,
             theme.palette.grey.darker,
             theme.palette.info.main,
             theme.palette.success.main,
             theme.palette.error.main,
             theme.palette.warning.main,
             theme.palette.grey.main,
             theme.palette.info.light,
             theme.palette.success.light,
             theme.palette.error.light,
             theme.palette.warning.light,
             theme.palette.grey.light,
             theme.palette.info.dark,
             theme.palette.success.dark,
             theme.palette.error.dark,
             theme.palette.warning.dark,
             theme.palette.grey.dark,
            ],
    plotOptions: {
      bar: { horizontal: false, barHeight: '28%', borderRadius: 2, distributed: true }
    },
    xaxis: {
      "categories": categories
    }
  });

  return (
    <Card>
      <CardHeader title="Requests per Provider" subheader="based on last 100 benchmark executions" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart type="bar" series={CHART_DATA} options={chartOptions} height={364} />
      </Box>
    </Card>
  );
}
