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
        RadioGroup,
        Radio,
        FormControl,
        Select,
        InputLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

const moment = require('moment');  

// ----------------------------------------------------------------------

const FactorialDesignForm = (props)=> {
  const navigate = useNavigate();
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      name:null,
      acronym:null,
      active:0,
      benchmarks:{list:{}}
  })
  const [benchmarks, setBenchmarks] = useState([])
  const [benchmarkExecutions, setBenchmarkExecutions] = useState([])
  const [benchmarkExecutionsLower, setBenchmarkExecutionsLower] = useState([])
  const [benchmarkExecutionsUpper, setBenchmarkExecutionsUpper] = useState([])
  const [benchmarksChecked, setBenchmarksChecked] = useState({})

  const getData = () =>{
    api.get(`factorialDesign/${id}`).then(res=>{
        setData(res.data)
        setState(res.data.benchmarks.list)
        setStateExecutions(res.data.benchmarks.executions)
        setStateExecutionsLower(res.data.benchmarks.executionsLower)
        setStateExecutionsUpper(res.data.benchmarks.executionsUpper)
    })
  }

  const getDataBenchmarks = () =>{
    const params = {size:100}
    api.list(`benchmark`,'backend',params).then(res=>{
        setBenchmarks(res.data.data)
        const benchmarksChecked = res.data.data.map(benchmark=>{
            const ident = benchmark.id
            const check = benchmark[ident]
            return check
        })
        setBenchmarksChecked(benchmarksChecked)
    })
  }

  const getDataBenchmarksExecutions = () =>{
    const params = {size:100}
    api.list(`benchmarkExecution?removeResults=true`,'backend',params).then(res=>{
        const executions = {}
        const executionsLower = {}
        const executionsUpper = {}
        const temp = res.data.data.map(row=>{
            executions[row.id_benchmark] = []
            return row
        })
        const temp2 = res.data.data.map(row=>{
            executions[row.id_benchmark].push(row)
            executionsLower[row.id_benchmark] = (row.results && row.results.raw && Object.keys(row.results.raw[1]))
            executionsUpper[row.id_benchmark] = (row.results && row.results.raw && Object.keys(row.results.raw[1]))
            return row
        })
        setBenchmarkExecutions(executions)
        setBenchmarkExecutionsLower(executionsLower)
        setBenchmarkExecutionsUpper(executionsUpper)
    })
  }

  const [state, setState] = useState({});
  const [stateExecutions, setStateExecutions] = useState({});
  const [stateExecutionsLower, setStateExecutionsLower] = useState({});
  const [stateExecutionsUpper, setStateExecutionsUpper] = useState({});

  const handleChange = (event, id) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  
  const handleChangeExecutions = (event, id) => {
    setStateExecutions({
      ...stateExecutions,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeExecutionsLower = (event, id) => {
    setStateExecutionsLower({
      ...stateExecutionsLower,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeExecutionsUpper = (event, id) => {
    setStateExecutionsUpper({
      ...stateExecutionsUpper,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    if (id){
        getData()
    }
    getDataBenchmarksExecutions()
    getDataBenchmarks()
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name required').max(60, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            name:data.name,
            benchmarks:{
                list:state, 
                executions:stateExecutions,
                executionsLower:stateExecutionsLower,
                executionsUpper:stateExecutionsUpper
            }
        }
        if(data.id){
            api.put(`factorialDesign/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Factorial Design updated!")
                navigate('/dashboard/factorialDesigns', { replace: true })
            })
        } else {
            api.post(`factorialDesign`,payload).then(res=>{
                props.showMessageSuccess("Factorial Design created!")
                navigate('/dashboard/factorialDesigns')
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Factorial Design | Orama Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Factorial Design
                </Typography>
            </Stack>
            <Card>
                <CardContent>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="name"
                                        type="string"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Stack>

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
                                                <Typography variant="overline">Available Benchmarks</Typography>
                                            </Grid>
                                        </CardContent>
                                        <CardContent>
                                            <List>
                                                {(benchmarks.length && benchmarks.map((benchmark,idx) => (
                                                    <ListItem key={idx}>
                                                        <Grid container>
                                                            <Grid item xs={12}>
                                                                <Card>
                                                                    <CardContent>  
                                                                        <Grid container>
                                                                            <Grid item xs={3}>
                                                                                <Box m={1}>
                                                                                    <FormControlLabel
                                                                                        control={
                                                                                            <Switch checked={state[benchmark.id]} onChange={handleChange} name={benchmark.id} />
                                                                                        }
                                                                                        label={benchmark.name}
                                                                                        />
                                                                                </Box>
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                {(benchmarkExecutions)&&(
                                                                                    <Box m={1}>
                                                                                        <InputLabel id="select-execution-label">Execution</InputLabel>
                                                                                        <Select
                                                                                            InputLabelProps={{ shrink: true }} 
                                                                                            fullWidth
                                                                                            labelId="select-execution-label"
                                                                                            id="select-execution"
                                                                                            value={stateExecutions[benchmark.id]}
                                                                                            onChange={handleChangeExecutions}
                                                                                            name={benchmark.id}
                                                                                        >
                                                                                            {(benchmarkExecutions && benchmarkExecutions[benchmark.id] && benchmarkExecutions[benchmark.id].map(execution=>(
                                                                                                    <MenuItem value={execution.id}>{execution.id} - {moment(execution.date).format('YYYY-MM-DD HH:mm:ss')} ( R: {execution.results && execution.results.raw && Object.keys(execution.results.raw).length} / C: {execution.results && execution.results.raw && Object.keys(execution.results.raw[1]).join(", ")} )</MenuItem>
                                                                                            )))}
                                                                                        </Select>
                                                                                    </Box>
                                                                                )}
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                {(benchmarkExecutionsLower && stateExecutions[benchmark.id])&&(
                                                                                    <Box m={1}>
                                                                                        <InputLabel id="select-execution-lower">Lower</InputLabel>
                                                                                        <Select
                                                                                            InputLabelProps={{ shrink: true }} 
                                                                                            fullWidth
                                                                                            labelId="select-execution-lower"
                                                                                            id="select-execution-lower"
                                                                                            value={stateExecutionsLower[benchmark.id]}
                                                                                            onChange={handleChangeExecutionsLower}
                                                                                            name={benchmark.id}
                                                                                        >
                                                                                            {(benchmarkExecutionsLower && benchmarkExecutionsLower[benchmark.id] && benchmarkExecutionsLower[benchmark.id].map(option=>(
                                                                                                    <MenuItem value={option}>{option}</MenuItem>
                                                                                            )))}
                                                                                        </Select>
                                                                                    </Box>
                                                                                )}
                                                                            </Grid>
                                                                            <Grid item xs={3}>
                                                                                {(benchmarkExecutionsUpper && stateExecutions[benchmark.id])&&(
                                                                                    <Box m={1}>
                                                                                        <InputLabel id="select-execution-upper">Upper</InputLabel>
                                                                                        <Select
                                                                                            InputLabelProps={{ shrink: true }} 
                                                                                            fullWidth
                                                                                            labelId="select-execution-upper"
                                                                                            id="select-execution-upper"
                                                                                            value={stateExecutionsUpper[benchmark.id]}
                                                                                            onChange={handleChangeExecutionsUpper}
                                                                                            name={benchmark.id}
                                                                                        >
                                                                                            {(benchmarkExecutionsUpper && benchmarkExecutionsUpper[benchmark.id] && benchmarkExecutionsUpper[benchmark.id].map(option=>(
                                                                                                    <MenuItem value={option}>{option}</MenuItem>
                                                                                            )))}
                                                                                        </Select>
                                                                                    </Box>
                                                                                )}
                                                                            </Grid>
                                                                        </Grid>
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                )))}
                                                {!benchmarks.length && (
                                                    <ListItem>
                                                        <Typography>Loading...</Typography>
                                                    </ListItem>
                                                )}
                                            </List>
                                        </CardContent>
                                    </Card>
                                </Box>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <LoadingButton
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        loading={isSubmitting}
                                    >
                                        Save
                                    </LoadingButton>
                                </Stack>
                            </Stack>
                        </Form>
                    </FormikProvider>
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
export default withSnackbar(FactorialDesignForm)