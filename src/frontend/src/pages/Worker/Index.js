import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { WorkerListHead, WorkerListToolbar, WorkerMoreMenu } from '../../components/_dashboard/worker';
import { withSnackbar } from '../../hooks/withSnackbar';


import {api} from '../../services';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false , sx: { display: { xs: 'none', xl: 'table-cell' } }},
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'uuid', label: 'UUID', alignRight: false },
  { id: 'health', label: 'Health', alignRight: false },
  { id: 'role', label: 'Role', alignRight: false , sx: { display: { xs: 'none', xl: 'table-cell' } }},
  { id: 'active', label: 'Active', alignRight: false },
  { id: 'created_at', label: 'Created at', alignRight: false , sx: { display: { xs: 'none', xl: 'table-cell' } }},
  { id: 'last_up_at', label: 'Last UP at', alignRight: false },
  { id: '' }
];

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

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_data) => _data.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const Workers = (props) => {
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState(localStorage.getItem('worker-order') ? localStorage.getItem('worker-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('worker-order-by') ? localStorage.getItem('worker-order-by') : 'name');
  const [filterName, setFilterName] = useState(localStorage.getItem('worker-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('worker-rows-per-page') ? localStorage.getItem('worker-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [total, setTotal] = useState(0);


  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('worker-order', isAsc ? 'desc' : 'asc');
    localStorage.setItem('worker-order-by', property);
    setControl(!control)
  };

  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order,"filterName":filterName}
    api.list('worker','backend',params).then(res=>{
      setDATALIST(res.data.data)
      setTotal(res.data.total)
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
  },[control]);

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
    localStorage.setItem('worker-page', event.target.value);
    setPage(newPage);
    getData(newPage,rowsPerPage)
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem('worker-rows-per-page', parseInt(event.target.value,10));
    getData(0,parseInt(event.target.value, 10))
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const handleFilterByName = (event) => {
    localStorage.setItem('worker-search', event.target.value);
    setFilterName(event.target.value);
    setPage(0);
    setControl(!control)
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;

  const filteredWorkers = applySortFilter(DATALIST, getComparator(order, orderBy), filterName);

  const isWorkersNotFound = filteredWorkers.length === 0;



  return (
    <Page title="Workers | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Workers
          </Typography>
        </Stack>

        <Card>
          <WorkerListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            selected={selected}
            getData={getData}
            setSelected={setSelected}
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <WorkerListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DATALIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                  props={props}
                />
                <TableBody>
                  {DATALIST.length >0 && DATALIST
                    .map((row) => {
                      const { id, name, uuid, created_at, last_up_at, role, active, health} = row;
                      const isItemSelected = selected.indexOf(id) !== -1;
                      let roleDescription = ""
                      switch (role) {
                        case 0:
                          roleDescription = "benchmarker"
                          break;
                        case 1:
                          roleDescription = "orchestrator"
                          break;
                        
                        default:
                          break;
                      }

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
                          <TableCell component="th" scope="row" sx={{ display: { xs: 'none', xl: 'table-cell' } }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Typography variant="subtitle2" noWrap>
                                  {id}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{uuid}</TableCell>
                          <TableCell align="left">{health ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left" sx={{ display: { xs: 'none', xl: 'table-cell' } }}>{roleDescription}</TableCell>
                          <TableCell align="left">{active ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left" sx={{ display: { xs: 'none', xl: 'table-cell' } }}>{created_at}</TableCell>
                          <TableCell align="left">{last_up_at}</TableCell>
                          <TableCell align="right">
                            <WorkerMoreMenu props={props} row={row} getData={getData}/>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {!DATALIST.length > 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={8} sx={{ py: 3 }}>
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

export default withSnackbar(Workers)
