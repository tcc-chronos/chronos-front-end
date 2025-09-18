import React, { useState } from 'react';
import { SelectField } from '../components/molecules';
import type { SelectOption } from '../components/atoms/Select/Select.types';

const SelectFieldExample: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string | number>('');
  const [selectedValueWithError, setSelectedValueWithError] = useState<
    string | number
  >('');

  const options: SelectOption[] = [
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'svelte', label: 'Svelte' },
    { value: 'nextjs', label: 'Next.js' },
  ];

  const priorityOptions: SelectOption[] = [
    { value: 1, label: 'Baixa Prioridade' },
    { value: 2, label: 'Média Prioridade' },
    { value: 3, label: 'Alta Prioridade' },
    { value: 4, label: 'Urgente' },
  ];

  return (
    <div className='p-8 space-y-8 bg-functional-soft-lightest min-h-screen'>
      <div className='max-w-2xl mx-auto space-y-8'>
        <h1 className='text-3xl font-bold text-functional-heavy-darkest'>
          SelectField Examples
        </h1>

        {/* Exemplo básico */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Exemplo Básico
          </h2>
          <SelectField
            id='framework-select'
            label='Framework Favorito'
            options={options}
            value={selectedValue}
            onChange={setSelectedValue}
            placeholder='Selecione um framework...'
            hint='Escolha o framework que você mais gosta de usar'
          />
          <p className='text-sm text-functional-heavy-medium'>
            Valor selecionado: {selectedValue || 'Nenhum'}
          </p>
        </div>

        {/* Exemplo com tooltip */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Com Tooltip de Informação
          </h2>
          <SelectField
            id='priority-select'
            label='Prioridade'
            options={priorityOptions}
            placeholder='Selecione a prioridade...'
            infoTooltip='A prioridade determina a ordem de execução das tarefas. Urgente tem a maior prioridade.'
            hint='Defina o nível de prioridade para esta tarefa'
          />
        </div>

        {/* Exemplo obrigatório */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Campo Obrigatório
          </h2>
          <SelectField
            id='required-select'
            label='Linguagem de Programação'
            options={[
              { value: 'javascript', label: 'JavaScript' },
              { value: 'typescript', label: 'TypeScript' },
              { value: 'python', label: 'Python' },
              { value: 'java', label: 'Java' },
            ]}
            required
            placeholder='Selecione uma linguagem...'
            infoTooltip='Campo obrigatório para continuar'
          />
        </div>

        {/* Exemplo com erro */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Com Erro
          </h2>
          <SelectField
            id='error-select'
            label='Categoria'
            options={[
              { value: 'frontend', label: 'Frontend' },
              { value: 'backend', label: 'Backend' },
              { value: 'fullstack', label: 'Fullstack' },
            ]}
            value={selectedValueWithError}
            onChange={setSelectedValueWithError}
            error='Este campo é obrigatório'
            required
            placeholder='Selecione uma categoria...'
            hint='Esta mensagem não aparece quando há erro'
            infoTooltip='Selecione a categoria que melhor descreve o projeto'
          />
        </div>

        {/* Exemplo com loading */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Estado de Loading
          </h2>
          <SelectField
            id='loading-select'
            label='Dados Remotos'
            options={[]}
            loading
            disabled
            placeholder='Carregando opções...'
            infoTooltip='Os dados estão sendo carregados do servidor'
          />
        </div>

        {/* Exemplo com tamanhos diferentes */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Diferentes Tamanhos
          </h2>
          <div className='space-y-4'>
            <SelectField
              id='small-select'
              label='Select Pequeno'
              options={options}
              size='sm'
              placeholder='Pequeno...'
              infoTooltip='Este é um select pequeno'
            />
            <SelectField
              id='medium-select'
              label='Select Médio'
              options={options}
              size='md'
              placeholder='Médio...'
              infoTooltip='Este é um select médio (padrão)'
            />
            <SelectField
              id='large-select'
              label='Select Grande'
              options={options}
              size='lg'
              placeholder='Grande...'
              infoTooltip='Este é um select grande'
            />
          </div>
        </div>

        {/* Exemplo desabilitado */}
        <div className='space-y-4'>
          <h2 className='text-xl font-semibold text-functional-heavy-dark'>
            Desabilitado
          </h2>
          <SelectField
            id='disabled-select'
            label='Campo Desabilitado'
            options={options}
            disabled
            value='react'
            placeholder='Desabilitado...'
            infoTooltip='Este campo está desabilitado e não pode ser alterado'
          />
        </div>
      </div>
    </div>
  );
};

export default SelectFieldExample;
