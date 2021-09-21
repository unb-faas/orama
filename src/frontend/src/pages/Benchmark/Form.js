import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useFormik, Form, FormikProvider } from 'formik';
import arrowBackOutline from '@iconify/icons-eva/arrow-back-outline';
import { useNavigate, useParams, Link as RouterLink } from 'react-router-dom';

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
        Box
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import Page from '../../components/Page';
import {api} from '../../services';
import { withSnackbar } from '../../hooks/withSnackbar';

// ----------------------------------------------------------------------

const BenchmarkForm = (props)=> {
  const navigate = useNavigate();
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [providers, setProviders] = useState([])
  const [usecases, setUsecases] = useState([])
  const [benchmark, setBenchmark] = useState({
      id:null,
      id_provider:null,
      id_usecase:null,
      concurrences:null,
      repetitions:1
  })

  const getProviders = () =>{
    api.list('provider').then(res=>{
        setProviders(res.data.data)
    })
  }

  const getUsecases = () =>{
    api.list('usecase').then(res=>{
        setUsecases(res.data.data)
    })
  }

  const getBenchmark = (id) =>{
    api.get(`benchmark/${id}`).then(res=>{
        const conc = res.data.concurrences.list.join(", ")
        res.data.concurrences = conc
        setBenchmark(res.data)
    })
  }

  useEffect(() => {
    getUsecases()
    getProviders()
    if (id){
        getBenchmark(id)
    }
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    repetitions: Yup.number().min(1, 'Too Short').max(5000, 'Too Long!').required('Repetitions required'),
    id_provider: Yup.number().required('Provider required'),
    id_usecase: Yup.number().required('Use case required'),
    concurrences: Yup.string().required('Concurrences required'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: benchmark,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const concurrences_splited = data.concurrences.split(",")
        const payload = {
            id_provider:data.id_provider,
            id_usecase:data.id_usecase,
            concurrences:{list:concurrences_splited},
            repetitions:data.repetitions,
        }
        if(data.id){
            api.put(`benchmark/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Benchmark updated!")
                navigate('/dashboard/benchmarks', { replace: true })
            })
        } else {
            api.post(`benchmark`,payload).then(res=>{
                props.showMessageSuccess("Benchmark created!")
                navigate('/dashboard/benchmarks')
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Benchmarks | Orama Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Benchmark
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
                                        select
                                        fullWidth
                                        autoComplete="id_provider"
                                        type="number"
                                        label="Provider"
                                        {...getFieldProps('id_provider')}
                                        error={Boolean(touched.id_provider && errors.id_provider)}
                                        helperText={touched.id_provider && errors.id_provider}
                                    >
                                        {(providers.map((provider,idx)=>(
                                            <MenuItem value={provider.id} key={idx}>{provider.name}</MenuItem>  
                                        )))}
                                        
                                    </TextField>

                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        select
                                        fullWidth
                                        autoComplete="id_usecase"
                                        type="number"
                                        label="Use Case"
                                        {...getFieldProps('id_usecase')}
                                        error={Boolean(touched.id_usecase && errors.id_usecase)}
                                        helperText={touched.id_usecase && errors.id_usecase}
                                    >
                                        {(usecases.map((usecase,idx)=>(
                                            <MenuItem value={usecase.id} key={idx}>{usecase.name}</MenuItem>  
                                        )))}    
                                    </TextField>
                                </Stack>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="concurrences"
                                        type="text"
                                        label="Concurrences"
                                        {...getFieldProps('concurrences')}
                                        error={Boolean(touched.concurrences && errors.concurrences)}
                                        helperText={touched.concurrences && errors.concurrences}
                                    />
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="repetitions"
                                        type="number"
                                        label="Repetitions"
                                        {...getFieldProps('repetitions')}
                                        error={Boolean(touched.repetitions && errors.repetitions)}
                                        helperText={touched.repetitions && errors.repetitions}
                                    />
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
export default withSnackbar(BenchmarkForm)