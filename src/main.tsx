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
import {
  NotificationProvider,
  PredictionProvider,
  PredictionPollingProvider,
  PageLifecycleProvider,
} from './contexts';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <PageLifecycleProvider>
        <NotificationProvider>
          <PredictionProvider>
            <PredictionPollingProvider>
              <Routes>
                <Route element={<DefaultLayout />}>
                  <Route path='/' element={<Training />} />
                  <Route path='/dashboard' element={<DashboardPage />} />
                  <Route path='*' element={<NotFound />} />
                </Route>
              </Routes>
            </PredictionPollingProvider>
          </PredictionProvider>
        </NotificationProvider>
      </PageLifecycleProvider>
    </BrowserRouter>
  </StrictMode>
);
