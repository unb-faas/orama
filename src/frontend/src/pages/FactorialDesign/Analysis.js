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
import { RepetitionAvgChart, ConcurrenceAvgChart } from './charts';

// ----------------------------------------------------------------------



const CHART_HEIGHT = 350;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible'
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`
  }
}));

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
  const [chart, setChart] = useState([0,0,0,0])
  const getData = () =>{
    api.get(`factorialDesign/${id}/analysis`).then(res=>{
        setData(res.data)
        setChart([
                  res.data.plan.fractions.a,
                  res.data.plan.fractions.b,
                  res.data.plan.fractions.ab,
                  res.data.plan.fractions.error
                ])
    })
  }

  const CHART_DATA = [4344, 5435, 1443, 4443];


  useEffect(() => {
    if (id){
        getData()
    }
  },[id]);

  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.warning.main,
      theme.palette.error.main
    ],
    labels: ['Provider', 'Concurrence', 'Provider x Concurrence', 'Error'],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => `#${seriesName}`
        }
      }
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } }
    }
  });

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
                                                        <TableCell><Typography>i</Typography></TableCell>
                                                        <TableCell><Typography>A</Typography></TableCell>
                                                        <TableCell><Typography>B</Typography></TableCell>
                                                        <TableCell><Typography>AB</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography>{data.plan.effects.i.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.a.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.b.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.ab.toFixed(4)}</Typography></TableCell>
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
                                                    <Typography variant="h5">Sums</Typography>
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
                                                            <Tooltip title="Sum of squares total">
                                                                <TableCell><Typography>SST</Typography></TableCell>
                                                            </Tooltip>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography>{data.plan.sse.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.ssy.toFixed(4)}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.sst.toFixed(4)}</Typography></TableCell>
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
                                                <ChartWrapperStyle dir="ltr">
                                                    <ReactApexChart type="pie" series={chart} options={chartOptions} height={250} />
                                                </ChartWrapperStyle>
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