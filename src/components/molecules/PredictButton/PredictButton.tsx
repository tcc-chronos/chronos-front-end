import React from 'react';
import Button from '../../atoms/Button';
import { usePredictionSubmission } from '../../../hooks/usePredictionSubmission';
import type { PredictButtonProps } from './PredictButton.types';

/**
 * Reusable predict button component that handles prediction submission
 */
export const PredictButton: React.FC<PredictButtonProps> = ({
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  modelId,
  trainingId,
  onSuccess,
  isPolling = false,
  onTogglePolling,
}) => {
  const { submitPrediction, isLoading } = usePredictionSubmission();

  const isValid = Boolean(modelId && trainingId);

  const handleClick = async () => {
    // Se tem controle de polling, usar esse comportamento
    if (onTogglePolling) {
      onTogglePolling();
      return;
    }

    // Comportamento padrão (sem polling)
    if (!modelId || !trainingId) return;

    try {
      await submitPrediction(modelId, trainingId);
      onSuccess?.();
    } catch {
      // Error handling is done in the hook
    }
  };

  // Determinar o estilo do botão baseado no estado de polling
  const buttonVariant = isPolling ? 'danger' : variant;
  const buttonText = isPolling ? 'Parar' : isLoading ? 'Prevendo...' : 'Prever';

  return (
    <div className={`space-y-2 ${className}`}>
      <Button
        variant={buttonVariant}
        size={size}
        fullWidth={fullWidth}
        disabled={!isValid}
        isLoading={isLoading && !isPolling}
        onClick={handleClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default PredictButton;
