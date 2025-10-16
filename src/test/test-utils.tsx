/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../contexts/NotificationProvider';
import { SidebarProvider } from '../contexts/SidebarProvider';
import { PredictionProvider } from '../contexts/PredictionProvider';
import { PredictionPollingProvider } from '../contexts/PredictionPollingProvider';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <SidebarProvider>
          <PredictionProvider>
            <PredictionPollingProvider>{children}</PredictionPollingProvider>
          </PredictionProvider>
        </SidebarProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
