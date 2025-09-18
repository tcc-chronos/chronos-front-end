import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import InputNumber from '../Form/InputNumber';
import SelectInput from '../Form/SelectInput';
import Button from '../Form/Button';

export default function LayerForm({ onAddLayerRNN, onAddLayerDense }) {
  const typeOptions = [
    { value: 'RNN', label: 'RNN' },
    { value: 'Dense', label: 'Dense' },
  ];

  const [neurons, setNeurons] = useState('');
  const [type, setType] = useState('');

  const STORAGE_KEY_RNN = 'layer-list-rnn';
  const STORAGE_KEY_DENSE = 'layer-list-dense';

  const handleSubmit = e => {
    e.preventDefault();
    if (!e.target.reportValidity()) {
      return;
    }

    const newLayer = {
      id: uuidv4(),
      neurons: neurons,
      type,
    };

    let updatedRnnLayers =
      JSON.parse(sessionStorage.getItem(STORAGE_KEY_RNN)) || [];
    let updatedDenseLayers =
      JSON.parse(sessionStorage.getItem(STORAGE_KEY_DENSE)) || [];

    if (type === 'RNN') {
      updatedRnnLayers = [...updatedRnnLayers, newLayer];
      sessionStorage.setItem(STORAGE_KEY_RNN, JSON.stringify(updatedRnnLayers));
      onAddLayerRNN(updatedRnnLayers);
    } else if (type === 'Dense') {
      updatedDenseLayers = [...updatedDenseLayers, newLayer];
      sessionStorage.setItem(
        STORAGE_KEY_DENSE,
        JSON.stringify(updatedDenseLayers)
      );
      onAddLayerDense(updatedDenseLayers);
    }

    setNeurons('');
    setType('');
  };
  return (
    <form onSubmit={handleSubmit} className='max-w-md space-y-4 mb-6'>
      <InputNumber
        id='neurons'
        label='Neurônios:'
        value={neurons}
        onChange={e => setNeurons(e.target.value)}
        placeholder='0'
        required
        min={1}
      />
      <SelectInput
        id='typeRNN'
        label='Tipo da camada:'
        options={typeOptions}
        value={type}
        onChange={e => setType(e.target.value)}
        required
      />

      <Button text='Adicionar Camada' type='submit' />
    </form>
  );
}
