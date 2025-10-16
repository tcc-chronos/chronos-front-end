import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DefaultLayout, Training, NotFound, DashboardPage } from './components';
import {
  NotificationProvider,
  PredictionProvider,
  PredictionPollingProvider,
} from './contexts';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <PredictionProvider>
        <PredictionPollingProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<DefaultLayout />}>
                <Route path='/' element={<Training />} />
                <Route path='/dashboard' element={<DashboardPage />} />
                <Route path='*' element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </PredictionPollingProvider>
      </PredictionProvider>
    </NotificationProvider>
  </StrictMode>
);
