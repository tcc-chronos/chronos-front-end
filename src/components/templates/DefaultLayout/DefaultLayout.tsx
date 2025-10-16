import { Outlet } from 'react-router-dom';
import {
  Header,
  Sidebar,
  ToastContainer,
  ApiErrorInterceptor,
} from '../../organisms';
import { SidebarProvider } from '../../../contexts';

const DefaultLayout = () => {
  return (
    <SidebarProvider>
      <ApiErrorInterceptor />

      <div className='h-screen bg-gray-50 flex flex-col transition-all duration-500'>
        <Header />

        <div className='flex flex-1 min-h-0 overflow-hidden'>
          <Sidebar />

          <main className='flex-1 mx-auto py-6 sm:px-6 lg:px-8 overflow-y-auto'>
            <div className='px-4 py-6 sm:px-0'>
              <Outlet />
            </div>
          </main>
        </div>

        <ToastContainer />
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
