import type { Model } from '../../../types/training';

export interface ModelCardProps {
  model: Model;
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onCopyParams: () => void;
  onDelete: () => void;
  onNewTraining: () => void;
  onDeleteTraining?: (trainingId: string) => void;
}
