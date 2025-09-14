import React, { useState } from 'react';
import { NumberInputField } from '../components/molecules';

const NumberInputExample: React.FC = () => {
  const [price, setPrice] = useState<number | undefined>(100.5);
  const [quantity, setQuantity] = useState<number | undefined>(1);
  const [percentage, setPercentage] = useState<number | undefined>();

  const [errors, setErrors] = useState<{
    price?: string;
    quantity?: string;
    percentage?: string;
  }>({});

  const validatePrice = (value: number | undefined) => {
    if (value === undefined) {
      setErrors(prev => ({ ...prev, price: 'Preço é obrigatório' }));
      return;
    }
    if (value < 0) {
      setErrors(prev => ({ ...prev, price: 'Preço deve ser positivo' }));
      return;
    }
    if (value > 10000) {
      setErrors(prev => ({
        ...prev,
        price: 'Preço não pode exceder R$ 10.000',
      }));
      return;
    }
    setErrors(prev => ({ ...prev, price: undefined }));
  };

  const validateQuantity = (value: number | undefined) => {
    if (value === undefined) {
      setErrors(prev => ({ ...prev, quantity: 'Quantidade é obrigatória' }));
      return;
    }
    if (value < 1) {
      setErrors(prev => ({
        ...prev,
        quantity: 'Quantidade deve ser pelo menos 1',
      }));
      return;
    }
    if (value > 999) {
      setErrors(prev => ({
        ...prev,
        quantity: 'Quantidade não pode exceder 999',
      }));
      return;
    }
    setErrors(prev => ({ ...prev, quantity: undefined }));
  };

  const validatePercentage = (value: number | undefined) => {
    if (value !== undefined && (value < 0 || value > 100)) {
      setErrors(prev => ({
        ...prev,
        percentage: 'Percentual deve estar entre 0 e 100',
      }));
      return;
    }
    setErrors(prev => ({ ...prev, percentage: undefined }));
  };

  const handlePriceChange = (value: number | undefined) => {
    setPrice(value);
    validatePrice(value);
  };

  const handleQuantityChange = (value: number | undefined) => {
    setQuantity(value);
    validateQuantity(value);
  };

  const handlePercentageChange = (value: number | undefined) => {
    setPercentage(value);
    validatePercentage(value);
  };

  const total = price && quantity ? price * quantity : 0;

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6'>
      <h2 className='text-2xl font-bold text-gray-900 mb-6'>
        Exemplo de NumberInputField
      </h2>

      <NumberInputField
        id='price'
        label='Preço unitário'
        value={price}
        onChange={handlePriceChange}
        min={0}
        max={10000}
        decimalPlaces={2}
        placeholder='0,00'
        error={errors.price}
        infoTooltip='Digite o preço unitário do produto em reais. Deve ser um valor positivo.'
        required
      />

      <NumberInputField
        id='quantity'
        label='Quantidade'
        value={quantity}
        onChange={handleQuantityChange}
        min={1}
        max={999}
        decimalPlaces={0}
        placeholder='1'
        error={errors.quantity}
        hint='Número de itens (mínimo 1, máximo 999)'
        required
      />

      <NumberInputField
        id='percentage'
        label='Desconto (%)'
        value={percentage}
        onChange={handlePercentageChange}
        min={0}
        max={100}
        decimalPlaces={1}
        placeholder='0,0'
        error={errors.percentage}
        infoTooltip='Percentual de desconto aplicado ao produto (0-100%)'
      />

      {/* Resultado */}
      <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
        <p className='text-sm text-gray-600'>
          <strong>Valores atuais:</strong>
        </p>
        <p className='text-sm'>Preço: R$ {price?.toFixed(2) || '0,00'}</p>
        <p className='text-sm'>Quantidade: {quantity || 0}</p>
        <p className='text-sm'>Desconto: {percentage || 0}%</p>
        <p className='text-lg font-bold text-gray-900 mt-2'>
          Total: R$ {total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default NumberInputExample;
