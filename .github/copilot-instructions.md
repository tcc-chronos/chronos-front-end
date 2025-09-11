# Chronos Frontend - Instruções para GitHub Copilot

## 📋 **Sobre o Projeto**

**Chronos Frontend** é uma aplicação React para TCC desenvolvida com:

- **React 19.1.1** + **TypeScript 5.8.3**
- **Vite 7.1.2** como build tool
- **Tailwind CSS 4.1.13** para estilização
- **ESLint + Prettier** para qualidade de código
- **Husky** para git hooks

## ⚛️ **Arquitetura Atômica (Atomic Design)**

### Estrutura de Pastas Atômica

```
src/
├── components/
│   ├── atoms/          # Elementos básicos indivisíveis
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Label/
│   │   ├── Icon/
│   │   ├── Typography/
│   │   ├── Avatar/
│   │   ├── Badge/
│   │   ├── Spinner/
│   │   └── Divider/
│   ├── molecules/      # Combinações simples de átomos
│   │   ├── InputField/
│   │   ├── SearchBox/
│   │   ├── UserCard/
│   │   ├── Navigation/
│   │   ├── DropdownMenu/
│   │   ├── ProgressBar/
│   │   └── DatePicker/
│   ├── organisms/      # Seções complexas da interface
│   │   ├── Header/
│   │   ├── Sidebar/
│   │   ├── Footer/
│   │   ├── DataTable/
│   │   ├── UserProfile/
│   │   ├── ProjectCard/
│   │   └── Dashboard/
│   ├── templates/      # Layouts de página
│   │   ├── AuthLayout/
│   │   ├── DashboardLayout/
│   │   ├── PublicLayout/
│   │   └── ErrorLayout/
│   └── pages/          # Páginas completas
│       ├── Login/
│       ├── Dashboard/
│       ├── Projects/
│       ├── Profile/
│       └── NotFound/
├── hooks/              # Custom hooks reutilizáveis
├── services/           # APIs e serviços externos
├── store/              # Estado global (Zustand/Context)
├── types/              # Definições TypeScript globais
├── utils/              # Funções utilitárias
├── constants/          # Constantes da aplicação
├── styles/             # Design tokens e estilos globais
│   ├── tokens/         # Design tokens (cores, tipografia, spacing)
│   ├── themes/         # Temas (light/dark)
│   └── globals.css     # Estilos globais
└── lib/                # Configurações de bibliotecas externas
```

## 🧩 **Níveis da Arquitetura Atômica**

### 1. **Atoms (Átomos)**

Elementos básicos e indivisíveis da interface.

```typescript
// src/components/atoms/Button/Button.tsx
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    ghost: 'text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-3 py-1.5 text-sm rounded-md',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg',
    xl: 'px-8 py-4 text-lg rounded-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Spinner className="mr-2" size="sm" />}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
```

### 2. **Molecules (Moléculas)**

Combinações simples de átomos com funcionalidade específica.

```typescript
// src/components/molecules/InputField/InputField.tsx
import { Input } from '@/components/atoms/Input';
import { Label } from '@/components/atoms/Label';
import { Typography } from '@/components/atoms/Typography';

interface InputFieldProps {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  id: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  required,
  id,
  ...inputProps
}) => {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      <Input
        id={id}
        hasError={!!error}
        {...inputProps}
      />
      {hint && !error && (
        <Typography variant="caption" className="text-gray-500">
          {hint}
        </Typography>
      )}
      {error && (
        <Typography variant="caption" className="text-red-500">
          {error}
        </Typography>
      )}
    </div>
  );
};

export default InputField;
```

### 3. **Organisms (Organismos)**

Seções complexas compostas por moléculas e átomos.

```typescript
// src/components/organisms/Header/Header.tsx
import { Navigation } from '@/components/molecules/Navigation';
import { UserCard } from '@/components/molecules/UserCard';
import { SearchBox } from '@/components/molecules/SearchBox';

interface HeaderProps {
  user: User;
  onSearch: (query: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSearch, onLogout }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Navigation />
          <div className="flex items-center space-x-4">
            <SearchBox onSearch={onSearch} />
            <UserCard user={user} onLogout={onLogout} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
```

### 4. **Templates (Templates)**

Layouts que definem a estrutura das páginas.

```typescript
// src/components/templates/DashboardLayout/DashboardLayout.tsx
import { Header } from '@/components/organisms/Header';
import { Sidebar } from '@/components/organisms/Sidebar';
import { Footer } from '@/components/organisms/Footer';

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: User;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, user }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header user={user} />
        <main className="flex-1 p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
```

### 5. **Pages (Páginas)**

Páginas completas que utilizam templates e organismos.

```typescript
// src/components/pages/Dashboard/Dashboard.tsx
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { StatsOverview } from '@/components/organisms/StatsOverview';
import { ProjectsList } from '@/components/organisms/ProjectsList';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { data: projects } = useProjects();
  const { data: stats } = useStats();

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <StatsOverview stats={stats} />
        <ProjectsList projects={projects} />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
```

