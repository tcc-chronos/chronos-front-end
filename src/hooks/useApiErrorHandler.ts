import { useCallback } from 'react';
import { useNotifications } from './useNotifications';

/**
 * Hook para capturar e exibir erros de API automaticamente
 */
export const useApiErrorHandler = () => {
  const { addError, addSuccess } = useNotifications();

  const handleApiError = useCallback(
    (error: unknown, customMessage?: string) => {
      let errorMessage = 'Erro inesperado';

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Extract more specific error messages if possible
      if (errorMessage.includes('HTTP error! status: 400')) {
        errorMessage = 'Dados inválidos enviados para o servidor';
      } else if (errorMessage.includes('HTTP error! status: 401')) {
        errorMessage = 'Acesso não autorizado';
      } else if (errorMessage.includes('HTTP error! status: 403')) {
        errorMessage = 'Você não tem permissão para esta ação';
      } else if (errorMessage.includes('HTTP error! status: 404')) {
        errorMessage = 'Recurso não encontrado';
      } else if (errorMessage.includes('HTTP error! status: 500')) {
        errorMessage = 'Erro interno do servidor';
      } else if (errorMessage.includes('Failed to fetch')) {
        errorMessage = 'Não foi possível conectar ao servidor';
      }

      addError(
        customMessage || 'Erro na operação',
        errorMessage,
        8000 // 8 seconds for errors
      );
    },
    [addError]
  );

  const handleApiSuccess = useCallback(
    (message: string, details?: string) => {
      addSuccess(message, details, 4000); // 4 seconds for success
    },
    [addSuccess]
  );

  return {
    handleApiError,
    handleApiSuccess,
  };
};

export default useApiErrorHandler;
