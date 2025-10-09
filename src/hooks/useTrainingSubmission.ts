import { useState } from 'react';
import { ModelsService } from '../services/models';
import {
  useTrainingSidebarStore,
  type CreateModelPayload,
} from '../store/trainingSidebarStore';
import { useApiErrorHandler } from './useApiErrorHandler';

interface UseTrainingSubmissionReturn {
  isSubmitting: boolean;
  error: string | null;
  submitTraining: (onSuccess?: () => void) => Promise<void>;
  isValid: boolean;
}

/**
 * Custom hook for managing training submission
 */
export const useTrainingSubmission = (): UseTrainingSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isValid, getCreateModelPayload } = useTrainingSidebarStore();
  const { handleApiError, handleApiSuccess } = useApiErrorHandler();

  const submitTraining = async (onSuccess?: () => void): Promise<void> => {
    if (!isValid()) {
      const validationError =
        'Por favor, preencha todos os campos obrigatórios.';
      setError(validationError);
      handleApiError(new Error(validationError), 'Validação de formulário');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateModelPayload = getCreateModelPayload();

      console.log('Creating model with payload:', payload);
      console.log('Payload JSON:', JSON.stringify(payload, null, 2));

      const createdModel = await ModelsService.createModel(payload);

      console.log('Model created successfully:', createdModel);

      // Show success notification
      handleApiSuccess(
        'Modelo criado com sucesso!',
        'O treinamento foi iniciado e você pode acompanhar o progresso.'
      );

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Reset form or navigate - this could be enhanced
      // You might want to emit an event or call a callback here
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Erro ao criar modelo';
      setError(errorMessage);
      handleApiError(err, 'Criação de modelo');
      console.error('Error creating model:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    submitTraining,
    isValid,
  };
};

export default useTrainingSubmission;
