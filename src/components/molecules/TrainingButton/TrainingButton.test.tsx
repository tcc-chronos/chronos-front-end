import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrainingButton from './TrainingButton';
import * as useTrainingSubmissionModule from '../../../hooks/useTrainingSubmission';
import * as useModelsRefreshModule from '../../../hooks/useModelsRefresh';

vi.mock('../../../hooks/useTrainingSubmission');
vi.mock('../../../hooks/useModelsRefresh');

describe('TrainingButton', () => {
  const mockSubmitTraining = vi.fn();
  const mockRefreshModels = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(
      useTrainingSubmissionModule,
      'useTrainingSubmission'
    ).mockReturnValue({
      isSubmitting: false,
      submitTraining: mockSubmitTraining,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isValid: true,
      error: null,
    });

    vi.spyOn(useModelsRefreshModule, 'useModelsRefresh').mockReturnValue({
      refreshModels: mockRefreshModels,
    });
  });

  it('renders button with default text', () => {
    render(<TrainingButton />);
    expect(screen.getByText('Criar Modelo')).toBeInTheDocument();
  });

  it('renders button with loading text when submitting', () => {
    vi.spyOn(
      useTrainingSubmissionModule,
      'useTrainingSubmission'
    ).mockReturnValue({
      isSubmitting: true,
      submitTraining: mockSubmitTraining,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isValid: true,
      error: null,
    });

    render(<TrainingButton />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('button is disabled when isValid is false', () => {
    vi.spyOn(
      useTrainingSubmissionModule,
      'useTrainingSubmission'
    ).mockReturnValue({
      isSubmitting: false,
      submitTraining: mockSubmitTraining,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isValid: false,
      error: null,
    });

    render(<TrainingButton />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('button is disabled when isSubmitting is true', () => {
    vi.spyOn(
      useTrainingSubmissionModule,
      'useTrainingSubmission'
    ).mockReturnValue({
      isSubmitting: true,
      submitTraining: mockSubmitTraining,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      isValid: true,
      error: null,
    });

    render(<TrainingButton />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls submitTraining when clicked', () => {
    render(<TrainingButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockSubmitTraining).toHaveBeenCalledTimes(1);
    expect(mockSubmitTraining).toHaveBeenCalledWith(expect.any(Function));
  });

  it('calls refreshModels on success', () => {
    mockSubmitTraining.mockImplementation(callback => {
      callback();
    });

    render(<TrainingButton />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockRefreshModels).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess callback when provided', () => {
    mockSubmitTraining.mockImplementation(callback => {
      callback();
    });

    render(<TrainingButton onSuccess={mockOnSuccess} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnSuccess).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    const { container } = render(<TrainingButton className='custom-class' />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('applies variant prop to button', () => {
    render(<TrainingButton variant='secondary' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-functional-heavy-medium');
  });

  it('applies size prop to button', () => {
    render(<TrainingButton size='lg' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base');
  });

  it('applies fullWidth prop to button', () => {
    render(<TrainingButton fullWidth={true} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('shows loading state in button', () => {
    vi.spyOn(
      useTrainingSubmissionModule,
      'useTrainingSubmission'
    ).mockReturnValue({
      isSubmitting: true,
      submitTraining: mockSubmitTraining,
      isValid: () => true,
      error: null,
    });

    const { container } = render(<TrainingButton />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});
