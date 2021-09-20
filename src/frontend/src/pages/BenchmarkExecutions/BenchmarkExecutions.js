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
  Tooltip
} from '@material-ui/core';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { BenchmarkListHead, BenchmarkListToolbar, BenchmarkMoreMenu } from '../../components/_dashboard/benchmark';
//
import DATALIST from '../../_mocks_/benchmarks';
import {api} from '../../services';
import Details from './Details';


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


const BenchmarkExecutions = () => {
  const { id } = useParams();
  const [object, setObject] = useState({
    "id":null,
    "provider":{"acronym":null},
    "usecase":{"acronym":null},
    "concurrences":{"list":null},
    "repetitions":null,
  });
  const [executions, setExecutions] = useState([]);
  const [detailed, setDetailed] = useState({});

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
    getData()
  },[id]); 

  return (
    <Page title="Benchmark Executions | Orama Framework" >
      <Container>
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

        {(executions.length > 0) && (executions.map(execution=>
            <Box mt={5} key={execution.id}>
            <Card>
              <Accordion expanded={detailed[execution.id]} onChange={()=>{handleChangeDetailed(execution.id)}}>
                <AccordionSummary
                  expandIcon={<Icon icon={chevronCompactDown} width={20} height={20} />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography variant="overline">Execution</Typography> <Typography variant="caption">({moment(execution.date).format("YYYY-MM-DD H:m:s")})</Typography>
                </AccordionSummary>
                <Details execution={execution} benchmark={object}/>
              </Accordion>
            </Card>
          </Box>  
        ))}
      </Container>
    </Page>
  );
}

export default BenchmarkExecutions