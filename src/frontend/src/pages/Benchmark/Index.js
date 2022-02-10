import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState , useEffect} from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
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
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { BenchmarkListHead, BenchmarkListToolbar, BenchmarkMoreMenu } from '../../components/_dashboard/benchmark';
import {api} from '../../services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'providers', label: 'Provider', alignRight: false },
  { id: 'usecases', label: 'Use Case', alignRight: false },
  { id: 'concurrences', label: 'Concurrences', alignRight: false },
  { id: 'repetitions', label: 'Repetitions', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false, sortable: false },
  { id: '' }
];

const moment = require('moment');  

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 15 }}>
        <Typography variant="overline" color="text.secondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const Benchmarks = (props) => {
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('benchmark-order') ? localStorage.getItem('benchmark-order') : 'desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('benchmark-order-by') ? localStorage.getItem('benchmark-order-by') : 'id');
  const [filterName, setFilterName] = useState(localStorage.getItem('benchmark-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('benchmark-rows-per-page') ? localStorage.getItem('benchmark-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [providers, setProviders] = useState({});
  const [usecases, setUsecases] = useState({});
  const [total, setTotal] = useState(0);
  
  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,provider_active:1,usecase_active:1,"orderBy":orderBy,"order":order,"filterName":filterName}
    api.list('benchmark','backend',params).then(res=>{
      setDATALIST(res.data.data)
      setTotal(res.data.total)
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const getProvidersData = () =>{
    const params = {size:200,active:1}
    api.list('provider','backend',params).then(res=>{
      const tproviders = {}
      if (res.data.data){
        res.data.data.forEach(provider=>{
          tproviders[provider.id] = provider
        })
        setProviders(tproviders)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  const getUsecasesData = () =>{
    const params = {size:200,provider_active:1, active:1}
    api.list('usecase','backend',params).then(res=>{
      const tusecases = {}      
      if (res.data.data){
        res.data.data.forEach(usecase=>{
          tusecases[usecase.id] = usecase
        })
        setUsecases(tusecases)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
    getProvidersData()
    getUsecasesData()
    const interval=setInterval(getData,5000,page,rowsPerPage,orderBy,order,filterName)
    return()=>clearInterval(interval)
  },[control]); 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('benchmark-order', isAsc ? 'desc' : 'asc');
    localStorage.setItem('benchmark-order-by', property);
    setControl(!control)
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DATALIST.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    localStorage.setItem('benchmark-page', event.target.value);
    setPage(newPage);
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem('benchmark-rows-per-page', parseInt(event.target.value,10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const handleFilterByName = (event) => {
    localStorage.setItem('benchmark-search', event.target.value);
    setFilterName(event.target.value);
    setPage(0);
    setControl(!control)
  };

  const playBenchmark = async (id) =>{
    let row = null
    DATALIST.map(element=>{
      if(element.id===id){
        row = element
      }
      return element
    })

    if (row){
      let rowUseCase = null
      Object.values(usecases).map(element=>{
        if(element.id===row.id_usecase){
          rowUseCase = element
        }
        return element
      })
      if (rowUseCase){
       
        if (parseInt(rowUseCase.provisionable,10) === 1){
          api.get(`status/${rowUseCase.id}/${rowUseCase.acronym}`,"orchestrator").then(usecase_status => {
            if (usecase_status.data && parseInt(usecase_status.data.status,10) === 2){
              api.get(`benchmark/${id}/play`).then(res=>{
                props.showMessageSuccess("The benchmark execution was requested!")
              }).catch(e=>{
                props.showMessageError(`Request failed ${e}`)
              })
            } else {
              props.showMessageError("The use case is not ready! It should be provisioned.")
            }
          })
        } else {
          api.get(`benchmark/${id}/play`).then(res=>{
            props.showMessageSuccess("The benchmark execution was requested!")
          }).catch(e=>{
            props.showMessageError(`Request failed ${e}`)
          })
        }
      }
    }
  }

  const stopBenchmark = async (id) =>{
    let row = null
    DATALIST.map(element=>{
      if(element.id===id){
        row = element
      }
      return element
    })

    if (row){
      let rowUseCase = null
      Object.values(usecases).map(element=>{
        if(element.id===row.id_usecase){
          rowUseCase = element
        }
        return element
      })
      if (rowUseCase){
       
        if (parseInt(rowUseCase.provisionable,10) === 1){
          api.get(`status/${rowUseCase.id}/${rowUseCase.acronym}`,"orchestrator").then(usecase_status => {
            if (usecase_status.data && parseInt(usecase_status.data.status,10) === 2){
              api.get(`benchmark/${id}/stop`).then(res=>{
                props.showMessageSuccess("The benchmark stop was requested!")
              }).catch(e=>{
                props.showMessageError(`Request failed ${e}`)
              })
            } else {
              props.showMessageError("The use case is not ready! It should be provisioned.")
            }
          })
        } else {
          api.get(`benchmark/${id}/stop`).then(res=>{
            props.showMessageSuccess("The benchmark stop was requested!")
          }).catch(e=>{
            props.showMessageError(`Request failed ${e}`)
          })
        }
      }
    }
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;

  return (
    <Page title="Benchmarks | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Benchmarks
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="create"
            startIcon={<Icon icon={plusFill} />}
          >
            New Benchmark
          </Button>
        </Stack>

        <Card>
          <BenchmarkListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            setSelected={setSelected}
            playBenchmark={playBenchmark}
          /> 
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <BenchmarkListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DATALIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {DATALIST.length>0 && DATALIST.map((row,idx) => {
                      const { id, id_provider, id_usecase, concurrences, repetitions, name, description, execution_running, execution_percent, activation_url} = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
                      const execution_progress = (execution_percent) ? execution_percent*100 : 0;
                      return (
                        <TableRow
                          hover
                          key={id}
                          tabIndex={-1}
                          role="checkbox"
                          selected={isItemSelected}
                          aria-checked={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isItemSelected}
                              onChange={(event) => handleClick(event, id)}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="left">{(providers[id_provider])?providers[id_provider].acronym:null}</TableCell>
                          <TableCell align="left">{(usecases[id_usecase])?usecases[id_usecase].acronym:null}</TableCell>
                          <TableCell align="left">{concurrences.list.join(", ")}</TableCell>
                          <TableCell align="left">{repetitions}</TableCell>
                          <TableCell align="left">
                            {(parseInt(execution_running,10) > 0) ? (
                             [ <Tooltip title="Execution in progress">
                                <CircularProgress />
                              </Tooltip>
                              ,
                              <Box sx={{ width: '100%' }}>
                                <LinearProgressWithLabel value={execution_progress} />
                              </Box>
                             ]
                            )
                            :
                            (
                              <div>
                                {
                                  (usecases && usecases[row.id_usecase] && usecases[row.id_usecase].urls && Object.keys(usecases[row.id_usecase].urls).length > 0 && activation_url) ? 
                                  (
                                    <Typography variant="overline">Ready</Typography>
                                  )
                                  :
                                  (
                                    <Typography variant="overline">Idle</Typography>
                                  )
                                }
                              </div>
                            )
                            }
                          </TableCell>
                          <TableCell align="right">
                            <BenchmarkMoreMenu usecases={usecases} row={row} props={props} getData={getData} repetitions={repetitions} concurrences={concurrences.list} id_benchmark={id} id_usecase={id_usecase} usecase_acronym={(usecases[id_usecase])?usecases[id_usecase].acronym:null} playBenchmark={playBenchmark} stopBenchmark={stopBenchmark}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={10} />
                    </TableRow>
                  )}
                </TableBody>
                {!DATALIST.length && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={10} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default withSnackbar(Benchmarks)
