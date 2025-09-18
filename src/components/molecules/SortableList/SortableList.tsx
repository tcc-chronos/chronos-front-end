import React, { useEffect, useRef } from 'react';
import Sortable from 'sortablejs';
import { GripVertical, X } from 'lucide-react';
import { IconButton } from '../../atoms';
import type { SortableListProps, Layer } from './SortableList.types';

const SortableList: React.FC<SortableListProps> = ({
  layersRNN,
  layersDense,
  onOrderChangeRNN,
  onOrderChangeDense,
  onRemoveLayer,
  className = '',
}) => {
  const rnnListRef = useRef<HTMLUListElement>(null);
  const denseListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (rnnListRef.current) {
      const sortable = Sortable.create(rnnListRef.current, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: () => {
          if (!rnnListRef.current) return;

          const newOrderIds = Array.from(rnnListRef.current.children).map(
            el => (el as HTMLElement).dataset.id
          );

          const reordered = newOrderIds
            .map(id => layersRNN.find(layer => layer.id === id))
            .filter((layer): layer is Layer => Boolean(layer));

          onOrderChangeRNN(reordered);
        },
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [layersRNN, onOrderChangeRNN]);

  useEffect(() => {
    if (denseListRef.current) {
      const sortable = Sortable.create(denseListRef.current, {
        animation: 150,
        handle: '.drag-handle',
        onEnd: () => {
          if (!denseListRef.current) return;

          const newOrderIds = Array.from(denseListRef.current.children).map(
            el => (el as HTMLElement).dataset.id
          );

          const reordered = newOrderIds
            .map(id => layersDense.find(layer => layer.id === id))
            .filter((layer): layer is Layer => Boolean(layer));

          onOrderChangeDense(reordered);
        },
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [layersDense, onOrderChangeDense]);

  const handleRemoveLayer = (id: string, type: 'RNN' | 'Dense') => {
    onRemoveLayer(id, type);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div>
        <h3 className='text-base font-semibold mb-3 text-gray-900'>
          Camadas RNN:
        </h3>
        <ul ref={rnnListRef} className='space-y-1'>
          {layersRNN.map(layer => (
            <li
              key={layer.id}
              data-id={layer.id}
              className='flex items-center justify-between gap-x-3 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-default'
            >
              <div className='flex items-center gap-x-3'>
                <div className='drag-handle cursor-grab text-gray-400 hover:text-gray-600'>
                  <GripVertical />
                </div>
                <div className='flex flex-col'>
                  <span className='text-md font-medium text-gray-900'>
                    Camada {layer.type}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {layer.neurons} neurônios
                  </span>
                </div>
              </div>
              <IconButton
                icon={<X className='w-4 h-4' />}
                size='sm'
                onClick={() => handleRemoveLayer(layer.id, 'RNN')}
                tooltip='Remover camada'
              />
            </li>
          ))}
        </ul>
      </div>

      {layersRNN.length === 0 && (
        <div className='text-center text-gray-500'>
          <p className='text-sm'>Nenhuma camada adicionada ainda.</p>
          <p className='text-xs mt-1'>
            Use o formulário acima para adicionar camadas.
          </p>
        </div>
      )}

      {layersDense.length > 0 && (
        <div>
          <h3 className='text-base font-semibold mb-3 text-gray-900'>
            Camadas Dense:
          </h3>
          <ul ref={denseListRef} className='space-y-1'>
            {layersDense.map(layer => (
              <li
                key={layer.id}
                data-id={layer.id}
                className='flex items-center justify-between gap-x-3 py-3 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-default'
              >
                <div className='flex items-center gap-x-3'>
                  <div className='drag-handle cursor-grab text-gray-400 hover:text-gray-600'>
                    <GripVertical />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-medium text-gray-900'>
                      Camada {layer.type}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {layer.neurons} neurônios
                    </span>
                  </div>
                </div>
                <IconButton
                  icon={<X className='w-4 h-4' />}
                  size='sm'
                  onClick={() => handleRemoveLayer(layer.id, 'Dense')}
                  tooltip='Remover camada'
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortableList;
