import { Icon } from '@iconify/react';
import dashboardOutlined from '@iconify/icons-ant-design/dashboard-outlined';
import chevronCompactDown from '@iconify/icons-bi/chevron-compact-down';
import alertCircleFill from '@iconify/icons-eva/alert-circle-fill';
import { useTheme } from '@material-ui/core/styles';

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
    const theme = useTheme();
    return(
        <TableRow
            key={idx}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
                {
                    (line && Object.values(line).map((val,idx)=>(
                            <TableCell component="td" scope="row" key={idx}>
                                <Typography variant="caption" style={{color:line.success === "false"?theme.palette.error.main:"default"}}>{val}</Typography>
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
                            <TableCell component="th" scope="row" key={idx}>
                                <Typography variant="overline">{val}</Typography>
                            </TableCell>
                    )))
                }
        </TableRow>
        )
    }


const TabConcurrence = (props) => {
    const { repetition, concurrence, results, execution, benchmark , summary} = props
    const [detailed, setDetailed] = useState({});
    const [listedResults, setlistedResults] = useState({});    
    const theme = useTheme();

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
        window.open(`${api.urls.benchmarker}reports/${execution.id}/${benchmark.usecase.acronym.toLowerCase()}/${concurrence}/${repetition}/index.html`)
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
                        <Grid container>
                            <Grid item xs={1}>
                                <MenuItem>
                                    {
                                        (execution && execution.concurrenceErrors[repetition] && execution.concurrenceErrors[repetition][concurrence] && (
                                            <Tooltip title="Error ocurred">
                                                <Icon icon={alertCircleFill} width={20} height={20} style={{color:theme.palette.error.main}} />
                                            </Tooltip>
                                        ))
                                    }
                                </MenuItem>
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="overline">{(parseInt(concurrence,10)===1)?`Without concorrence`:`Under ${concurrence} clients of concurrence`}  - Avg elapsed: {(summary && summary[repetition])?summary[repetition].concurrences[concurrence].avg.toFixed(2):null} </Typography>
                            </Grid>
                            <Grid item xs={1}>
                                <Tooltip title="Open Dashboard">
                                    <MenuItem onClick={()=>{handleOpenDashboard(repetition,concurrence)}}>
                                        <Icon icon={dashboardOutlined} width={20} height={20} />
                                    </MenuItem>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    {listedResults && ( 
                                        <RenderLineTitles line={(results[repetition][concurrence][0])?results[repetition][concurrence][0]:{}} />
                                    )}
                                </TableHead>
                                <TableBody>
                                    {listedResults && Object.keys(listedResults).map((line,idx)=>( 
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
    const { repetition, concurrences, results, execution, benchmark, summary } = props
    const [rdetailed, setRdetailed] = useState({});
    const theme = useTheme();

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
                            { 
                                (execution && execution.repetitionErrors[repetition] && (
                                    <Tooltip title="Error ocurred">
                                        <Icon icon={alertCircleFill} width={20} height={20} style={{color:theme.palette.error.main}} />
                                    </Tooltip>
                                ))
                            } 

                            <Typography variation="overline">{repetition}ª repetition - Avg elapsed: {(summary && summary[repetition] )?summary[repetition].avg.toFixed(2):null}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {(concurrences.length && concurrences.map(concurrence => (
                            <TabConcurrence benchmark={benchmark} execution={execution} repetition={repetition} concurrence={concurrence} results={results} summary={summary}/>
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
            execution.results && execution.results.raw && (Object.keys(execution.results.raw).map((repetition,idx) => (

                        <TabRepetition key={idx} benchmark={benchmark} execution={execution} results={(execution && execution.results)?execution.results.raw:{}} repetition={repetition} concurrences={Object.keys(execution.results.raw[repetition])} summary={execution.results.summary} />
                    )
                )
            )
        }
    </AccordionDetails>
)

}

export default Details