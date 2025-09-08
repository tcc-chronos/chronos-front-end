import type { RouteObject } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];
