export interface Layer {
  id: string;
  neurons: number;
  type: 'RNN' | 'Dense';
}

export interface SortableListProps {
  layersRNN: Layer[];
  layersDense: Layer[];
  onOrderChangeRNN: (layers: Layer[]) => void;
  onOrderChangeDense: (layers: Layer[]) => void;
  onRemoveLayer: (id: string, type: 'RNN' | 'Dense') => void;
  className?: string;
}
