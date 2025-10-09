import React from 'react';
import Button from '../../atoms/Button';
import { useTrainingSubmission } from '../../../hooks/useTrainingSubmission';
import { useModelsRefresh } from '../../../hooks/useModelsRefresh';
import type { TrainingButtonProps } from './TrainingButton.types';

/**
 * Reusable training button component that handles validation and submission
 */
export const TrainingButton: React.FC<TrainingButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  onSuccess,
}) => {
  const { isSubmitting, error, submitTraining, isValid } =
    useTrainingSubmission();
  const { refreshModels } = useModelsRefresh();

  const handleClick = () => {
    const handleSuccess = () => {
      refreshModels();
      onSuccess?.();
    };
    submitTraining(handleSuccess);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={!isValid || isSubmitting}
        isLoading={isSubmitting}
        onClick={handleClick}
      >
        {isSubmitting ? 'Criando Modelo...' : 'Criar Modelo'}
      </Button>

      {error && (
        <div className='text-sm text-red-600 bg-red-50 p-2 rounded-md'>
          {error}
        </div>
      )}
    </div>
  );
};

export default TrainingButton;
