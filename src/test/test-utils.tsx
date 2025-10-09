/* eslint-disable react-refresh/only-export-components */
import { render } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import type { RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from '../hooks/NotificationProvider';
import { SidebarProvider } from '../hooks/SidebarProvider';

const AllTheProviders = ({ children }: { children: ReactNode }) => {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <SidebarProvider>{children}</SidebarProvider>
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
