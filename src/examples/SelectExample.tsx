import React, { useState, useEffect } from 'react';
import Select from '../components/atoms/Select';
import type { SelectOption } from '../components/atoms/Select/Select.types';

// Simulação de dados da API
const fetchUsers = async (): Promise<SelectOption[]> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 1000));

  return [
    { value: 1, label: 'João Silva' },
    { value: 2, label: 'Maria Santos' },
    { value: 3, label: 'Pedro Oliveira' },
    { value: 4, label: 'Ana Costa', disabled: true },
    { value: 5, label: 'Carlos Ferreira' },
  ];
};

const SelectExample: React.FC = () => {
  const [users, setUsers] = useState<SelectOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | number>('');
  const [selectedCategory, setSelectedCategory] = useState<string | number>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Simula carregamento de dados da API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const userData = await fetchUsers();
        setUsers(userData);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Opções fixas para categoria
  const categoryOptions: SelectOption[] = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'devops', label: 'DevOps' },
    { value: 'design', label: 'Design' },
  ];

  const handleUserChange = (value: string | number) => {
    setSelectedUser(value);
    setError(''); // Limpa erro quando usuário seleciona
  };

  const handleCategoryChange = (value: string | number) => {
    setSelectedCategory(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUser) {
      setError('Por favor, selecione um usuário');
      return;
    }

    console.log('Usuário selecionado:', selectedUser);
    console.log('Categoria selecionada:', selectedCategory);
    alert(`Usuário: ${selectedUser}, Categoria: ${selectedCategory}`);
  };

  return (
    <div className='max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg'>
      <h2 className='text-2xl font-bold mb-6 text-functional-heavy-darkest'>
        Exemplo de Select
      </h2>

      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Select com dados da API */}
        <Select
          label='Selecione um usuário'
          tooltip='Escolha o usuário responsável pelo projeto'
          options={users}
          value={selectedUser}
          onChange={handleUserChange}
          placeholder='Escolha um usuário...'
          loading={loading}
          required
          hasError={!!error}
          errorMessage={error}
          emptyMessage='Nenhum usuário encontrado'
        />

        {/* Select com opções fixas */}
        <Select
          label='Categoria do projeto'
          tooltip='Selecione a categoria que melhor descreve o projeto'
          options={categoryOptions}
          value={selectedCategory}
          onChange={handleCategoryChange}
          placeholder='Selecione uma categoria...'
          size='md'
        />

        {/* Select desabilitado para demonstração */}
        <Select
          label='Status (desabilitado)'
          options={[
            { value: 'active', label: 'Ativo' },
            { value: 'inactive', label: 'Inativo' },
          ]}
          value='active'
          disabled
          placeholder='Status não pode ser alterado'
        />

        <button
          type='submit'
          className='w-full bg-brand-primary-medium text-white py-2 px-4 rounded-md hover:bg-brand-primary-dark transition-colors duration-200'
        >
          Enviar
        </button>
      </form>

      {/* Debug info */}
      <div className='mt-6 p-4 bg-functional-soft-dark rounded-md'>
        <h3 className='text-sm font-semibold text-functional-heavy-dark mb-2'>
          Estado atual:
        </h3>
        <pre className='text-xs text-functional-heavy-medium'>
          {JSON.stringify(
            {
              selectedUser,
              selectedCategory,
              loading,
              error,
              usersLoaded: users.length,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default SelectExample;
