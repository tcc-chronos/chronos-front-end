import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  PageLifecycleContext,
  type PageLifecycleContextType,
} from './PageLifecycleContext';

interface PageLifecycleProviderProps {
  children: React.ReactNode;
}

export const PageLifecycleProvider: React.FC<PageLifecycleProviderProps> = ({
  children,
}) => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(location.pathname);

  useEffect(() => {
    setCurrentPage(location.pathname);
  }, [location.pathname]);

  const isPageActive = (page: string): boolean => {
    return currentPage === page;
  };

  const value: PageLifecycleContextType = {
    currentPage,
    isPageActive,
  };

  return (
    <PageLifecycleContext.Provider value={value}>
      {children}
    </PageLifecycleContext.Provider>
  );
};
