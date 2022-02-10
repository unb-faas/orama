import { Icon } from '@iconify/react';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import alertCircleFill from '@iconify/icons-eva/alert-circle-fill';
import fileArrowDown from '@iconify/icons-bi/file-arrow-down';
import tableIcon from '@iconify/icons-bi/table';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import dashboardOutlined from '@iconify/icons-ant-design/dashboard-outlined';
import { useState , useEffect} from 'react';
import { Link as RouterLink , useParams} from 'react-router-dom';
import { useTheme, styled } from '@material-ui/core/styles';
// material

import {
  Card,
  CardActions,
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
  CircularProgress,
  CardContent,
  CardHeader
} from '@material-ui/core';
// components
import { useConfirm } from 'material-ui-confirm';
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { BenchmarkListHead, BenchmarkListToolbar, BenchmarkMoreMenu } from '../../components/_dashboard/benchmark';
//
import {api} from '../../services';
import Details from './Details';
import { withSnackbar } from '../../hooks/withSnackbar';
import { RepetitionAvgChart } from './charts';


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


const BenchmarkExecutions = (props) => {
  const { id } = useParams();
  const [executions, setExecutions] = useState([]);
  const [detailed, setDetailed] = useState({});
  const confirm = useConfirm()
  const theme = useTheme();
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [total, setTotal] = useState(0);


  const defaultObject = {
    "id":null,
    "provider":{"acronym":null},
    "usecase":{"acronym":null},
    "concurrences":{"list":null},
    "repetitions":null,
    "execution_running":null,
  }
  const [object, setObject] = useState(defaultObject);

  const handleChangeDetailed = (id_execution) => {
    const n = {}
    n[id_execution] = !detailed[id_execution]
    setDetailed({...detailed,n})
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const getData = () =>{
    const params = {page,size:rowsPerPage}
    api.get(`benchmark/${id}`).then(res=>{
      const benchmark = res.data
      api.list(`benchmarkExecution?id_benchmark=${benchmark.id}`,"backend",params).then(execs=>{
        const executions = execs.data.data
        
        if (executions){
          executions.map(execution =>{
            if (execution && execution.results && execution.results.summary){
              execution.repetitionErrors = {}
              execution.concurrenceErrors = {}
              execution.repetitionsAvg = 0
              Object.keys(execution.results.summary).map(repetition=>{
                  execution.concurrenceErrors[repetition] = {}
                  Object.keys(execution.results.summary[repetition].concurrences).map(concurrence=>{
                      if (execution.results.summary[repetition].concurrences[concurrence].avg === 0){
                          execution.repetitionErrors[repetition]=true
                          execution.concurrenceErrors[repetition][concurrence]=true
                          execution.error=true
                      }
                      return concurrence
                  })
                  Object.keys(execution.results.raw[repetition]).map(concurrence=>{
                      Object.keys(execution.results.raw[repetition][concurrence]).map(request=>{
                          if (execution.results.raw[repetition][concurrence][request].success === "false"){
                            execution.repetitionErrors[repetition]=true
                            execution.concurrenceErrors[repetition][concurrence]=true
                            execution.error=true
                          }
                           return request
                      })
                      return concurrence
                  })
                  execution.repetitionsAvg += execution.results.summary[repetition].avg
                  return repetition
              })
              execution.repetitionsAvg = (Object.keys(execution.results.summary).length > 0) ? execution.repetitionsAvg / Object.keys(execution.results.summary).length : 0
            }
            return execution
          })
        }
        setTotal(execs.data.total)
        setExecutions(executions)
      }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
      api.get(`provider/${benchmark.id_provider}`).then(res=>{
        const provider = res.data
        api.get(`usecase/${benchmark.id_usecase}`).then(res=>{
          const usecase = res.data
          benchmark.provider = provider
          benchmark.usecase = usecase
          setObject(benchmark)
        }).catch(e=>{
          props.showMessageError(`Request failed ${e}`)
        })
      })
    })
  }                  

  useEffect(() => {
    getData()
  },[control]);
  
  const remove = async (id) =>{
    confirm({ description: 'Confirm removal of this item?' })
      .then(() => {
        api.remove(`benchmarkExecution/${id}`).then(res=>{
          if (res){
            props.showMessageWarning("The Execution was removed!")
            getData()
          } else {
            props.showMessageError(`Failed to remove this execution. There are dependencies.`)
          }
        })
      })
      .catch(() => { /* ... */ });
  }

  const downloadFile = async (id, type, subtype="detailed") =>{
    api.get(`benchmarkExecution/${id}/downloadFile/${type}?subtype=${subtype}`).then(res=>{
      if (res){
        window.open(res.data)
      }
    })
  }

  return (
    <Page title="Benchmark Executions | Orama Framework" >
      <Container>
        {(object !== defaultObject && (
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Benchmark Executions
              </Typography>
            </Stack>

            <Card>
              <Grid container>
                <Grid item xs={1}>
                  <Box m={2}>
                    <Typography variant="overline">Id</Typography>
                    <Typography variant="body2">{object.id}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <Typography variant="overline">Provider</Typography>
                    <Typography variant="body2">{object.provider.acronym}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box m={2}>
                    <Typography variant="overline">Use case</Typography>
                    <Typography variant="body2">{object.usecase.acronym}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box m={2}>
                    <Typography variant="overline">Concurrences</Typography>
                    <Typography variant="body2">{(object.concurrences.list)?object.concurrences.list.join(", "):null}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={3}>
                  <Box m={2}>
                    <Typography variant="overline">Repetitions</Typography>
                    <Typography variant="body2">{object.repetitions}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Card>
          </Box>
        ))}

        {(true || parseInt(object.execution_running,10)===0)&&
          (executions.length > 0) && (executions.map(execution=>
            <Box mt={2} key={execution.id}>
              <Card>
                  <Toolbar>
                      { 
                        (execution && execution.error && (
                            <Tooltip title="Error ocurred">
                                <Icon icon={alertCircleFill} width={20} height={20} style={{color:theme.palette.error.main}} />
                            </Tooltip>
                        ))
                      } 
                      
                      <Tooltip title={`at ${moment(execution.date).format("YYYY-MM-DD H:m:s")}`}>
                        <Typography variant="subtitle1">{`Execution #${execution.id}`}</Typography>
                      </Tooltip>
                      
                      <div style={{marginLeft:"auto"}}>
                        
                        <Tooltip title="Open Execution Dashboard (detailed)">
                          <IconButton
                            size="large"
                            aria-label="open execution dashboard detailed"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{downloadFile(execution.id,'dashboard')}}
                          >
                            <Icon icon={dashboardOutlined} width={20} height={20} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Open Execution Dashboard (by repetition)">
                          <IconButton
                            size="large"
                            aria-label="open execution dashboard by repetition"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{downloadFile(execution.id,'dashboard', 'byrepetition')}}
                          >
                            <Icon icon={dashboardOutlined} width={20} height={20} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Open Execution Dashboard (by concurrence)">
                          <IconButton
                            size="large"
                            aria-label="open execution dashboard by concurrence"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{downloadFile(execution.id,'dashboard', 'byconcurrence')}}
                          >
                            <Icon icon={dashboardOutlined} width={20} height={20} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Download CSV">
                          <IconButton
                            size="large"
                            aria-label="download csv"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{downloadFile(execution.id,'csv')}}
                          >
                            <Icon icon={tableIcon} width={20} height={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download Json">
                          <IconButton
                            size="large"
                            aria-label="download json"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{downloadFile(execution.id,'json')}}
                          >
                            <Icon icon={fileArrowDown} width={20} height={20} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remove this execution">
                          <IconButton
                            size="large"
                            aria-label="remove this execution"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            color="inherit"
                            edge="end"
                            onClick={()=>{remove(execution.id)}}
                          >
                            <Icon icon={trash2Outline} width={20} height={20} />
                          </IconButton>
                        </Tooltip>
                      </div>
                  </Toolbar>
                  
                  <Accordion expanded={detailed[execution.id]} onChange={()=>{handleChangeDetailed(execution.id)}}>
                    <AccordionSummary
                      expandIcon={<Icon icon={chevronCompactDown} width={20} height={20} />}
                      aria-controls="panel1bh-content"
                      id="panel1bh-header"
                    >
                      <Grid container>
                          <Grid item xs={2}>
                            <Box mt={2}>                          
                              <Typography variant="subtitle2">Repetitions: {(execution && execution.results && execution.results.raw) ? Object.keys(execution.results.raw).length : ""} </Typography>
                              <Typography variant="subtitle2">Concurrences: {(execution && execution.results && execution.results.raw) ? Object.keys(execution.results.raw[1]).join(", ") : ""} </Typography>
                              <Typography variant="subtitle2">Avg elapsed: {(execution && execution.repetitionsAvg) ? execution.repetitionsAvg.toFixed(2) : 0} </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={9}>
                              <RepetitionAvgChart id="chartRepetition" execution={execution} />
                          </Grid>  
                                                                 

                      </Grid>
                    </AccordionSummary>              
                    <Details execution={execution} benchmark={object}/>
                  </Accordion>
              </Card>
            </Box>  
          )
        )}

        {(object === defaultObject && (
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Grid item xs={3}>
                  <CircularProgress />
              </Grid>   
            </Grid> 
        ))}

        {(object !== defaultObject && parseInt(object.execution_running,10)===0)&&
          (executions.length === 0) && (
            <Box mt={2} >
              <Card>
                <CardContent>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                    >
                        <Grid item xs={3}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">None executions were found.</Typography> 
                            </Grid>
                        </Grid>   
                    </Grid> 
                </CardContent>
              </Card>
            </Box>
        )}



        {(object !== defaultObject && parseInt(object.execution_running,10)>0)&& (
          <Box mt={3}>
              <Card>
                <CardContent>
                <Grid
                    container
                    spacing={0}
                    direction="column"
                    alignItems="center"
                    justify="center"
                >
                    <Grid item xs={3}>
                        <CircularProgress />
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
                        <Typography variant="h5">Execution in progress</Typography>
                    </Grid>   
                </Grid> 
                </CardContent>
              </Card>
          </Box>
        )}

            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

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

export default withSnackbar(BenchmarkExecutions)