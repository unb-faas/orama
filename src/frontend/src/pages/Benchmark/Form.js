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
  const [usecases, setUsecases] = useState([])
  const [activationUrls, setActivationUrls] = useState([])
  const [benchmark, setBenchmark] = useState({
      id:null,
      id_usecase:null,
      concurrences:null,
      repetitions:1,
      name:null,
      description:null,
      parameters:null,
      activiation_url:null,
      warm_up:0,
      seconds_between_repetitions:0,
  })

  const getUsecases = () =>{
    api.list('usecase').then(res=>{
        const urls = {}
        res.data.data.map(row => {
            activationUrls[row.id] = row.urls
            return row
        })
        setActivationUrls(activationUrls)
        console.log(activationUrls)
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
    if (id){
        getBenchmark(id)
    }
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    repetitions: Yup.number().min(1, 'Too Short').max(5000, 'Too Long!').required('Repetitions required'),
    id_usecase: Yup.number().required('Use case required'),
    concurrences: Yup.string().required('Concurrences required'),
    name: Yup.string().required('Name required').max(30,'Too Long'),
    description: Yup.string().max(255,'Too Long'),
    activation_url: Yup.string().required('Activation url required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: benchmark,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const concurrences_splited = data.concurrences.replace(/\s/g, '').split(",")
        const payload = {
            id_usecase:data.id_usecase,
            concurrences:{list:concurrences_splited},
            repetitions:data.repetitions,
            name:data.name,
            description:data.description,
            parameters:data.parameters,
            activation_url:data.activation_url,
            warm_up:data.warm_up,
            seconds_between_repetitions:data.seconds_between_repetitions
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
                                        fullWidth
                                        autoComplete="name"
                                        type="text"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="description"
                                        type="text"
                                        label="Description"
                                        {...getFieldProps('description')}
                                        error={Boolean(touched.description && errors.description)}
                                        helperText={touched.description && errors.description}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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

                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        select
                                        fullWidth
                                        autoComplete="activation_url"
                                        type="number"
                                        label="Activation URL"
                                        {...getFieldProps('activation_url')}
                                        error={Boolean(touched.activation_url && errors.activation_url)}
                                        helperText={touched.activation_url && errors.activation_url}
                                    >
                                        
                                        {(formik.values && formik.values.id_usecase && activationUrls && activationUrls[formik.values.id_usecase] && (
                                            Object.keys(activationUrls[formik.values.id_usecase]).map(provider=>(
                                                (activationUrls[formik.values.id_usecase][provider] && Object.keys(activationUrls[formik.values.id_usecase][provider]).map((urlType,idx)=>(
                                                    <MenuItem value={urlType} key={idx}>{urlType}</MenuItem> 
                                                )))
                                            )))
                                        )}
                                                  
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
                                   
                                    <TextField
                                        select
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="warm_up"
                                        type="string"
                                        label="Warm Up"
                                        {...getFieldProps('warm_up')}
                                        error={Boolean(touched.warm_up && errors.warm_up)}
                                        helperText={touched.warm_up && errors.warm_up}
                                    >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </TextField>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="seconds_between_repetitions"
                                        type="number"
                                        label="Secs between repetitions"
                                        {...getFieldProps('seconds_between_repetitions')}
                                        error={Boolean(touched.seconds_between_repetitions && errors.seconds_between_repetitions)}
                                        helperText={touched.seconds_between_repetitions && errors.seconds_between_repetitions}
                                    />
                                </Stack>

                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="parameters"
                                        type="text"
                                        label="Parameters (json)"
                                        {...getFieldProps('parameters')}
                                        error={Boolean(touched.parameters && errors.parameters)}
                                        helperText={touched.parameters && errors.parameters}
                                    />
                                </Stack>

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
export default withSnackbar(BenchmarkForm)