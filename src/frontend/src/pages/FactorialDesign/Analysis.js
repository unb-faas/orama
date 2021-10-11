import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import checkCircleFill from '@iconify/icons-bi/check-circle-fill';
import roundCancel from '@iconify/icons-ic/round-cancel';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import arrowRightOutlined from '@iconify/icons-ant-design/arrow-right-outlined';

// material
import { 
        Stack, 
        TextField, 
        Container,
        Typography,
        Card,
        CardContent,
        MenuItem,
        Button,
        Box,
        List,
        ListItemText,
        Grid,
        CardHeader,
        Tooltip,
        Checkbox,
        ListItem,
        Switch,
        FormControlLabel,
        TableCell,
        Table,
        TableRow,
        TableHead,
        TableBody
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';

import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
import { useTheme, styled } from '@material-ui/core/styles';
import Scrollbar from '../../components/Scrollbar';
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// utils
import { fNumber } from '../../utils/formatNumber';
import { BaseOptionChart } from '../../components/charts';
import { RepetitionAvgChart, ConcurrenceAvgChart, FractionsChart } from './charts';

// ----------------------------------------------------------------------

const FactorialDesignAnalysis = (props)=> {
  const navigate = useNavigate();
  const {id} = useParams()
  const [data, setData] = useState({
      id:null,
      name:null,
      acronym:null,
      active:0,
      benchmarks:{list:{}}
  })
  const getData = () =>{
    api.get(`factorialDesign/${id}/analysis`).then(res=>{
        setData(res.data)
    })
  }

  const theme = useTheme();


  useEffect(() => {
    if (id){
        getData()
    }
  },[id]);

  return (
    <Page title="Factorial Design Analysis | Orama Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Factorial Design Analysis
                </Typography>
            </Stack>
                <Box>
                        {(data && data.validate && !data.validate.result ? (
                            <Stack>
                                <Stack>
                                    <Typography variant="overline">Error: </Typography><Typography variant="caption">{data.validate.message}</Typography>
                                </Stack>
                            </Stack>
                        )
                        :
                        (
                            <Box mt={2}>
                                <Box mt={2}>
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
                                                        <Typography variant="h5">{data.name}</Typography> 
                                                    </Grid>
                                                </Grid>   
                                            </Grid> 
                                            <Box mt={4}>
                                                <Stack spacing={3}>
                                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>                                        
                                                        {(data && data.benchmarks && Object.keys(data.benchmarks).length) && Object.keys(data.benchmarks).map((row,idx)=>(
                                                            <Box display="inline-block" style={{width:"100%"}} keys={idx}>
                                                                <Scrollbar>
                                                                    <Grid container>
                                                                        <Grid xs={12}>
                                                                            <Typography variant="caption">Benchmark: </Typography><Typography variant="overline">{data.benchmarks[row].name}</Typography>
                                                                        </Grid>

                                                                        <Grid xs={12}>
                                                                            <Typography variant="caption">Concurrences: </Typography><Typography variant="overline">{(data.benchmarks[row].execution)?Object.keys(data.benchmarks[row].execution.results.raw[1]).join(", "):null}</Typography>
                                                                        </Grid>

                                                                        <Grid xs={12}>
                                                                            <Typography variant="caption">Repetitions: </Typography><Typography variant="overline">{(data.benchmarks[row].execution)?Object.keys(data.benchmarks[row].execution.results.raw).length:null}</Typography>
                                                                        </Grid>

                                                                        <Grid xs={12} key="chartRepetition">
                                                                            <RepetitionAvgChart id="chartRepetition" benchmark={data.benchmarks[row]} title="Avg latencies per repetition"  />
                                                                        </Grid>

                                                                        <Grid xs={12} key="chartConcurrence">
                                                                            <ConcurrenceAvgChart id="chartConcurrence" benchmark={data.benchmarks[row]} title="Avg latencies per concurrence"  />
                                                                        </Grid>
                                                                    </Grid>
                                                                </Scrollbar>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </Stack>
                                            </Box>                                       
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box mt={2}>
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
                                                    <Typography variant="h5">Factors for latency analysis </Typography>
                                                </Grid>   
                                            </Grid> 
                                            
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><Typography variant="caption">Factor</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Low level</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">High Level</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(data && data.plan && data.plan.levels && Object.keys(data.plan.levels).map((row,idx)=>(
                                                        <TableRow keys={idx}>
                                                            <TableCell><Typography>{data.plan.levels[row].factor}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.levels[row].low}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.levels[row].high}</Typography></TableCell>
                                                        </TableRow>
                                                    )))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box mt={2}>
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
                                                    <Typography variant="h5">Plan</Typography>
                                                </Grid>   
                                            </Grid> 
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><Typography variant="caption">Test</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">I</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Factor A</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Factor B</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Factor AxB</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Y</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Avg of Y</Typography></TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares of Y">
                                                                <Typography variant="caption">SSY (in line)</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {(data && data.plan && data.plan.matrix && Object.keys(data.plan.matrix).map((row,idx)=>(
                                                        <TableRow keys={idx}>
                                                            <TableCell><Typography>{data.plan.matrix[row].test}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].i}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].a}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].b}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].ab}</Typography></TableCell>
                                                            <TableCell><Typography>{Object.values(data.plan.matrix[row].y).join(", ")}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].avgy.toFixed(4)}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].error.toFixed(4)}</Typography></TableCell>
                                                        </TableRow>
                                                    )))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box mt={2}>
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
                                                    <Typography variant="h5">Effects</Typography>
                                                </Grid>   
                                            </Grid> 
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><Typography /></TableCell>
                                                        <TableCell><Typography variant="caption">i</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Provider</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Concurrence</Typography></TableCell>
                                                        <TableCell><Typography variant="caption">Provider x Concurrence</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography variant="caption">Values</Typography></TableCell>
                                                                <TableCell><Typography >{data.plan.effects.i.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography >{data.plan.effects.a.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography >{data.plan.effects.b.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography >{data.plan.effects.ab.toFixed(4)}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                        {(data && data.plan && data.plan.confidenceIntervals && data.plan.confidenceIntervals.map((row,idx)=>(
                                                            <TableRow key={idx}>
                                                                <TableCell><Typography variant="caption">{`Confidence interval (${parseFloat(row.quantil)*100})%`}</Typography></TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.i.low < 0 && row.i.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography style={{color:(row.i.low < 0 && row.i.high > 0)?theme.palette.error.main:""}}>{`( ${row.i.low.toFixed(2)}, ${row.i.high.toFixed(2)} ) `}
                                                                            {(row.i.low < 0 && row.i.high > 0)?(
                                                                                <Icon icon={roundCancel} fontSize="large" style={{color:theme.palette.error.main}}/>
                                                                            ):( 
                                                                                <Icon icon={checkCircleFill} fontSize="large" style={{color:theme.palette.success.main}}/>
                                                                            )}
                                                                        </Typography>
                                                                    
                                                                            
                                                                    
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.a.low < 0 && row.a.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography style={{color:(row.a.low < 0 && row.a.high > 0)?theme.palette.error.main:""}}>{`( ${row.a.low.toFixed(2)}, ${row.a.high.toFixed(2)} ) `}
                                                                            {(row.a.low < 0 && row.a.high > 0)?(
                                                                                <Icon icon={roundCancel} fontSize="large" style={{color:theme.palette.error.main}}/>
                                                                            ):( 
                                                                                <Icon icon={checkCircleFill} fontSize="large" style={{color:theme.palette.success.main}}/>
                                                                            )}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.b.low < 0 && row.b.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography style={{color:(row.b.low < 0 && row.b.high > 0)?theme.palette.error.main:""}}>{`( ${row.b.low.toFixed(2)}, ${row.b.high.toFixed(2)} ) `}
                                                                            {(row.b.low < 0 && row.b.high > 0)?(
                                                                                <Icon icon={roundCancel} fontSize="large" style={{color:theme.palette.error.main}}/>
                                                                            ):( 
                                                                                <Icon icon={checkCircleFill} fontSize="large" style={{color:theme.palette.success.main}}/>
                                                                            )}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.ab.low < 0 && row.ab.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography style={{color:(row.ab.low < 0 && row.ab.high > 0)?theme.palette.error.main:""}}>{`( ${row.ab.low.toFixed(2)}, ${row.ab.high.toFixed(2)} ) `}
                                                                            {(row.ab.low < 0 && row.ab.high > 0)?(
                                                                                <Icon icon={roundCancel} fontSize="large" style={{color:theme.palette.error.main}}/>
                                                                            ):( 
                                                                                <Icon icon={checkCircleFill} fontSize="large" style={{color:theme.palette.success.main}}/>
                                                                            )}
                                                                        </Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                            </TableRow>
                                                        )))}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box mt={2}>
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
                                                    <Typography variant="h5">Metrics</Typography>
                                                </Grid>   
                                            </Grid> 
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squared estimate of errors">
                                                                <Typography variant="caption">SSE</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares of y">
                                                                <Typography variant="caption">SSY</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares total">
                                                                <Typography variant="caption">SST</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Mean Square of Errors">
                                                                <Typography variant="caption">MSE</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Degrees of Freedom">
                                                                <Typography variant="caption">DoF</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Standard Deviation of Errors">
                                                                <Typography variant="caption">Se</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Standard Deviation of Effects">
                                                                <Typography variant="caption">Sqi</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography>{data.plan.sse.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.ssy.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.sst.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.mse.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.dof.toFixed(0)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.se.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.sqi.toFixed(4)}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </Box>
                                <Box mt={2}>
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
                                                    <Typography variant="h5">Fractions</Typography>
                                                </Grid>   
                                            </Grid> 
                                            <Box mt={2}>                      
                                                <FractionsChart data={data} />
                                            </Box>
                                            <Box mt={2}>
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell><Typography variant="caption">Provider</Typography></TableCell>
                                                            <TableCell><Typography variant="caption">Concurrence</Typography></TableCell>
                                                            <TableCell><Typography variant="caption">Provider x Concurrence</Typography></TableCell>
                                                            <TableCell><Typography variant="caption">Error</Typography></TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                            {(data && data.plan &&
                                                                <TableRow>
                                                                    <TableCell><Typography>{data.plan.fractions.a.toFixed(2)}%</Typography></TableCell>
                                                                    <TableCell><Typography>{data.plan.fractions.b.toFixed(2)}%</Typography></TableCell>
                                                                    <TableCell><Typography>{data.plan.fractions.ab.toFixed(2)}%</Typography></TableCell>
                                                                    <TableCell><Typography>{data.plan.fractions.error.toFixed(2)}%</Typography></TableCell>
                                                                </TableRow>
                                                            )}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Box mt={2}>
                                    {(data && data.plan && data.plan.tests && data.plan.tests.length && (
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
                                                        <Typography variant="h5">Tests</Typography>
                                                    </Grid>   
                                                </Grid> 

                                                {(data.plan.tests.map((test,idx) =>(
                                                    <Box mt={2} key={idx}>
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><Typography variant="caption">Test Name</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Difference</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Difference Standard Deviation</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Effective DoF</Typography></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                <TableRow>
                                                                    <TableCell><Typography>{test.name}</Typography></TableCell>
                                                                    <TableCell><Typography>{test.difference.toFixed(2)}</Typography></TableCell>
                                                                    <TableCell><Typography>{test.standardDeviation.toFixed(2)}</Typography></TableCell>
                                                                    <TableCell><Typography>{test.effectiveDof.toFixed(2)}</Typography></TableCell>
                                                                </TableRow>
                                                            </TableBody>
                                                        </Table>
                                                       
                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><Typography variant="caption">Confidence</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Confidence Interval of the Difference</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Result</Typography></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {(Object.keys(test.cis).map((ci,idx3) =>(
                                                                    <TableRow key={idx3}>
                                                                        <TableCell><Typography>{(ci*100).toFixed(2)}%</Typography></TableCell>
                                                                        <TableCell>
                                                                            <Grid container>
                                                                                <Typography>({`${test.cis[ci].low.toFixed(2)} , ${test.cis[ci].high.toFixed(2)}`})</Typography>
                                                                            </Grid>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            {(test.cis[ci].low<0 && test.cis[ci].high>0)?(
                                                                                <Tooltip title={`The difference is not significative with ${(ci*100).toFixed(2)}% of confidence`}>
                                                                                    <Icon icon={roundCancel} fontSize="large" style={{color:theme.palette.error.main}}/>
                                                                                </Tooltip>
                                                                            ):( 
                                                                                <Tooltip title={`The difference is significative with ${(ci*100).toFixed(2)}% of confidence`}>
                                                                                    <Icon icon={checkCircleFill} fontSize="large" style={{color:theme.palette.success.main}}/>
                                                                                </Tooltip>
                                                                            )}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )))}
                                                            </TableBody>
                                                        </Table>

                                                        <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><Typography variant="caption">Benchmark</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Count</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Mean</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Sum of Values</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Sum of Squared Values</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Sum of Squared Errors</Typography></TableCell>
                                                                    <TableCell><Typography variant="caption">Standard Deviation</Typography></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {(Object.keys(test.samples).map((sample,idx2) =>(
                                                                    <TableRow key={idx2}>
                                                                        <TableCell><Typography>{test.samples[sample].name}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].count}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].mean.toFixed(2)}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].sumValue.toFixed(2)}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].sumSquareValue.toFixed(2)}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].sumSquareError.toFixed(2)}</Typography></TableCell>
                                                                        <TableCell><Typography>{test.samples[sample].standardDeviation.toFixed(2)}</Typography></TableCell>
                                                                    </TableRow>
                                                                )))}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                )))}
                                                
                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>
                        ))}
            </Box>
    
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
export default withSnackbar(FactorialDesignAnalysis)