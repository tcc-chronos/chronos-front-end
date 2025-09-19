import type { ModelTraining } from '../../../types/training';

export interface TrainingCardProps {
  training: ModelTraining;
  modelId: string;
  onDelete?: (trainingId: string) => void;
}
