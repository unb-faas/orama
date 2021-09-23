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
  Typography,
  TableContainer,
  TablePagination,
  Tooltip,
  CircularProgress
} from '@material-ui/core';
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
  { id: 'date', label: 'Date', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'providers', label: 'Provider', alignRight: false },
  { id: 'usecases', label: 'Use Case', alignRight: false },
  { id: 'concurrences', label: 'Concurrences', alignRight: false },
  { id: 'repetitions', label: 'Repetitions', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
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

const Benchmarks = (props) => {
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [DATALIST, setDATALIST] = useState([]);
  const [providers, setProviders] = useState({});
  const [usecases, setUsecases] = useState({});
  const [total, setTotal] = useState(0);
  

  const getData = (page,rowsPerPage) =>{
    const params = {page,size:rowsPerPage}
    api.list('benchmark','backend',params).then(res=>{
      setDATALIST(res.data.data)
      setTotal(res.data.total)
    })
  }

  const getProvidersData = () =>{
    api.list('provider').then(res=>{
      const tproviders = {}      
      res.data.data.forEach(provider=>{
        tproviders[provider.id] = provider
      })
      setProviders(tproviders)
    })
  }

  const getUsecasesData = () =>{
    api.list('usecase').then(res=>{
      const tusecases = {}      
      res.data.data.forEach(usecase=>{
        tusecases[usecase.id] = usecase
      })
      setUsecases(tusecases)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage)
    getProvidersData()
    getUsecasesData()
  },[control]); 

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = DATALIST.map((n) => n.name);
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
    setPage(newPage);
    getData(newPage,rowsPerPage)
  };

  const handleChangeRowsPerPage = (event) => {
    getData(0,parseInt(event.target.value, 10))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

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
          {/* 
          <BenchmarkListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> 
          */}

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
                  {DATALIST.length && DATALIST.map((row,idx) => {
                      const { id, id_provider, id_usecase, concurrences, repetitions, date, name, description, execution_running} = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
                      
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
                          <TableCell align="left">{moment(date).format('YYYY-MM-DD H:mm:ss')}</TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{description}</TableCell>
                          <TableCell align="left">{(providers[id_provider])?providers[id_provider].acronym:null}</TableCell>
                          <TableCell align="left">{(usecases[id_usecase])?usecases[id_usecase].acronym:null}</TableCell>
                          <TableCell align="left">{concurrences.list.join(", ")}</TableCell>
                          <TableCell align="left">{repetitions}</TableCell>
                          <TableCell align="left">
                            {(parseInt(execution_running,10) === 1) ? (
                              <Tooltip title="Execution in progress">
                                <CircularProgress />
                              </Tooltip>
                            )
                            :
                            (<Typography variant="overline">Idle</Typography>)
                            }
                          </TableCell>
                          <TableCell align="right">
                            <BenchmarkMoreMenu props={props} getData={getData} repetitions={repetitions} concurrences={concurrences.list} id_benchmark={id} id_usecase={id_usecase} usecase_acronym={(usecases[id_usecase])?usecases[id_usecase].acronym:null}/>
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
