import { useContext } from 'react';
import {
  PageLifecycleContext,
  type PageLifecycleContextType,
} from '../contexts/PageLifecycleContext';

export const usePageLifecycle = (): PageLifecycleContextType => {
  const context = useContext(PageLifecycleContext);
  if (!context) {
    throw new Error(
      'usePageLifecycle must be used within a PageLifecycleProvider'
    );
  }
  return context;
};
