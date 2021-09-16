import { Icon } from '@iconify/react';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';
import dashboardOutlined from '@iconify/icons-ant-design/dashboard-outlined';

import { filter } from 'lodash';
import { useState } from 'react';
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
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TableBody,
  TableCell,
  Grid,
  Box,
  TextField,
  Container,
  Typography,
  TableContainer,
  AppBar,
  Tabs,
  Tab,
  TablePagination
} from '@material-ui/core';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import { BenchmarkListHead, BenchmarkListToolbar, BenchmarkMoreMenu } from '../components/_dashboard/benchmark';
//
import DATALIST from '../_mocks_/benchmarks';

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function BenchmarkExecutions() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('desc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - DATALIST.length) : 0;

  const filteredData = applySortFilter(DATALIST, getComparator(order, orderBy), filterName);

  const isDataNotFound = filteredData.length === 0;

  const [expanded, setExpanded] = useState(false);

  const handleChangeAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleChange2 = (event, newValue) => {
    setValue2(newValue);
  };

  const [value, setValue] = useState(0);
  const [value2, setValue2] = useState(0);

  

  return (
    <Page title="Benchmark Executions | Orama Framework">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Benchmark Executions
          </Typography>
        </Stack>

        <Card>
          <Grid container>
            <Grid item xs={2}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Id"
                  disabled
                  value="1"
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Date"
                  disabled
                  value="2021-01-01 11-11-11"
                />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Providers"
                  disabled
                  value="GCP, AWS"
                />
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Use Cases"
                  disabled
                  value="F2DB, F2OS"
                />
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Concurrences"
                  disabled
                  value="10, 100, 250, 500, 1000"
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box m={2}>
                <TextField
                  fullWidth
                  label="Repetitions"
                  disabled
                  value="10"
                />
              </Box>
            </Grid>
          </Grid>
        </Card>

        <Box mt={5}>
          <Card>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChangeAccordion('panel1')}>
              <AccordionSummary
                expandIcon={<Icon icon={chevronCompactDown} width={20} height={20} />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                Execution - 2021-08-29 11:23:12
              </AccordionSummary>
              <AccordionDetails>

              <Typography>Sumary <Icon icon={dashboardOutlined} width={20} height={20} /> </Typography>

              <Grid container>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="Average"
                      disabled
                      value="654"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="Min"
                      disabled
                      value="654"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="Max"
                      disabled
                      value="456"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="Median"
                      disabled
                      value="654"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="95th pct"
                      disabled
                      value="234"
                    />
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box m={2}>
                    <TextField
                      fullWidth
                      label="99th pct"
                      disabled
                      value="345"
                    />
                  </Box>
                </Grid>

      
              </Grid>
              

              <Typography>Details</Typography>
                

              <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                  <Tab label="1" {...a11yProps(0)} />
                  <Tab label="2" {...a11yProps(1)} />
                  <Tab label="3" {...a11yProps(2)} />
                  <Tab label="4" {...a11yProps(3)} />
                  <Tab label="5" {...a11yProps(4)} />
                  <Tab label="6" {...a11yProps(5)} />
                  <Tab label="7" {...a11yProps(6)} />
                  <Tab label="8" {...a11yProps(7)} />
                  <Tab label="9" {...a11yProps(8)} />
                  <Tab label="10" {...a11yProps(9)} />
                </Tabs>
              </AppBar>
              <TabPanel value={value} index={0}>
                        <Grid container>
                          <Grid item xs={1}>
                            <AppBar position="static">
                              <Tabs value={value2} onChange={handleChange2} aria-label="simple tabs example" orientation="vertical">
                                <Tab label="10" {...a11yProps(0)} />
                                <Tab label="100" {...a11yProps(1)} />
                                <Tab label="250" {...a11yProps(2)} />
                                <Tab label="500" {...a11yProps(3)} />
                                <Tab label="1000" {...a11yProps(4)} />
                              </Tabs>
                            </AppBar>
                          </Grid>

                          <Grid item xs={11}>
                            <TabPanel value={value2} index={0}>
                            <Grid container>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="Average"
                              disabled
                              value="654"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="Min"
                              disabled
                              value="654"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="Max"
                              disabled
                              value="456"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="Median"
                              disabled
                              value="654"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="95th pct"
                              disabled
                              value="234"
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={2}>
                          <Box m={2}>
                            <TextField
                              fullWidth
                              label="99th pct"
                              disabled
                              value="345"
                            />
                          </Box>
                        </Grid>

              
                      </Grid>
                    </TabPanel>
                    <TabPanel value={value2} index={1}>
                      100
                    </TabPanel>
                    <TabPanel value={value2} index={2}>
                      250
                    </TabPanel>
                    <TabPanel value={value2} index={3}>
                      500
                    </TabPanel>
                    <TabPanel value={value2} index={4}>
                      1000
                    </TabPanel>
                  </Grid>

                </Grid>
                
                
              </TabPanel>
              <TabPanel value={value} index={1}>
                2
              </TabPanel>
              <TabPanel value={value} index={2}>
                3
              </TabPanel>
              <TabPanel value={value} index={3}>
                4
              </TabPanel>
              <TabPanel value={value} index={4}>
                5
              </TabPanel>
              <TabPanel value={value} index={5}>
                6
              </TabPanel>
              <TabPanel value={value} index={6}>
                7
              </TabPanel>
              <TabPanel value={value} index={7}>
                8
              </TabPanel>
              <TabPanel value={value} index={8}>
                9
              </TabPanel>
              <TabPanel value={value} index={9}>
                10
              </TabPanel>

              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>
        
      </Container>
    </Page>
  );
}
