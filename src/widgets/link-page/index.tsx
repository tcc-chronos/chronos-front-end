import { Link, useLocation } from 'react-router-dom';

interface LinkPageProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const LinkPage: React.FC<LinkPageProps> = ({ to, children, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`
        font-secondary block py-2 px-5 text-gray-900 rounded-sm hover:bg-blue-50
        ${isActive 
          ? 'text-blue-600 bg-blue-50 border-b-2 border-blue-600 shadow-sm' 
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
        }
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export default LinkPage;
