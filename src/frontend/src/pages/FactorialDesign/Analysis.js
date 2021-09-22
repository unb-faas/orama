import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';
import arrowRightOutlined from '@iconify/icons-ant-design/arrow-right-outlined';// material
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
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

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

  const columnsFactors = [
    {
      field: 'factor',
      headerName: 'Factor',
      width: 150,
      editable: false,
    },
    {
      field: 'low',
      headerName: 'Low level',
      editable: false,
    },
    {
      field: 'high',
      headerName: 'High level',
      editable: false,
    },
  ];

  return (
    <Page title="Factorial Design Analysis | Orama Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                    Factorial Design Analysis
                </Typography>
            </Stack>
            <Card>
                <CardContent>
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
                                        <Typography variant="h6">Name</Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="h5">{data.name}</Typography> 
                                    </Grid>
                                </Grid>   
                            </Grid> 
                            
                        </CardContent>
                    </Card>
                    
                        {(data && data.validate && !data.validate.result ? (
                            <Stack>
                                <Stack>
                                    <Typography variant="overline">Error: </Typography><Typography variant="caption">{data.validate.message}</Typography>
                                </Stack>
                            </Stack>
                        )
                        :
                        (
                            <Box mt={3}>
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
                                                        <TableCell><Typography>Error</Typography></TableCell>
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
                                                            <TableCell><Typography>{data.plan.matrix[row].avgy.toFixed(2)}</Typography></TableCell>
                                                            <TableCell><Typography>{data.plan.matrix[row].error.toFixed(2)}</Typography></TableCell>
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
                                                                <TableCell><Typography>{data.plan.effects.i}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.a}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.b}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.effects.ab}</Typography></TableCell>
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
                                                    <Typography variant="h5">Scores</Typography>
                                                </Grid>   
                                            </Grid> 
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><Typography>SSE</Typography></TableCell>
                                                        <TableCell><Typography>SSY</Typography></TableCell>
                                                        <TableCell><Typography>SST</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography>{data.plan.sse}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.ssy}</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.sst}</Typography></TableCell>
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
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell><Typography>A</Typography></TableCell>
                                                        <TableCell><Typography>B</Typography></TableCell>
                                                        <TableCell><Typography>AB</Typography></TableCell>
                                                        <TableCell><Typography>Error</Typography></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                        {(data && data.plan &&
                                                            <TableRow>
                                                                <TableCell><Typography>{data.plan.fractions.a}%</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.fractions.b}%</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.fractions.ab}%</Typography></TableCell>
                                                                <TableCell><Typography>{data.plan.fractions.error}%</Typography></TableCell>
                                                            </TableRow>
                                                        )}
                                                </TableBody>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </Box>

                                

                            </Box>
                        ))}
                </CardContent>
            </Card>
    
            <Box mt={3}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to=".."
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