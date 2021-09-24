// material
import { Box, Grid, Container, Typography } from '@material-ui/core';
// components
import Page from '../../components/Page';
import {
  FactorialDesignCounter,
  UseCaseCounter,
  ProviderCounter,
  BenchmarkCounter,
  BenchmarkExecutionSeries,
} from '../../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
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

          <Grid item xs={12} md={6} lg={12}>
            <BenchmarkExecutionSeries />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
