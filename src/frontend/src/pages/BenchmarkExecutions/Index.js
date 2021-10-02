import { Icon } from '@iconify/react';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';
import trash2Outline from '@iconify/icons-eva/trash-2-outline';
import fileArrowDown from '@iconify/icons-bi/file-arrow-down';
import tableIcon from '@iconify/icons-bi/table';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import { useState , useEffect} from 'react';
import { Link as RouterLink , useParams} from 'react-router-dom';

// material
import { styled } from '@material-ui/core/styles';

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

  const getData = () =>{
    api.get(`benchmark/${id}`).then(res=>{
      const benchmark = res.data
      api.list(`benchmarkExecution?id_benchmark=${benchmark.id}`).then(execs=>{
        setExecutions(execs.data.data)
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
  },[id]);
  
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

  const downloadFile = async (id, type) =>{
    api.get(`benchmarkExecution/${id}/downloadFile/${type}`).then(res=>{
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

        {(parseInt(object.execution_running,10)===0)&&
          (executions.length > 0) && (executions.map(execution=>
            <Box mt={2} key={execution.id}>
              <Card>
                  <Toolbar>
                      <Typography variant="subtitle1">Execution #{execution.id} </Typography> <Typography variant="subtitle2">({moment(execution.date).format("YYYY-MM-DD H:m:s")})</Typography>
                      <div style={{marginLeft:"auto"}}>
                        
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
                          <Grid item>
                            <Typography variant="subtitle2">Repetitions: {(execution && execution.results && execution.results.raw) ? Object.keys(execution.results.raw).length : ""} </Typography>
                            <Typography variant="subtitle2">Concurrences: {(execution && execution.results && execution.results.raw) ? Object.keys(execution.results.raw[1]).join(", ") : ""} </Typography>
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