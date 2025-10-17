import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '../../../test/test-utils';
import PredictButton from './PredictButton';
import { ModelsService } from '../../../services/models';
import type { PredictionResponse } from '../../../types/prediction';

vi.mock('../../../services/models');
vi.mock('../../../hooks/useNotifications', () => ({
  useNotifications: () => ({
    addNotification: vi.fn(),
  }),
}));

describe('PredictButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders predict button', () => {
    render(<PredictButton />);
    expect(screen.getByText('Prever')).toBeInTheDocument();
  });

  it('disables button when modelId or trainingId is missing', () => {
    render(<PredictButton modelId='model-1' />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('enables button when both modelId and trainingId are provided', () => {
    render(<PredictButton modelId='model-1' trainingId='training-1' />);
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('calls predict service on click', async () => {
    const mockPredict = vi
      .spyOn(ModelsService, 'predict')
      .mockResolvedValue({} as PredictionResponse);

    render(<PredictButton modelId='model-1' trainingId='training-1' />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockPredict).toHaveBeenCalledWith('model-1', 'training-1');
    });
  });

  it('shows loading state during submission', async () => {
    vi.spyOn(ModelsService, 'predict').mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<PredictButton modelId='model-1' trainingId='training-1' />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});
