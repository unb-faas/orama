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

const UseCaseForm = (props)=> {
  const [control, setControl] = useState(true)
  const navigate = useNavigate()
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      name:null,
      acronym:null,
      active:0,
      id_provider:null,
      provisionable:null,
      urls:null,
  })
  const [providers, setProviders] = useState([])


  const getProviders = () =>{
    const params = {size:100,active:1}
    api.list('provider','backend',params).then(res=>{
        setProviders(res.data.data)
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  const getData = () =>{
    api.get(`usecase/${id}`).then(res=>{
        res.data.urls = (res.data.urls) ? JSON.stringify(res.data.urls) : null 
        setData(res.data)
    }).catch(e=>{
        props.showMessageError(`Request failed ${e}`)
      })
  }

  useEffect(() => {
    getProviders()
    if (id){
        getData()
    }
  },[control]); 
  
  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name required').max(255, 'Too Long!'),
    acronym: Yup.string().required('Acronym required').max(20, 'Too Long!'),
    id_provider: Yup.number().required('Provider required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            name:data.name,
            acronym:data.acronym,
            active:data.active,
            id_provider:data.id_provider,
            provisionable:data.provisionable,
            urls:JSON.parse(data.urls)
        }
        if(data.id){
            api.put(`usecase/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Use Case updated!")
                navigate('/dashboard/usecases', { replace: true })
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        } else {
            api.post(`usecase`,payload).then(res=>{
                props.showMessageSuccess("Use Case created!")
                navigate('/dashboard/usecases')
            }).catch(err=>{
                props.showMessageError(`Error: ${err}`)
            })
        }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Page title="Form Use Case | Orama Framework">
        <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                {operation} Use Case
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
                                        fullWidth
                                        autoComplete="name"
                                        type="string"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Stack>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        
                                    <TextField
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="acronym"
                                        type="string"
                                        label="Acronym"
                                        {...getFieldProps('acronym')}
                                        error={Boolean(touched.acronym && errors.acronym)}
                                        helperText={touched.acronym && errors.acronym}
                                    />

                                    <TextField
                                        select
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="provisionable"
                                        type="string"
                                        label="Provisionable"
                                        {...getFieldProps('provisionable')}
                                        error={Boolean(touched.provisionable && errors.provisionable)}
                                        helperText={touched.provisionable && errors.provisionable}
                                    >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </TextField>

                                    <TextField
                                        select
                                        InputLabelProps={{ shrink: true }} 
                                        fullWidth
                                        autoComplete="active"
                                        type="string"
                                        label="Active"
                                        {...getFieldProps('active')}
                                        error={Boolean(touched.active && errors.active)}
                                        helperText={touched.active && errors.active}
                                    >
                                        <MenuItem value="1">Yes</MenuItem>
                                        <MenuItem value="0">No</MenuItem>
                                    </TextField>
                                </Stack>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    
                                    {((parseInt(data.provisionable,10) === 0 && parseInt(formik.values.provisionable,10) === 0) || parseInt(formik.values.provisionable,10) === 0)&&(
                                        <TextField
                                            InputLabelProps={{ shrink: true }} 
                                            fullWidth
                                            autoComplete="urls"
                                            type="string"
                                            label="Urls (json)"
                                            {...getFieldProps('urls')}
                                            error={Boolean(touched.urls && errors.urls)}
                                            helperText={touched.urls && errors.urls}
                                        />
                                    )}
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
export default withSnackbar(UseCaseForm)