/**
 * UI-specific types for training components
 */

// Layer configuration for RNN training
export interface Layer {
  id: string;
  neurons: number;
  dropout: number;
  type: 'RNN' | 'Dense';
}

// SortableList component props
export interface SortableListProps {
  layersRNN: Layer[];
  layersDense: Layer[];
  onOrderChangeRNN: (layers: Layer[]) => void;
  onOrderChangeDense: (layers: Layer[]) => void;
  onRemoveLayer: (id: string, type: 'RNN' | 'Dense') => void;
  className?: string;
}
