import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';
import type { SelectOption } from './Select.types';

const mockOptions: SelectOption[] = [
  { value: '1', label: 'Opção 1' },
  { value: '2', label: 'Opção 2' },
  { value: 3, label: 'Opção 3' },
  { value: '4', label: 'Opção 4', disabled: true },
];

describe('Select', () => {
  it('renders select correctly', () => {
    render(<Select options={mockOptions} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('renders placeholder as first option', () => {
    render(<Select options={mockOptions} placeholder='Selecione uma opção' />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('');

    const placeholder = screen.getByText('Selecione uma opção');
    expect(placeholder).toBeInTheDocument();
  });

  it('renders default placeholder when not provided', () => {
    render(<Select options={mockOptions} />);

    const placeholder = screen.getByText('Selecione...');
    expect(placeholder).toBeInTheDocument();
  });

  it('renders all options correctly', () => {
    render(<Select options={mockOptions} />);

    mockOptions.forEach(option => {
      const optionElement = screen.getByText(option.label);
      expect(optionElement).toBeInTheDocument();
    });
  });

  it('handles selection change correctly', () => {
    const onChange = vi.fn();
    render(<Select options={mockOptions} onChange={onChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '1' } });

    expect(onChange).toHaveBeenCalledWith('1');
  });

  it('handles number value selection correctly', () => {
    const onChange = vi.fn();
    render(<Select options={mockOptions} onChange={onChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '3' } });

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('renders label when provided', () => {
    render(<Select options={mockOptions} label='Selecione uma opção' />);

    const label = screen.getByText('Selecione uma opção');
    expect(label).toBeInTheDocument();
    expect(label.tagName).toBe('LABEL');
  });

  it('renders required asterisk when required', () => {
    render(<Select options={mockOptions} label='Campo obrigatório' required />);

    const asterisk = screen.getByText('*');
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveClass('text-feedback-danger-medium');
  });

  it('applies error styling when hasError is true', () => {
    render(<Select options={mockOptions} hasError={true} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-feedback-danger-medium');
  });

  it('displays error message when provided', () => {
    render(
      <Select
        options={mockOptions}
        hasError={true}
        errorMessage='Este campo é obrigatório'
      />
    );

    const errorMessage = screen.getByText('Este campo é obrigatório');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
    expect(errorMessage).toHaveClass('text-feedback-danger-medium');
  });

  it('handles disabled state correctly', () => {
    render(<Select options={mockOptions} disabled />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('disabled:bg-functional-soft-darkest');
  });

  it('handles loading state correctly', () => {
    render(<Select options={mockOptions} loading />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();

    const loadingText = screen.getByText('Carregando...');
    expect(loadingText).toBeInTheDocument();
  });

  it('displays empty message when no options available', () => {
    render(<Select options={[]} emptyMessage='Nenhum item encontrado' />);

    const emptyMessage = screen.getByText('Nenhum item encontrado');
    expect(emptyMessage).toBeInTheDocument();
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Select options={mockOptions} size='sm' />);

    let select = screen.getByRole('combobox');
    expect(select).toHaveClass('px-3', 'py-1.5', 'text-sm');

    rerender(<Select options={mockOptions} size='md' />);
    select = screen.getByRole('combobox');
    expect(select).toHaveClass('px-4', 'py-2', 'text-base');

    rerender(<Select options={mockOptions} size='lg' />);
    select = screen.getByRole('combobox');
    expect(select).toHaveClass('px-5', 'py-3', 'text-lg');
  });

  it('handles disabled options correctly', () => {
    render(<Select options={mockOptions} />);

    const disabledOption = screen.getByText('Opção 4');
    expect(disabledOption).toHaveAttribute('disabled');
  });

  it('sets controlled value correctly', () => {
    render(<Select options={mockOptions} value='2' />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('2');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Select ref={ref} options={mockOptions} />);

    expect(ref).toHaveBeenCalled();
  });
});
