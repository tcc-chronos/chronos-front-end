/**
 * Documentation types
 */

export interface DocumentationSection {
  id: string;
  title: string;
  content: string;
}

export interface DocumentationData {
  title: string;
  sections: DocumentationSection[];
}
