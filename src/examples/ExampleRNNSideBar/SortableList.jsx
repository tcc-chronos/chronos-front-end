import { useEffect, useRef, useState } from 'react';
import Sortable from 'sortablejs';
import drag from '../../assets/icons/dragIcon.svg';
import { v4 as uuidv4 } from 'uuid';

export default function SortableList({
  layersRNN,
  layersDense,
  onOrderChangeRNN,
  onOrderChangeDense,
}) {
  const rnnListRef = useRef(null);
  const denseListRef = useRef(null);
  const RNN_STORAGE_KEY = 'layer-list-rnn';
  const DENSE_STORAGE_KEY = 'layer-list-dense';

  const [itemsRNN, setItemsRNN] = useState(() => {
    const saved = sessionStorage.getItem(RNN_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: uuidv4(),
            neurons: 128,
            type: 'RNN',
          },
        ];
  });

  const [itemsDense, setItemsDense] = useState(() => {
    const saved = sessionStorage.getItem(DENSE_STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: uuidv4(),
            neurons: 64,
            type: 'Dense',
          },
        ];
  });

  const itemsRefRNN = useRef(itemsRNN);
  const itemsRefDense = useRef(itemsDense);

  useEffect(() => {
    itemsRefRNN.current = itemsRNN;
    sessionStorage.setItem(RNN_STORAGE_KEY, JSON.stringify(itemsRNN));
  }, [itemsRNN]);

  useEffect(() => {
    itemsRefDense.current = itemsDense;
    sessionStorage.setItem(DENSE_STORAGE_KEY, JSON.stringify(itemsDense));
  }, [itemsDense]);

  useEffect(() => {
    if (layersRNN) {
      setItemsRNN(layersRNN);
    }
  }, [layersRNN]);

  useEffect(() => {
    if (layersDense) {
      setItemsDense(layersDense);
    }
  }, [layersDense]);

  const removeItemRNN = id => {
    setItemsRNN(prev => prev.filter(item => item.id !== id));
  };

  const removeItemDense = id => {
    setItemsDense(prev => prev.filter(item => item.id !== id));
  };

  useEffect(() => {
    if (rnnListRef.current) {
      Sortable.create(rnnListRef.current, {
        animation: 150,
        onEnd: () => {
          const newOrderIds = [...rnnListRef.current.children].map(
            el => el.dataset.id
          );

          const reordered = newOrderIds
            .map(id => itemsRefRNN.current.find(item => String(item.id) === id))
            .filter(Boolean);

          setItemsRNN(reordered);

          if (onOrderChangeRNN) {
            onOrderChangeRNN(reordered); // Notifica o componente pai
          }
        },
      });
    }
  }, []);

  useEffect(() => {
    if (denseListRef.current) {
      Sortable.create(denseListRef.current, {
        animation: 150,
        onEnd: () => {
          const newOrderIds = [...denseListRef.current.children].map(
            el => el.dataset.id
          );

          const reordered = newOrderIds
            .map(id =>
              itemsRefDense.current.find(item => String(item.id) === id)
            )
            .filter(Boolean);

          setItemsDense(reordered);

          if (onOrderChangeDense) {
            onOrderChangeDense(reordered); // Notifica o componente pai
          }
        },
      });
    }
  }, []);

  return (
    <>
      <h1 className='text-base font-semibold mb-2'>Camadas RNN:</h1>
      <ul ref={rnnListRef} className='max-w-md flex flex-col mb-6'>
        {itemsRNN.map(item => (
          <li
            key={item.id}
            data-id={item.id}
            className='hover:bg-gray-100 inline-flex items-center justify-between gap-x-4 py-3 px-3 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg'
          >
            <div className='flex flex-row'>
              <img src={drag} className='w-7 mr-3' />
              <div className='flex flex-col'>
                <span className='text-base font-semibold'>
                  Camada {item.type}
                </span>
                <span className='text-sm text-gray-500'>
                  {item.neurons} neurônios
                </span>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                removeItemRNN(item.id);
              }}
              className='text-gray-400 hover:text-red-500 transition-colors'
              aria-label='Remover camada'
            >
              <svg
                className='w-5 h-5'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      {itemsDense.length > 0 && (
        <h1 className='text-base font-semibold mb-2'>Camadas Dense:</h1>
      )}
      <ul ref={denseListRef} className='max-w-md flex flex-col'>
        {itemsDense.map(item => (
          <li
            key={item.id}
            data-id={item.id}
            className='hover:bg-gray-100 inline-flex items-center justify-between gap-x-4 py-3 px-3 cursor-grab text-sm font-medium bg-white border border-gray-200 text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg'
          >
            <div className='flex flex-row'>
              <img src={drag} className='w-7 mr-3' />
              <div className='flex flex-col'>
                <span className='text-base font-semibold'>
                  Camada {item.type}
                </span>
                <span className='text-sm text-gray-500'>
                  {item.neurons} neurônios
                </span>
              </div>
            </div>

            <button
              onClick={e => {
                e.stopPropagation();
                removeItemDense(item.id);
              }}
              className='text-gray-400 hover:text-red-500 transition-colors'
              aria-label='Remover camada'
            >
              <svg
                className='w-5 h-5'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
                strokeWidth='2'
              >
                <line x1='18' y1='6' x2='6' y2='18' />
                <line x1='6' y1='6' x2='18' y2='18' />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
