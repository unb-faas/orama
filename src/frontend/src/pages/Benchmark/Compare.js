import { Icon } from '@iconify/react';
import { useState , useEffect} from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';

// material
import {
  Card,
  CardContent,
  Table,
  Stack,
  Button,
  Grid,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  FormGroup,
  FormControlLabel,
  Box,
  Switch,
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
import LinearProgress from '@mui/material/LinearProgress';

// components
import { withSnackbar } from '../../hooks/withSnackbar';
import Page from '../../components/Page';
import {api} from '../../services';

// ----------------------------------------------------------------------




// ----------------------------------------------------------------------

const Benchmarks = (props) => {
  const {ids} = useParams()

  const [control, setControl] = useState(true);
  const [despiseErrors, setDespiseErrors] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('benchmark-order') ? localStorage.getItem('benchmark-order') : 'desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('benchmark-order-by') ? localStorage.getItem('benchmark-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('benchmark-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('benchmark-rows-per-page') ? localStorage.getItem('benchmark-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [total, setTotal] = useState(0);

  const [seriesDuration, setSeriesDuration] = useState([]);
  const [seriesFailureRate, setSeriesFailureRate] = useState([]);
  const [seriesFailureRateSum, setSeriesFailureRateSum] = useState([]);
  const [seriesWarmUp, setSeriesWarmUp] = useState([]);
  const [labels, setLabels] = useState([]);
  const [labelsBenchmarks, setLabelsBenchmarks] = useState([]);
  
  
  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    page = 0
    rowsPerPage = ids.split(',').length
    orderBy = 'id'
    order = 'desc'
    const params = {page,size:rowsPerPage,provider_active:1,usecase_active:1,"orderBy":orderBy,"order":order,"filterName":filterName}
    api.list(`benchmarkExecution?compare=true&ids_benchmarks=${ids}&despise_errors=${despiseErrors}`,'backend',params).then(res=>{
      const sDuration = Object.keys(res.data.compare).map(row=>
        (
          {
            name: res.data.compare[row].benchmark.name,
            data: res.data.compare[row].avg
          }
        )
      )
      const seriesFailureRate = Object.keys(res.data.compare).map(row=>
        (
          {
            name: res.data.compare[row].benchmark.name,
            data: res.data.compare[row].failureRate
          }
        )
      )
      const seriesWarmUp = Object.keys(res.data.warmUpTimes).map(row=>res.data.warmUpTimes[row])
      
      const labelsBenchmarksUniq = Object.keys(res.data.compare).map(row=>res.data.compare[row].benchmark.name)
      setSeriesDuration(sDuration)
      setSeriesFailureRate(seriesFailureRate)
      setLabels(res.data.labels)
      setSeriesFailureRateSum(res.data.failedSum)
      setLabelsBenchmarks(labelsBenchmarksUniq)
      setSeriesWarmUp(seriesWarmUp)
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const handleChangeDespiseErrors = ()=>{
    setDespiseErrors(!despiseErrors)
    setControl(!control)
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
  },[control]); 


  const config = {
          
    "seriesDuration": seriesDuration,
    "seriesFailureRate": seriesFailureRate,
    optionsDuration: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      
      legend: {
        "tooltipHoverFormatter": function(val, opts) {
          return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]} `
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: labels,
        title:{
          text: "Concurrence levels"
        }
      },
      yaxis: {
        title:{
          text: "Average latency (milliseconds)"
        },
        labels: {
          formatter: (value) => (value) ? value.toFixed(0) : null,
        },
      },
      tooltip: {
        y: [
          {
            title: {
              "formatter": function (val) {
                return `${val}`
              }
            }
          },
          {
            title: {
              "formatter": function (val) {
                return `${val}`
              }
            }
          },
          {
            title: {
              "formatter": function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    },

    optionsFailureRate: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: [5, 7, 5],
        curve: 'straight',
        dashArray: [0, 8, 5]
      },
      
      legend: {
        "tooltipHoverFormatter": function(val, opts) {
          return `${val} - ${opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex]} `
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      xaxis: {
        categories: labels,
        title:{
          text: "Concurrence levels"
        }
      },
      yaxis: {
        title:{
          text: "Failure Rate (%)"
        },
        min: 0,
        max: 100,
        labels: {
          formatter: (value) => (value) ? value.toFixed(0) : null,
        },
      },
      tooltip: {
        y: [
          {
            title: {
              "formatter": function (val) {
                return `${val}`
              }
            }
          },
          {
            title: {
              "formatter": function (val) {
                return `${val}`
              }
            }
          },
          {
            title: {
              "formatter": function (val) {
                return val;
              }
            }
          }
        ]
      },
      grid: {
        borderColor: '#f1f1f1',
      }
    },
          
      seriesFailureRatePie: seriesFailureRateSum,
      optionsFailureRatePie: {
        chart: {
          type: 'pie',
          height: 350,
          zoom: {
            enabled: false
          },
        },
        legend: {
          position: 'top'
        },
        labels: labelsBenchmarks,
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
      
      seriesWarmUp: [{
        data: seriesWarmUp
      }],

      optionsWarmUp: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          }
        },
        dataLabels: {
          enabled: false
        },
        xaxis: {
          categories: labelsBenchmarks,
        }
      },
  
  
  };
  
  return (
    <Page title="Benchmarks Comparisson | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Benchmarks Comparison
          </Typography>
        </Stack>
          <Card>
            <CardContent>
              <Typography variant="h6">Average Duration</Typography>
              <FormGroup>
                <FormControlLabel control={<Switch checked={despiseErrors} onChange={handleChangeDespiseErrors} />} label="Despise errors" />
              </FormGroup>
              <ReactApexChart options={config.optionsDuration} series={config.seriesDuration} type="line" height={350} />
            </CardContent>  
          </Card>

          <Box mt={3}>
            <Grid container>
              <Grid item xs={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">Failure Rate</Typography>
                    <ReactApexChart options={config.optionsFailureRate} series={config.seriesFailureRate} type="line" height={350} />
                  </CardContent>  
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Box ml={3}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Failures</Typography>
                      <ReactApexChart options={config.optionsFailureRatePie} series={config.seriesFailureRatePie} type="pie" />
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
          <Box mt={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">WarmUp times (milliseconds)</Typography>
                <ReactApexChart options={config.optionsWarmUp} series={config.seriesWarmUp} type="bar" height={350} />
              </CardContent>  
            </Card>
          </Box>

          <Box mt={3}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="../.."
                    color="info"
                    startIcon={<Icon icon={arrowBackOutline} />}
                >
                    Back
                </Button>
          </Box>
        </Container>
    </Page>
  );
}

export default withSnackbar(Benchmarks)
