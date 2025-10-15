import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  DefaultLayout,
  Training,
  NotFound,
  DashboardPage,
  Documentation,
} from './components';
import { NotificationProvider } from './contexts/NotificationProvider';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path='/' element={<Training />} />
            <Route path='/dashboard' element={<DashboardPage />} />
            <Route path='/documentation' element={<Documentation />} />
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </StrictMode>
);
