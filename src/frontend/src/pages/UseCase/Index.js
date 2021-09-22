import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Box,
  Grid,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  CircularProgress
} from '@material-ui/core';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import { UseCaseListHead, UseCaseListToolbar, UseCaseMoreMenu } from '../../components/_dashboard/usecase';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'id', label: 'Id', alignRight: false },
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'acronym', label: 'Acronym', alignRight: false },
  { id: 'active', label: 'Active', alignRight: false },
  { id: 'infrastructure', label: 'Infrastructure', alignRight: false },
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

const UseCases = (props) => {
  const [control, setControl] = useState(true);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [DATALIST, setDATALIST] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [total, setTotal] = useState(0);

  
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

  const getData = (page,rowsPerPage) =>{
    const params = {page,size:rowsPerPage}
    api.list('usecase','backend',params).then(res=>{
      const usecaseList = res.data.data
      usecaseList.forEach(usecase=>{
        api.list(`status/${usecase.id}/${usecase.acronym}`,'orchestrator').then(res=>{
          const status = res.data
          const new_statuses = statuses
          new_statuses[usecase.id] = status
          setStatuses({...statuses,new_statuses})
        })
      })
      setDATALIST(usecaseList)
      setTotal(res.data.total)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage)
  },[control]); 
  

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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;

  return (
    <Page title="Use Cases | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Use Cases
          </Typography>

          <Button
            variant="contained"
            component={RouterLink}
            to="create"
            startIcon={<Icon icon={plusFill} />}
          >
            New Use Case
          </Button>
        </Stack>

        <Card>
          {/* }
          <UseCaseListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            getData={getData}
          />
          */}

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UseCaseListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={DATALIST.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {DATALIST.length && DATALIST
                    .map((row) => {
                      const { id, name, active, acronym, status} = row;
                      const isItemSelected = selected.indexOf(name) !== -1;
                      
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
                              onChange={(event) => handleClick(event, name)}
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
                          <TableCell align="left">{acronym}</TableCell>
                          <TableCell align="left">{active ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            <Grid container>
                              <Grid item xs="2">
                                {(statuses[id] && (statuses[id].status === 1 || statuses[id].status === 3)) && (
                                  <CircularProgress />
                                )}
                                {(statuses[id] && statuses[id].status === 2) && (
                                    <Icon icon={checkCircleFilled} fontSize="medium" color="success"/>
                                )}
                                {(statuses[id] && statuses[id].status === 4) && (
                                    <Icon icon={outlineCancel} fontSize="medium" color="info" />
                                )}
                                {(statuses[id] && (statuses[id].status === 5 || statuses[id].status === 6)) && (
                                    <Icon icon={alertTriangleOutline} fontSize="medium" color="error" />
                                )}
                              </Grid>
                              <Grid item xs="10">
                                <Typography variant="overline">{(statuses[id]) ? statuses[id].status_desc:'Not provisioned'}</Typography>
                                <Typography variant="body2">
                                  {(statuses[id] && statuses[id].provision_error ) ? `Error: ${statuses[id].provision_error}`:''}
                                  {(statuses[id] && statuses[id].unprovision_error) ? `Error: ${statuses[id].unprovision_error}`:''}
                                </Typography>
                              </Grid>
                            </Grid>
                          </TableCell>
                          <TableCell align="right">
                            <UseCaseMoreMenu props={props} getData={getData} row={row} status={(statuses[id]) ? statuses[id] : null}/>
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
                {!DATALIST.length && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
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

export default withSnackbar(UseCases)
