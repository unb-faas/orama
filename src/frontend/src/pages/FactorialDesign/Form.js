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
        FormControlLabel
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

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
  const [benchmarksChecked, setBenchmarksChecked] = useState({})
  
  const getData = () =>{
    api.get(`factorialDesign/${id}`).then(res=>{
        setData(res.data)
        setState(res.data.benchmarks.list)
    })
  }

  const getDataBenchmarks = () =>{
    const params = {size:50}
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

  const handleCheckBenchmark = (benchmark) =>{
      if (data.benchmarks.list[benchmark.id]){
          delete data.benchmarks.list[benchmark.id]
          benchmarksChecked[benchmark.id] = false
      } else {
        data.benchmarks.list[benchmark.id] = benchmark
        benchmarksChecked[benchmark.id] = true
      }
      setData(data)
      setBenchmarksChecked(benchmarksChecked)
  }

  const [state, setState] = useState({});

  const handleChange = (event, id) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    if (id){
        getData()
    }
    getDataBenchmarks()
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name required').max(20, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            name:data.name,
            benchmarks:{list:state}
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
                                                                        <FormControlLabel
                                                                            control={
                                                                                <Switch checked={state[benchmark.id]} onChange={handleChange} name={benchmark.id} />
                                                                            }
                                                                            label={benchmark.name}
                                                                        />
                                                                    </CardContent>
                                                                </Card>
                                                            </Grid>
                                                        </Grid>
                                                    </ListItem>
                                                )))}
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