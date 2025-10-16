import type { TrainingCardProps } from '../TrainingCard/TrainingCard.types';

export interface SelectableTrainingCardProps extends TrainingCardProps {
  isSelected?: boolean;
  onSelect?: (trainingId: string) => void;
  isPolling?: boolean;
  isPredicting?: boolean;
}
