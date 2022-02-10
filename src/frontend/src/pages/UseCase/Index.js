import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import linkIcon from '@iconify/icons-bi/link';
import React, { useState, useEffect, useRef } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import checkCircleFilled from '@iconify/icons-ant-design/check-circle-filled';
import outlineCancel from '@iconify/icons-ic/outline-cancel';
import alertTriangleOutline from '@iconify/icons-eva/alert-triangle-outline';
import { Link as RouterLink } from 'react-router-dom';
import Modal from '@mui/material/Modal';

// material
import {
  Card,
  Table,
  Stack,
  Box,
  Chip,
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
  CircularProgress,
  Link as Links,
  Tooltip
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
  { id: 'provider', label: 'Provider', alignRight: false },
  { id: 'active', label: 'Active', alignRight: false },
  { id: 'provisionable', label: 'Provisionable', alignRight: false },
  { id: 'infrastructure', label: 'Infrastructure', alignRight: false, sortable: false },
  { id: 'urls', label: 'Urls', alignRight: false, sortable: false },
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
  const [order, setOrder] = useState(localStorage.getItem('usecase-order') ? localStorage.getItem('usecase-order') : 'asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState(localStorage.getItem('usecase-order-by') ? localStorage.getItem('usecase-order-by') : 'name');
  const [filterName, setFilterName] = useState(localStorage.getItem('usecase-search'));
  const [rowsPerPage, setRowsPerPage] = useState(localStorage.getItem('usecase-rows-per-page') ? localStorage.getItem('usecase-rows-per-page') : 5);
  const [DATALIST, setDATALIST] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [total, setTotal] = useState(0);

  


  
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    localStorage.setItem('usecase-order', isAsc ? 'desc' : 'asc');
    localStorage.setItem('usecase-order-by', property);
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

  const getData = (page,rowsPerPage,orderBy,order,filterName) =>{
    const params = {page,size:rowsPerPage,"orderBy":orderBy,"order":order,provider_active:1,"filterName":filterName}
    api.list('usecase','backend',params).then(res=>{
      const usecaseList = res.data.data
      if (usecaseList){
        usecaseList.forEach(usecase=>{
          api.list(`status/${usecase.id}/${usecase.acronym}`,'orchestrator').then(res=>{
            if (res && res.data){
              const status = res.data
              const new_statuses = statuses
              new_statuses[usecase.id] = status
              setStatuses({...statuses,new_statuses})
            }
          })
        })
        setDATALIST(usecaseList)
        setTotal(res.data.total)
      }
    }).catch(e=>{
      props.showMessageError(`Request failed ${e}`)
    })
  }

  useEffect(() => {
    getData(page,rowsPerPage,orderBy,order,filterName)
    const interval=setInterval(getData, 5000, page, rowsPerPage, orderBy, order,filterName)
    return()=>clearInterval(interval)
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
    localStorage.setItem('usecase-page', event.target.value);
    setPage(newPage);
    setControl(!control)
  };

  const handleChangeRowsPerPage = (event) => {
    localStorage.setItem('usecase-rows-per-page', parseInt(event.target.value,10));
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setControl(!control)
  };

  const handleFilterByName = (event) => {
    localStorage.setItem('usecase-search', event.target.value);
    setFilterName(event.target.value);
    setPage(0);
    setControl(!control)
  };

  const handleProvision = (id) =>{
    let row = null
    DATALIST.map(element=>{
      if(element.id===id){
        row = element
      }
      return element
    })
    const params = row.parameters ? Object.keys(row.parameters).map(key => `${key}=${encodeURIComponent(row.parameters[key])}`).join('&') : null
    api.get(`provision/${row.id}/${row.acronym}?${params}`,'orchestrator')
      .catch(error=>{
          props.showMessageError(`Provision error: ${error}`)
        })
      .then(res=>{
        if (res){
          props.showMessageSuccess("Provision requested")
        } else {
          props.showMessageError(`Provision failed: ${res}`)
        }
      })
  }

  const handleUnprovision = (id) =>{
    let row = null
    DATALIST.map(element=>{
      if(element.id===id){
        row = element
      }
      return element
    })
    const params = row.parameters ? Object.keys(row.parameters).map(key => `${key}=${encodeURIComponent(row.parameters[key])}`).join('&') : null
    api.get(`unprovision/${row.id}/${row.acronym}?${params}`,'orchestrator').then(res=>{
      if(res){
          props.showMessageSuccess("Unprovision requested")
        } else {
          props.showMessageError(`Unrovision failed: ${res}`)
        }
    })
  }

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;

  const [openModalLog, setOpenModalLog] = useState();
  const [modalLogContent, setModalLogContent] = useState();
  const [modalLogInterval, setModalLogInterval] = useState();
  
  const fetchLogs = (id, usecase, type) =>{
    api.list(`getlog/${id}/${usecase}/${type}`,'orchestrator').then(res=>{
      if (res && res.data && res.data.content){
        setModalLogContent(res.data.content.split('\n').reverse().map(str => <p>{str}</p>))
      }
    })
  }

  const startLogCapture = (id, usecase, type) =>{
    const intervalTimer = setInterval(fetchLogs, 2000, id, usecase, type);
    setModalLogInterval(intervalTimer)
    return()=>clearInterval(intervalTimer)
  }

  const handleOpenModalLog = (id, usecase, type) =>  {
    setModalLogContent("")
    startLogCapture(id, usecase, type)
    setOpenModalLog(true);
  }

  const handleCloseModalLog = () => {
    clearInterval(modalLogInterval)
    setModalLogInterval(null)
    setOpenModalLog(false);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    height:'90%',
    bgcolor: 'black',
    color: 'white',
    border: '2px solid #000',
    boxShadow: 24,
    overflow: 'scroll',
    p: 4,
  };
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
          <UseCaseListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            getData={getData}
            handleProvision={handleProvision}
            handleUnprovision={handleUnprovision}
            selected={selected}
            setSelected={setSelected}
          />
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
                  {DATALIST.length > 0 && DATALIST
                    .map((row) => {
                      const { id, name, active, acronym, provider_acronym, provisionable, urls} = row;
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
                          <TableCell align="left">{name}</TableCell>
                          <TableCell align="left">{acronym}</TableCell>
                          <TableCell align="left">{provider_acronym}</TableCell>
                          <TableCell align="left">{active ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">{provisionable ? 'Yes' : 'No'}</TableCell>
                          <TableCell align="left">
                            {(parseInt(provisionable,10)===1) ? (
                              <Grid container>
                                <Grid item xs="12">
                                  <Grid
                                      container
                                      spacing={0}
                                      direction="column"
                                      alignItems="center"
                                      justify="center"
                                  >
                                      <Grid item xs={3}>
                                          <Grid item xs={12}>
                                            {(statuses[id] && (statuses[id].status === 1 || statuses[id].status === 3)) && (
                                              




                                                [
                                                  <Box sx={{width:'100%'}}>
                                                    <Grid
                                                      container
                                                      spacing={0}
                                                      direction="column"
                                                      alignItems="center"
                                                      justifyContent="center"
                                                    >

                                                      <Grid item xs={3}>
                                                        <CircularProgress />
                                                      </Grid>   
                                                      
                                                    </Grid> 
                                                    
                                                  </Box>
                                                ,

                                                  <Box sx={{width:'100%'}}>
                                                    <Grid
                                                      container
                                                      spacing={0}
                                                      direction="column"
                                                      alignItems="center"
                                                      justifyContent="center"
                                                    >

                                                      <Grid item xs={3}>
                                                        <Button onClick={()=>{handleOpenModalLog(id,acronym,(statuses[id].status === 1)?"provision":"unprovision")}}>Log</Button>
                                                      </Grid>   
                                                      
                                                    </Grid> 
                                                    
                                                  </Box>
                                                ]
                                            )}
                                            <Box sx={{width:'100%'}}>
                                              <Grid
                                                container
                                                spacing={0}
                                                direction="column"
                                                alignItems="center"
                                                justifyContent="center"
                                              >

                                                <Grid item xs={3}>
                                                  
                                                  {(statuses[id] && statuses[id].status === 2) && (
                                                      <Icon icon={checkCircleFilled} fontSize="large" style={{color:"green",width:"2em",height:"2em"}}/>
                                                  )}
                                                  {(statuses[id] && statuses[id].status === 4) && (
                                                      <Icon icon={outlineCancel} fontSize="large" color="info" style={{color:"blue",width:"2em",height:"2em"}} />
                                                  )}
                                                  {(statuses[id] && (statuses[id].status === 5 || statuses[id].status === 6)) && (
                                                      [
                                                        <Box sx={{width:'100%'}}>
                                                          <Icon icon={alertTriangleOutline} fontSize="large" color="error" style={{color:"red",width:"2em",height:"2em"}} />
                                                        </Box>
                                                      ,
                                                        <Box sx={{width:'100%'}}>
                                                          <Button onClick={()=>{handleOpenModalLog(id,acronym,(statuses[id].status === 1)?"provision":"unprovision")}}>Log</Button>
                                                        </Box>
                                                      ]
                                                  )}
                                                </Grid>
                                              </Grid>
                                            </Box>
                                          </Grid>
                                      </Grid>   
                                  </Grid> 
                                </Grid>
                                <Grid item xs="12">
                                  <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                        alignItems="center"
                                        justify="center"
                                    >
                                      <Grid item xs={3}>
                                        <Typography variant="caption">{(statuses[id]) ? statuses[id].status_desc:'Not provisioned'}</Typography>
                                        <Typography variant="body2">
                                          {(statuses[id] && statuses[id].provision_error ) ? `Error: ${statuses[id].provision_error}`:''}
                                          {(statuses[id] && statuses[id].unprovision_error) ? `Error: ${statuses[id].unprovision_error}`:''}
                                        </Typography>
                                      </Grid>
                                    </Grid>  
                                </Grid>
                              </Grid>
                            )
                            :
                            (
                              <Grid
                                  container
                                  spacing={0}
                                  direction="column"
                                  alignItems="center"
                                  justify="center"
                              >
                                <Grid item xs={3}>
                                  <Typography variant="caption">Not aplicable</Typography>
                                </Grid>
                              </Grid>  
                            )
                            }
                          </TableCell>
                          <TableCell align="left">
                              {(urls && Object.keys(urls).length > 0 && Object.keys(urls).map(provider =>(
                                Object.keys(urls[provider]).map((verb,idx)=>(
                                  (urls[provider][verb]!=="") && (
                                    <Tooltip title={`${verb} url`}>
                                      <Box m={2}>
                                        <a href={urls[provider][verb]} target="_blank" rel="noreferrer">
                                          <Chip label={verb} >
                                            <Icon icon={linkIcon}/>
                                          </Chip>
                                        </a>
                                      </Box>
                                    </Tooltip>
                                  )
                              )))))}
                          </TableCell>
                          <TableCell align="right">
                            <UseCaseMoreMenu props={props} getData={getData} row={row} status={(statuses[id]) ? statuses[id] : null} handleProvision={handleProvision} handleUnprovision={handleUnprovision} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={9} />
                    </TableRow>
                  )}
                </TableBody>
                {!DATALIST.length > 0 && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={9} sx={{ py: 3 }}>
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

      <Modal
        open={openModalLog}
        onClose={handleCloseModalLog}
        aria-labelledby="modal-view-log"
        aria-describedby="modal-view-log"
      >
        <Box sx={style}>
          <Scrollbar>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {modalLogContent}
            </Typography>
          </Scrollbar>
        </Box>
      </Modal>

    </Page>
  );
}

export default withSnackbar(UseCases)
