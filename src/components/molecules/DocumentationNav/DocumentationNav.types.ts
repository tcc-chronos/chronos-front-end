import { type DocumentationSection } from '../../../types/documentation';

export interface DocumentationNavProps {
  sections: DocumentationSection[];
  activeSection?: string;
}
