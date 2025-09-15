import { useState } from 'react';
import Button from '../components/atoms/Button';

// Componentes de ícones simples para demonstração
const SaveIcon = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M19 12v7H5v-7H3v7c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zm-6 .67l2.59-2.58L17 11.5l-5 5-5-5 1.41-1.41L11 12.67V3h2z' />
  </svg>
);

const EditIcon = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' />
  </svg>
);

const DeleteIcon = () => (
  <svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'>
    <path d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' />
  </svg>
);

const ButtonExample = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    save: false,
    submit: false,
    delete: false,
  });

  const handleSave = async () => {
    setLoadingStates(prev => ({ ...prev, save: true }));
    // Simula operação async
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoadingStates(prev => ({ ...prev, save: false }));
    alert('Dados salvos com sucesso!');
  };

  const handleSubmit = async () => {
    setLoadingStates(prev => ({ ...prev, submit: true }));
    // Simula operação async
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoadingStates(prev => ({ ...prev, submit: false }));
    alert('Formulário enviado!');
  };

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar?')) {
      setLoadingStates(prev => ({ ...prev, delete: true }));
      // Simula operação async
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoadingStates(prev => ({ ...prev, delete: false }));
      alert('Item deletado!');
    }
  };

  const handleToggleLoading = () => {
    setIsLoading(!isLoading);
  };

  return (
    <div className='max-w-4xl mx-auto p-8 bg-functional-soft-lightest min-h-screen'>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-functional-heavy-darkest mb-2'>
            Componente Button
          </h1>
          <p className='text-functional-heavy-medium'>
            Demonstração das variantes, tamanhos e estados do componente Button
            usando cores brand
          </p>
        </div>

        {/* Variantes */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Variantes (usando cores brand)
          </h2>
          <div className='flex flex-wrap gap-4'>
            <Button variant='primary'>Primary</Button>
            <Button variant='secondary'>Secondary</Button>
            <Button variant='outline'>Outline</Button>
            <Button variant='ghost'>Ghost</Button>
            <Button variant='danger'>Danger</Button>
          </div>
        </section>

        {/* Tamanhos */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Tamanhos
          </h2>
          <div className='flex flex-wrap items-center gap-4'>
            <Button size='xs'>Extra Small</Button>
            <Button size='sm'>Small</Button>
            <Button size='md'>Medium</Button>
            <Button size='lg'>Large</Button>
            <Button size='xl'>Extra Large</Button>
          </div>
        </section>

        {/* Estados */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Estados
          </h2>
          <div className='flex flex-wrap gap-4'>
            <Button>Normal</Button>
            <Button disabled>Disabled</Button>
            <Button isLoading={isLoading} loadingText='Carregando...'>
              {isLoading ? 'Loading...' : 'Toggle Loading'}
            </Button>
            <Button onClick={handleToggleLoading} variant='outline' size='sm'>
              {isLoading ? 'Stop Loading' : 'Start Loading'}
            </Button>
          </div>
        </section>

        {/* Com Ícones */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Com Ícones
          </h2>
          <div className='flex flex-wrap gap-4'>
            <Button leftIcon={<SaveIcon />}>Salvar</Button>
            <Button rightIcon={<EditIcon />} variant='outline'>
              Editar
            </Button>
            <Button
              leftIcon={<DeleteIcon />}
              rightIcon={<DeleteIcon />}
              variant='danger'
            >
              Deletar Tudo
            </Button>
          </div>
        </section>

        {/* Largura Total */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Largura Total
          </h2>
          <div className='space-y-3'>
            <Button fullWidth>Botão de Largura Total</Button>
            <Button fullWidth variant='outline' leftIcon={<SaveIcon />}>
              Salvar Documento
            </Button>
          </div>
        </section>

        {/* Casos de Uso Práticos */}
        <section className='bg-functional-soft-lightest p-6 rounded-lg border border-functional-soft-darkest'>
          <h2 className='text-xl font-semibold text-functional-heavy-darkest mb-4'>
            Casos de Uso Práticos
          </h2>
          <div className='space-y-4'>
            {/* Formulário */}
            <div className='bg-functional-soft-lightest p-4 rounded border'>
              <h3 className='font-medium text-functional-heavy-dark mb-3'>
                Formulário
              </h3>
              <div className='flex gap-3'>
                <Button
                  onClick={handleSave}
                  isLoading={loadingStates.save}
                  leftIcon={<SaveIcon />}
                  loadingText='Salvando...'
                >
                  Salvar
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={loadingStates.submit}
                  variant='outline'
                  loadingText='Enviando...'
                >
                  Enviar
                </Button>
                <Button variant='ghost'>Cancelar</Button>
              </div>
            </div>

            {/* Ações Destrutivas */}
            <div className='bg-functional-soft-lightest p-4 rounded border'>
              <h3 className='font-medium text-functional-heavy-dark mb-3'>
                Ações Destrutivas
              </h3>
              <div className='flex gap-3'>
                <Button
                  onClick={handleDelete}
                  isLoading={loadingStates.delete}
                  variant='danger'
                  leftIcon={<DeleteIcon />}
                  loadingText='Deletando...'
                >
                  Deletar Item
                </Button>
                <Button variant='outline'>Cancelar</Button>
              </div>
            </div>

            {/* Call to Action */}
            <div className='bg-brand-primary-lightest p-6 rounded-lg text-center'>
              <h3 className='text-lg font-medium text-functional-heavy-darkest mb-2'>
                Pronto para começar?
              </h3>
              <p className='text-functional-heavy-medium mb-4'>
                Crie sua conta gratuitamente e experimente todas as
                funcionalidades.
              </p>
              <div className='flex justify-center gap-3'>
                <Button size='lg'>Criar Conta Grátis</Button>
                <Button variant='outline' size='lg'>
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Debug */}
        <section className='bg-functional-soft-dark p-4 rounded-lg'>
          <h3 className='text-sm font-semibold text-functional-heavy-dark mb-2'>
            Estado Atual:
          </h3>
          <pre className='text-xs text-functional-heavy-medium'>
            {JSON.stringify(
              {
                isLoading,
                loadingStates,
              },
              null,
              2
            )}
          </pre>
        </section>
      </div>
    </div>
  );
};

export default ButtonExample;
