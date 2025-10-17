import { type DocumentationLinkProps } from './DocumentationLink.types';

/**
 * DocumentationLink Atom
 * Link de navegação para seções da documentação
 */
const DocumentationLink: React.FC<DocumentationLinkProps> = ({
  href,
  title,
  isActive = false,
}) => {
  return (
    <a
      href={href}
      className={`
        block px-4 py-2 rounded-md border-l-4 text-sm
        transition-all duration-200 ease-in-out
        hover:translate-x-1
        ${
          isActive
            ? 'border-blue-600 bg-blue-50 text-blue-900 font-medium'
            : 'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 hover:border-gray-400'
        }
      `}
    >
      <span className='font-medium'>{title}</span>
    </a>
  );
};

export default DocumentationLink;
