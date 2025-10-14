import { useCallback, useMemo } from 'react';
import { useNotifications } from './useNotifications';

const ERROR_MESSAGES = {
  400: 'Dados inválidos enviados para o servidor',
  401: 'Acesso não autorizado',
  403: 'Você não tem permissão para esta ação',
  404: 'Recurso não encontrado',
  500: 'Erro interno do servidor',
  FETCH_FAILED: 'Não foi possível conectar ao servidor',
  DEFAULT: 'Erro inesperado',
} as const;

const NOTIFICATION_DURATIONS = {
  ERROR: 8000,
  SUCCESS: 4000,
} as const;

export const useApiErrorHandler = () => {
  const { addError, addSuccess } = useNotifications();

  const getErrorMessage = useMemo(() => {
    return (error: unknown): string => {
      let errorMessage: string = ERROR_MESSAGES.DEFAULT;

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      if (errorMessage.includes('HTTP error! status: 400')) {
        return ERROR_MESSAGES[400];
      } else if (errorMessage.includes('HTTP error! status: 401')) {
        return ERROR_MESSAGES[401];
      } else if (errorMessage.includes('HTTP error! status: 403')) {
        return ERROR_MESSAGES[403];
      } else if (errorMessage.includes('HTTP error! status: 404')) {
        return ERROR_MESSAGES[404];
      } else if (errorMessage.includes('HTTP error! status: 500')) {
        return ERROR_MESSAGES[500];
      } else if (errorMessage.includes('Failed to fetch')) {
        return ERROR_MESSAGES.FETCH_FAILED;
      }

      return errorMessage;
    };
  }, []);

  const handleApiError = useCallback(
    (error: unknown, customMessage?: string) => {
      const errorMessage = getErrorMessage(error);

      addError(
        customMessage || 'Erro na operação',
        errorMessage,
        NOTIFICATION_DURATIONS.ERROR
      );
    },
    [addError, getErrorMessage]
  );

  const handleApiSuccess = useCallback(
    (message: string, details?: string) => {
      addSuccess(message, details, NOTIFICATION_DURATIONS.SUCCESS);
    },
    [addSuccess]
  );

  return {
    handleApiError,
    handleApiSuccess,
  };
};

export default useApiErrorHandler;
