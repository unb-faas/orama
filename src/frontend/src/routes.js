import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';

import User from './pages/User';
import Provider from './pages/Providers';
import UseCases from './pages/UseCases';
import Benchmarks from './pages/Benchmark/Benchmarks';
import BenchmarkExecutions from './pages/BenchmarkExecutions/BenchmarkExecutions';
import BenchmarkProject2kr from './pages/BenchmarkProject2kr/BenchmarkProject2kr';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        //  { path: '/', element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'providers', element: <Provider /> },
        { path: 'benchmarks', element: <Benchmarks /> },
        { path: 'benchmarks/executions/:id', element: <BenchmarkExecutions /> },
        { path: 'benchmarks/project2kr/:id', element: <BenchmarkProject2kr /> },
        { path: 'usecases', element: <UseCases /> },
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },

    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
