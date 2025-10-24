export interface NavigationItem {
  /**
   * Texto do link
   */
  label: string;
  /**
   * URL de destino
   */
  href: string;
}

export interface NavigationProps {
  /**
   * Lista de itens de navegação
   */
  items: NavigationItem[];
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Callback para clique em item
   */
  onItemClick?: (
    item: NavigationItem,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => void;
}
