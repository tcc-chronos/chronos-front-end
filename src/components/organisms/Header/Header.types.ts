import type { NavigationItem } from '../../molecules/Navigation/Navigation.types';

export interface HeaderProps {
  /**
   * Itens de navegação
   */
  navigationItems?: NavigationItem[];
  /**
   * Tamanho do logo
   */
  logoSize?: 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Callback para clique em item de navegação
   */
  onNavigationItemClick?: (
    item: NavigationItem,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => void;
}
