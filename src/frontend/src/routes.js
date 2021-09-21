import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import DashboardApp from './pages/Dashboard/DashboardApp';
import Provider from './pages/Provider/Index';
import ProviderForm from './pages/Provider/Form';
import UseCases from './pages/UseCase/Index';
import UseCasesForm from './pages/UseCase/Form';
import Benchmarks from './pages/Benchmark/Index';
import BenchmarksForm from './pages/Benchmark/Form';
import BenchmarkExecutions from './pages/BenchmarkExecutions/BenchmarkExecutions';
import BenchmarkProject2kr from './pages/BenchmarkProject2kr/BenchmarkProject2kr';
import NotFound from './pages/Common/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        //  { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'providers', element: <Provider /> },
        { path: 'providers/create', element: <ProviderForm /> },
        { path: 'providers/:id', element: <ProviderForm /> },
        { path: 'benchmarks', element: <Benchmarks /> },
        { path: 'benchmarks/create', element: <BenchmarksForm /> },
        { path: 'benchmarks/:id', element: <BenchmarksForm /> },
        { path: 'benchmarks/executions/:id', element: <BenchmarkExecutions /> },
        { path: 'benchmarks/project2kr/:id', element: <BenchmarkProject2kr /> },
        { path: 'usecases/create', element: <UseCasesForm /> },
        { path: 'usecases/:id', element: <UseCasesForm /> },
        { path: 'usecases', element: <UseCases /> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
