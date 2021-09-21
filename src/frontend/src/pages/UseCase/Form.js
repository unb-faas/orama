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
  const navigate = useNavigate();
  const {id} = useParams()
  const operation = (id) ? "Update" : "Create"
  const [data, setData] = useState({
      id:null,
      name:null,
      acronym:null,
      active:0
  })

  const getData = () =>{
    api.get(`usecase/${id}`).then(res=>{
        setData(res.data)
    })
  }

  useEffect(() => {
    if (id){
        getData()
    }
  },[id]); 
  

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required('Name required').max(255, 'Too Long!'),
    acronym: Yup.string().required('Acronym required').max(10, 'Too Long!'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: data,
    validationSchema: RegisterSchema,
    onSubmit: (data) => {
        const payload = {
            name:data.name,
            acronym:data.acronym,
            active:data.active
        }
        if(data.id){
            api.put(`usecase/${data.id}`,payload).then(res=>{
                props.showMessageSuccess("Use Case updated!")
                navigate('/dashboard/usecases', { replace: true })
            })
        } else {
            api.post(`usecase`,payload).then(res=>{
                props.showMessageSuccess("Use Case created!")
                navigate('/dashboard/usecases')
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
                                        fullWidth
                                        autoComplete="name"
                                        type="string"
                                        label="Name"
                                        {...getFieldProps('name')}
                                        error={Boolean(touched.name && errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                        
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