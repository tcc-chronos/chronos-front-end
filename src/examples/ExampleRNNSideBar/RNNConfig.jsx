import { useState, useEffect } from 'react';
import SortableList from '../Form/SortableList';
import LayerForm from './LayerForm';
import { v4 as uuidv4 } from 'uuid';

const RNNConfig = ({ setRnnUnits, setDenseUnits }) => {
  const [layersRNN, setLayersRNN] = useState(() => {
    const stored = sessionStorage.getItem('layer-list-rnn');
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: uuidv4(),
            neurons: 128,
            type: 'RNN',
          },
        ];
  });

  const [layersDense, setLayersDense] = useState(() => {
    const stored = sessionStorage.getItem('layer-list-dense');
    return stored
      ? JSON.parse(stored)
      : [
          {
            id: uuidv4(),
            neurons: 64,
            type: 'Dense',
          },
        ];
  });

  // Atualiza estado local e sessionStorage, e propaga para Dashboard
  const updateLayersRNN = newLayers => {
    setLayersRNN(newLayers);
    sessionStorage.setItem('layer-list-rnn', JSON.stringify(newLayers));
    // Extrai só array de neurons para Dashboard (exemplo)
    const neuronsArray = newLayers.map(layer => layer.neurons);
    setRnnUnits(neuronsArray);
  };

  const updateLayersDense = newLayers => {
    setLayersDense(newLayers);
    sessionStorage.setItem('layer-list-dense', JSON.stringify(newLayers));
    // Extrai só array de neurons para Dashboard (exemplo)
    const neuronsArray = newLayers.map(layer => layer.neurons);
    setDenseUnits(neuronsArray);
  };

  useEffect(() => {
    updateLayersRNN(layersRNN);
  }, []);

  useEffect(() => {
    updateLayersDense(layersDense);
  }, []);

  return (
    <div className='py-6'>
      <h1 className='pb-2 text-lg font-bold mb-4'>Configuração de RNN</h1>

      <LayerForm
        onAddLayerRNN={updatedLayers => updateLayersRNN(updatedLayers)}
        onAddLayerDense={updatedLayers => updateLayersDense(updatedLayers)}
      />
      <SortableList
        layersRNN={layersRNN}
        layersDense={layersDense}
        onOrderChangeRNN={novaLista => updateLayersRNN(novaLista)}
        onOrderChangeDense={novaLista => updateLayersDense(novaLista)}
      />
    </div>
  );
};

export default RNNConfig;
