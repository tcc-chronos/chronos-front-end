export interface NavigationLinkProps {
  /**
   * Texto do link
   */
  children: React.ReactNode;
  /**
   * URL de destino
   */
  href: string;
  /**
   * Classes CSS adicionais
   */
  className?: string;
  /**
   * Evento de clique
   */
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}
