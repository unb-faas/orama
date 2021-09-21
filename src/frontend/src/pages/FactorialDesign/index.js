import { Icon } from '@iconify/react';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';
import dashboardOutlined from '@iconify/icons-ant-design/dashboard-outlined';

import { useState , useEffect} from 'react';
import { Link as RouterLink , useParams} from 'react-router-dom';

// material
import { styled } from '@material-ui/core/styles';

import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableBody,
  TableCell,
  Grid,
  Box,
  TextField,
  IconButton,
  Container,
  Typography,
  TableContainer,
  AppBar,
  Tabs,
  Tab,
  TablePagination,
  Toolbar,
  Tooltip,
  CardContent
} from '@material-ui/core';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { BenchmarkListHead, BenchmarkListToolbar, BenchmarkMoreMenu } from '../../components/_dashboard/benchmark';
//
import DATALIST from '../../_mocks_/benchmarks';
import {api} from '../../services';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'providers', label: 'Providers', alignRight: false },
  { id: 'usecases', label: 'Use Cases', alignRight: false },
  { id: 'concurrences', label: 'Concurrences', alignRight: false },
  { id: 'repetitions', label: 'Repetitions', alignRight: false },
  { id: '' }
];


const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3)
}));



const moment = require('moment');  

// ----------------------------------------------------------------------


const FactorialDesign = () => {
  const { id } = useParams();
  const [object, setObject] = useState({
    "id":null,
    "provider":{"acronym":null},
    "usecase":{"acronym":null},
    "concurrences":{"list":null},
    "repetitions":null,
  });
  const [executions, setExecutions] = useState([]);

  const getData = () =>{
    api.get(`benchmark/${id}`).then(res=>{
      const benchmark = res.data
      api.list(`benchmarkExecution?id_benchmark=${benchmark.id}`).then(execs=>{
        setExecutions(execs.data.data)
      })
      
      api.get(`provider/${benchmark.id_provider}`).then(res=>{
        const provider = res.data
        api.get(`usecase/${benchmark.id_usecase}`).then(res=>{
          const usecase = res.data
          benchmark.provider = provider
          benchmark.usecase = usecase
          setObject(benchmark)
        })
      })
    })
  }                  

  useEffect(() => {
  },[id]); 

  return (
    <Page title="Factorial Design | Orama Framework" >
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Factorial Design
          </Typography>
        </Stack>
            <Box mt={2} mb={2}>
              <Card>
                <CardContent>
                
                  
                  <Grid container>
                    
                  <Grid item xs={3}>
                      <Box m={2}>
                        <Card>
                          <CardContent style={{backgroundColor: "#c8facd"}}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="overline">Provider</Typography>
                              </Grid>   
                            </Grid> 

                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="h1">67%</Typography>
                              </Grid>   
                            </Grid> 
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box m={2}>
                        <Card>
                          <CardContent style={{backgroundColor: "#c8facd"}}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="overline">Concurrence</Typography>
                              </Grid>   
                            </Grid> 

                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="h1">13%</Typography>
                              </Grid>   
                            </Grid> 
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box m={2}>
                        <Card>
                          <CardContent style={{backgroundColor: "#c8facd"}}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="overline">Provider x Concorrence</Typography>
                              </Grid>   
                            </Grid> 

                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="h1">19%</Typography>
                              </Grid>
                            </Grid> 
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>

                    <Grid item xs={3}>
                      <Box m={2}>
                        <Card>
                          <CardContent style={{backgroundColor: "#f7b9b9"}}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="overline">Amostral Errors</Typography>
                              </Grid>   
                            </Grid> 

                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="center"
                              justify="center"
                            >
                              <Grid item xs={3}>
                                <Typography variant="h1">1%</Typography>
                              </Grid>   
                            </Grid> 
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
          </Box>  
      </Container>
    </Page>
  );
}

export default FactorialDesign