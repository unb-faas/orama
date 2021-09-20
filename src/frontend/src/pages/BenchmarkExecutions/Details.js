import { Icon } from '@iconify/react';
import dashboardOutlined from '@iconify/icons-ant-design/dashboard-outlined';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';

import { filter } from 'lodash';

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
    Paper,
    TextField,
    Container,
    Typography,
    TableContainer,
    AppBar,
    Tabs,
    Tab,
    TablePagination,
    TableHead,
    Tooltip,
    MenuItem
  } from '@material-ui/core';
  import { useState } from 'react';
import { exec } from 'apexcharts';
import {api} from '../../services';


function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
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


const RenderLineContent = (props) => {
    const { line, idx } = props
    return(
        <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {
                    (Object.values(line).map((val,idx)=>(
                            <TableCell component="td" scope="row">
                                <Typography variant="caption">{val}</Typography>
                            </TableCell>
                    )))
                }
        </TableRow>
        )
    }

const RenderLineTitles = (props) => {
    const { line,idx } = props
    return(
        <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {
                    (line && Object.keys(line).map((val,idx)=>(
                            <TableCell component="th" scope="row">
                                <Typography variant="overline">{val}</Typography>
                            </TableCell>
                    )))
                }
        </TableRow>
        )
    }


const TabConcurrence = (props) => {
    const { repetition, concurrence, results, execution, benchmark } = props
    const [detailed, setDetailed] = useState({});
    const [listedResults, setlistedResults] = useState({});
    

    const handleChangeDetailed = (repetition,concurrence,results) => {
        const n = {}
        n[concurrence] = !detailed[concurrence]
        if (n[concurrence]){
            setlistedResults(results[repetition][concurrence])
        } else {
            setlistedResults({})
        }
        setDetailed({...detailed,n})
    };

    const handleOpenDashboard = (repetition, concurrence) =>{
        window.open(`${api.urls.benchmarker}reports/${execution.id}/${benchmark.provider.acronym.toLowerCase()}/${concurrence}/${repetition}/index.html`)
      }
    

    return (
        <Box mt={2}>
            <Card>
                <Accordion expanded={detailed[concurrence]} onChange={()=>{handleChangeDetailed(repetition,concurrence,results)}}>
                    <AccordionSummary
                        expandIcon={<Icon icon={chevronCompactDown} width={20} height={20} />}
                        aria-controls="concurrence-content"
                        id="concurrence-header"
                    >
                        <Typography>Concurrence: {concurrence}</Typography>
                        
                        <Tooltip title="Open Dashboard">
                            <MenuItem onClick={()=>{handleOpenDashboard(repetition,concurrence)}}>
                                <Icon icon={dashboardOutlined} width={20} height={20} />
                            </MenuItem>
                        </Tooltip>
                        
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    {listedResults && ( 
                                        <RenderLineTitles line={results[repetition][concurrence][0]} />
                                    )}
                                </TableHead>
                                <TableBody>
                                    {Object.keys(listedResults).map((line,idx)=>( 
                                        <RenderLineContent idx={idx} line={results[repetition][concurrence][line]} />
                                     ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Box>
    )
}


const TabRepetition = (props) => {
    const { repetition, concurrences, results, execution, benchmark } = props
    const [rdetailed, setRdetailed] = useState({});

    const handleChangeDetailedRepetition = (rp) => {
        const n = {}
        n[rp] = !rdetailed[rp]
        setRdetailed({...rdetailed,n})
    };

    return (
        <Box mt={2}>
            <Card>
                <Accordion expanded={rdetailed[repetition]} onChange={()=>{handleChangeDetailedRepetition(repetition)}}>
                    <AccordionSummary
                        expandIcon={<Icon icon={chevronCompactDown} width={20} height={20} />}
                        aria-controls="repetition-content"
                        id="repetition-header"
                    >
                        
                            <Typography>Repetition: {repetition}</Typography>
                        
                    </AccordionSummary>
                    <AccordionDetails>
                        {(concurrences.length && concurrences.map(concurrence => (
                            <TabConcurrence benchmark={benchmark} execution={execution} repetition={repetition} concurrence={concurrence} results={results} />
                        )))}
                    </AccordionDetails>
                </Accordion>
            </Card>
        </Box>
    )
}

const Details = (props) =>{
const { execution , benchmark} = props

const [tabRepetition, setTabRepetition] = useState({});
const [tabConcurrence, tabTabConcurrence] = useState({});

const handleChangeTabRepetition = (id_execution) => {
const n = {}
n[id_execution] = !tabRepetition[id_execution]
setTabRepetition({...tabRepetition,n})
};

const handleChangeTabConcurrence = (id_execution) => {
const n = {}
n[id_execution] = !tabConcurrence[id_execution]
tabTabConcurrence({...tabConcurrence,n})
};


return (
    <AccordionDetails >
        {
            execution.results && (Object.keys(execution.results).map((repetition,idx) => (

                        <TabRepetition benchmark={benchmark} execution={execution} results={execution.results} repetition={repetition} concurrences={Object.keys(execution.results[repetition])} />
                    )
                )
            )
        }
    </AccordionDetails>
)

}

export default Details