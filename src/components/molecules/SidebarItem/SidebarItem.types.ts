export interface SidebarItemProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  content?: React.ReactNode;
  isActive?: boolean;
  onClick?: (id: string) => void;
  disabled?: boolean;
  tooltip?: string;
  className?: string;
}
