import { Icon } from '@iconify/react';
import { useState , useEffect} from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import ReactApexChart from 'react-apexcharts';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';

// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Box,
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
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('benchmark-order') ? localStorage.getItem('benchmark-order') : 'desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('benchmark-order-by') ? localStorage.getItem('benchmark-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('benchmark-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('benchmark-rows-per-page') ? localStorage.getItem('benchmark-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [total, setTotal] = useState(0);

  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  
  
  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    page = 0
    rowsPerPage = ids.split(',').length
    orderBy = 'id'
    order = 'desc'
    const params = {page,size:rowsPerPage,provider_active:1,usecase_active:1,"orderBy":orderBy,"order":order,"filterName":filterName}
    api.list(`benchmarkExecution?compare=true&ids_benchmarks=${ids}`,'backend',params).then(res=>{
      const s = Object.keys(res.data.compare).map(row=>
        (
          {
            name: res.data.compare[row].benchmark.name,
            data: res.data.compare[row].avg
          }
        )
      )
      setSeries(s)
      setLabels(res.data.labels)
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }




  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
  },[control]); 


  const config = {
          
    "series": series,
    options: {
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
  
  
  };
  
  return (
    <Page title="Benchmarks Comparisson | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Benchmarks Comparison
          </Typography>
        </Stack>

          <ReactApexChart options={config.options} series={config.series} type="line" height={350} />

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
