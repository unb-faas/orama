import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
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
                                                        <TableCell><Typography variant="subtitle1">Factor</Typography></TableCell>
                                                        <TableCell><Typography variant="subtitle1">Low level</Typography></TableCell>
                                                        <TableCell><Typography variant="subtitle1">High Level</Typography></TableCell>
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
                                                        <TableCell><Typography>Test</Typography></TableCell>
                                                        <TableCell><Typography>I</Typography></TableCell>
                                                        <TableCell><Typography>Factor A</Typography></TableCell>
                                                        <TableCell><Typography>Factor B</Typography></TableCell>
                                                        <TableCell><Typography>Factor AxB</Typography></TableCell>
                                                        <TableCell><Typography>Y</Typography></TableCell>
                                                        <TableCell><Typography>Avg of Y</Typography></TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares of Y">
                                                                <Typography>SSY (in line)</Typography>
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
                                                        <TableCell><Typography>i</Typography></TableCell>
                                                        <TableCell><Typography>Provider</Typography></TableCell>
                                                        <TableCell><Typography>Concurrence</Typography></TableCell>
                                                        <TableCell><Typography>Provider x Concurrence</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography variant="subtitle1">Values</Typography></TableCell>
                                                                <TableCell><Typography variant="body1">{data.plan.effects.i.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography variant="body1">{data.plan.effects.a.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography variant="body1">{data.plan.effects.b.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography variant="body1">{data.plan.effects.ab.toFixed(4)}</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                        {(data && data.plan && data.plan.confidenceIntervals && data.plan.confidenceIntervals.map((row,idx)=>(
                                                            <TableRow key={idx}>
                                                                <TableCell><Typography variant="subtitle2">{`Confidence interval (${parseFloat(row.quantil)*100})%`}</Typography></TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.i.low < 0 && row.i.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography variant="body2" style={{color:(row.i.low < 0 && row.i.high > 0)?"#ff0000":""}}>{`( ${row.i.low.toFixed(2)}, ${row.i.high.toFixed(2)} )`}</Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.a.low < 0 && row.a.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography variant="body2" style={{color:(row.a.low < 0 && row.a.high > 0)?"#ff0000":""}}>{`( ${row.a.low.toFixed(2)}, ${row.a.high.toFixed(2)} )`}</Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.b.low < 0 && row.b.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography variant="body2" style={{color:(row.b.low < 0 && row.b.high > 0)?"#ff0000":""}}>{`( ${row.b.low.toFixed(2)}, ${row.b.high.toFixed(2)} )`}</Typography>
                                                                    </Tooltip>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Tooltip title={(row.ab.low < 0 && row.ab.high > 0)?"not statistically significant":"statistically significant"}>
                                                                        <Typography variant="body2" style={{color:(row.ab.low < 0 && row.ab.high > 0)?"#ff0000":""}}>{`( ${row.ab.low.toFixed(2)}, ${row.ab.high.toFixed(2)} )`}</Typography>
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
                                                                <Typography>SSE</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares of y">
                                                                <Typography>SSY</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Sum of squares total">
                                                                <Typography>SST</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Mean Square of Errors">
                                                                <Typography>MSE</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Degrees of Freedom">
                                                                <Typography>DoF</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Standard Deviation of Errors">
                                                                <Typography>Se</Typography>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Tooltip title="Standard Deviation of Effects">
                                                                <Typography>Sqi</Typography>
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
                                                            <TableCell><Typography>Provider</Typography></TableCell>
                                                            <TableCell><Typography>Concurrence</Typography></TableCell>
                                                            <TableCell><Typography>Provider x Concurrence</Typography></TableCell>
                                                            <TableCell><Typography>Error</Typography></TableCell>
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