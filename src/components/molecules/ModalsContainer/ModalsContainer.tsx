import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
} from 'recharts';
import { Modal, Button } from '../../atoms';
import { NumberInputField } from '../NumberInputField';
import type {
  TrainingFormData,
  ModelTraining,
  TrainingHistory,
} from '../../../types/training';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Excluir',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size='sm'>
      <div className='space-y-4'>
        <p className='text-gray-600'>{message}</p>
        <div className='flex justify-end space-x-3 pt-4'>
          <Button variant='secondary' onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant='danger'
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface NewTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TrainingFormData) => void;
  modelName: string;
  isLoading?: boolean;
}

const NewTrainingModal: React.FC<NewTrainingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  modelName,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<TrainingFormData>({
    dataVolume: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.dataVolume || formData.dataVolume < 1) {
      newErrors.dataVolume = 'Volume de dados deve ser no mínimo 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({ dataVolume: 1 });
    setErrors({});
    onClose();
  };

  const handleDataVolumeChange = (value: number | undefined) => {
    const validValue = value || 1;
    setFormData(prev => ({ ...prev, dataVolume: validValue }));
    if (errors.dataVolume) {
      setErrors(prev => ({ ...prev, dataVolume: '' }));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Novo Treinamento - ${modelName}`}
      size='md'
    >
      <div className='space-y-6'>
        <p className='text-gray-600'>
          Configure os parâmetros para o novo treinamento do modelo.
        </p>

        <NumberInputField
          id='data-volume'
          label='Volume de dados'
          value={formData.dataVolume}
          onChange={handleDataVolumeChange}
          min={1}
          step={1}
          required
          error={errors.dataVolume}
          hint='Quantidade mínima de dados para o treinamento'
        />

        <div className='flex justify-end space-x-3 pt-4 border-t border-gray-200'>
          <Button
            variant='secondary'
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant='primary'
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Treinar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

interface TrainingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  training: ModelTraining | null;
}

const createChartData = (history: TrainingHistory | null | undefined) => {
  if (!history) return [];

  const maxLength = Math.max(history.loss.length, history.valLoss.length);

  return Array.from({ length: maxLength }, (_, index) => ({
    epoch: index + 1,
    loss: history.loss[index] ?? null,
    valLoss: history.valLoss[index] ?? null,
  }));
};

const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({
  isOpen,
  onClose,
  training,
}) => {
  const chartData = useMemo(
    () => createChartData(training?.trainingHistory),
    [training]
  );

  const hasHistory = chartData.length > 0;

  if (!training) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title='Detalhes do treinamento'
      size='xl'
      preventCloseOnOverlay={false}
    >
      <div className='space-y-6'>
        <div>
          <h3 className='text-sm font-semibold uppercase text-gray-500 tracking-wide'>
            Metadados do treinamento
          </h3>
          <div className='mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3'>
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <span className='text-xs text-gray-500 block'>
                Épocas configuradas
              </span>
              <span className='text-lg font-semibold text-gray-900'>
                {training.configuredEpochs ?? '—'}
              </span>
            </div>
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <span className='text-xs text-gray-500 block'>
                Épocas treinadas
              </span>
              <span className='text-lg font-semibold text-gray-900'>
                {training.trainingHistory?.epochsTrained ?? '—'}
              </span>
            </div>
            <div className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
              <span className='text-xs text-gray-500 block'>Melhor época</span>
              <span className='text-lg font-semibold text-gray-900'>
                {training.trainingHistory?.bestEpoch ?? '—'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className='text-sm font-semibold uppercase text-gray-500 tracking-wide mb-3'>
            Evolução das perdas
          </h3>
          <div className='bg-white border border-gray-200 rounded-lg p-4 h-[360px]'>
            {hasHistory ? (
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsLineChart data={chartData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='epoch' />
                  <YAxis tickFormatter={value => Number(value).toFixed(3)} />
                  <Tooltip
                    formatter={(rawValue, dataKey) => {
                      const label = dataKey === 'loss' ? 'Loss' : 'Val Loss';

                      if (rawValue === null || rawValue === undefined) {
                        return ['—', label];
                      }

                      const numericValue =
                        typeof rawValue === 'number'
                          ? rawValue
                          : Number(rawValue);

                      if (!Number.isFinite(numericValue)) {
                        return ['—', label];
                      }

                      return [numericValue.toFixed(4), label];
                    }}
                    labelFormatter={label => `Época ${label}`}
                  />
                  <Legend
                    formatter={value =>
                      value === 'loss' ? 'Loss' : 'Val Loss'
                    }
                  />
                  <Line
                    type='monotone'
                    dataKey='loss'
                    stroke='#2563eb'
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                  <Line
                    type='monotone'
                    dataKey='valLoss'
                    stroke='#16a34a'
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </RechartsLineChart>
              </ResponsiveContainer>
            ) : (
              <div className='h-full flex items-center justify-center text-gray-500 text-sm text-center px-6'>
                Gráfico indisponível. Este treinamento não possui histórico de
                loss/val_loss fornecido pelo serviço.
              </div>
            )}
          </div>
        </div>

        <div className='flex justify-end'>
          <Button variant='secondary' onClick={onClose}>
            Fechar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { ConfirmDeleteModal, NewTrainingModal, TrainingDetailsModal };
