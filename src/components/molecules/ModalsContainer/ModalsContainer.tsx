import React, { useState } from 'react';
import { Modal, Button } from '../../atoms';
import { NumberInputField } from '../NumberInputField';
import type { TrainingFormData } from '../../../types/training';

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

export { ConfirmDeleteModal, NewTrainingModal };