## 🎨 **Design System com Tokens**

### Design Tokens

```typescript
// src/styles/tokens/colors.ts
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    // ... todos os tons
    900: '#1e3a8a',
  },
  gray: {
    50: '#f9fafb',
    // ... escala completa
    900: '#111827',
  },
} as const;

// src/styles/tokens/spacing.ts
export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  // ... escala completa
} as const;

// src/styles/tokens/typography.ts
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    // ... escala completa
  },
} as const;
```

## 📁 **Convenções de Organização**

### Estrutura de Componente

```
ComponentName/
├── ComponentName.tsx       # Componente principal
├── ComponentName.types.ts  # Tipos específicos
├── ComponentName.stories.tsx # Storybook (futuro)
├── ComponentName.test.tsx  # Testes
├── index.ts               # Barrel export
└── README.md              # Documentação
```

### Barrel Exports

```typescript
// src/components/atoms/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Label } from './Label';
// ... outros átomos

// src/components/molecules/index.ts
export { InputField } from './InputField';
export { SearchBox } from './SearchBox';
// ... outras moléculas
```

## 🔄 **Custom Hooks por Nível**

### Hooks para Átomos

```typescript
// src/hooks/atoms/useButton.ts
const useButton = (props: ButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = useCallback(() => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  }, []);

  return { isPressed, handlePress };
};
```

### Hooks para Organismos

```typescript
// src/hooks/organisms/useHeader.ts
const useHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleSearch = useCallback((query: string) => {
    // lógica de busca
  }, []);

  return {
    user,
    isSearchOpen,
    setIsSearchOpen,
    handleSearch,
    logout,
  };
};
```

## 🎯 **Padrões de Composição**

### Compound Components

```typescript
// src/components/molecules/Card/Card.tsx
const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow ${className}`} {...props}>
    {children}
  </div>
);

const CardHeader = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 ${className}`} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={`px-6 py-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
```

## 📝 **Convenções de Nomenclatura**

### Componentes Atômicos

- **Átomos**: `Button`, `Input`, `Icon`
- **Moléculas**: `InputField`, `SearchBox`, `UserCard`
- **Organismos**: `Header`, `Sidebar`, `ProjectsList`
- **Templates**: `DashboardLayout`, `AuthLayout`
- **Páginas**: `Dashboard`, `Login`, `Projects`

### Arquivos e Pastas

- **PascalCase** para componentes: `Button.tsx`
- **camelCase** para hooks: `useButton.ts`
- **kebab-case** para pastas de funcionalidades: `user-management/`
- **UPPER_CASE** para constantes: `DESIGN_TOKENS.ts`

## 🚀 **Performance e Otimização**

### Lazy Loading por Nível

```typescript
// Páginas
const Dashboard = lazy(() => import('@/components/pages/Dashboard'));
const Projects = lazy(() => import('@/components/pages/Projects'));

// Organismos complexos
const DataTable = lazy(() => import('@/components/organisms/DataTable'));
```

### Memoização Estratégica

```typescript
// Átomos: raramente precisam de memo
const Button = ({ children, ...props }) => {
  /* ... */
};

// Moléculas: memo quando recebem objetos complexos
const InputField = memo(({ validation, ...props }) => {
  /* ... */
});

// Organismos: sempre considerar memo
const Header = memo(({ user, onSearch }) => {
  /* ... */
});
```

## 📋 **Guias de Desenvolvimento**

### Criando um Novo Átomo

1. Definir interface de props
2. Implementar variantes e tamanhos
3. Adicionar acessibilidade (ARIA)
4. Criar testes básicos

### Criando uma Nova Molécula

1. Identificar átomos necessários
2. Definir comportamento composto
3. Implementar lógica de estado local
4. Adicionar validações
5. Testar interações

### Criando um Novo Organismo

1. Planejar composição de moléculas
2. Definir props de dados
3. Implementar lógica de negócio
4. Adicionar hooks específicos
5. Testar fluxos completos

## 🧪 **Estratégia de Testes**

### Por Nível de Componente

```typescript
// Átomos: Testes de renderização e props
describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600');
  });
});

// Moléculas: Testes de composição e interação
describe('InputField', () => {
  it('shows error message when invalid', () => {
    render(<InputField label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });
});

// Organismos: Testes de integração
describe('Header', () => {
  it('handles user logout', async () => {
    const mockLogout = jest.fn();
    render(<Header user={mockUser} onLogout={mockLogout} />);

    fireEvent.click(screen.getByText('Logout'));
    expect(mockLogout).toHaveBeenCalled();
  });
});
```

## 📚 **Recursos e Referências**

- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Design Tokens](https://design-tokens.github.io/community-group/)

---

**Nota**: Esta arquitetura atômica promove reutilização, consistência e manutenibilidade. Cada nível tem responsabilidades bem definidas e todos os componentes devem seguir os princípios de composição e single responsibility.
