// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import { useState, useEffect } from 'react';
import Page from '../../components/Page';
import {
  FactorialDesignCounter,
  UseCaseCounter,
  ProviderCounter,
  BenchmarkCounter,
  BenchmarkExecutionSeries,
  RequestsPerProvider,
  RequestsPerUseCase
} from '../../components/_dashboard/app';

import { api } from '../../services';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [control, setControl] = useState(0);
  const [requestCounter, setRequestCounter] = useState({});

  const getRequestCounter = () =>{
    const params = {size:100}
    api.list('benchmarkExecution/requestCounter','backend',params).then(res=>{
      setRequestCounter(res.data)
    })
  }

  useEffect(() => {
    getRequestCounter()
  },[control]);
  return (
    <Page title="Dashboard | Orama Framework">
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <BenchmarkCounter />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <ProviderCounter />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <UseCaseCounter />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FactorialDesignCounter />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <BenchmarkExecutionSeries />
          </Grid>
          
          <Grid item xs={12} md={6} lg={6}>
            <RequestsPerProvider requestCounter={requestCounter} />
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <RequestsPerUseCase requestCounter={requestCounter} />
          </Grid>

        </Grid>
      </Container>
    </Page>
  );
}
