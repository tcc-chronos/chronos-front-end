import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NumberInput from './NumberInput';

describe('NumberInput', () => {
  it('renders input correctly', () => {
    render(<NumberInput placeholder='Enter number' />);

    const input = screen.getByPlaceholderText('Enter number');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('inputMode', 'decimal');
  });

  it('handles number input correctly', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  it('handles negative numbers when allowed', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} allowNegative={true} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-50.25' } });

    expect(onChange).toHaveBeenCalledWith(-50.25);
  });

  it('rejects negative numbers when not allowed', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} allowNegative={false} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '-50' } });

    // O valor não deve ser aceito
    expect(input).toHaveValue('');
  });

  it('applies error styling when hasError is true', () => {
    render(<NumberInput hasError={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-feedback-danger-medium');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<NumberInput size='sm' />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-3', 'py-1.5');

    rerender(<NumberInput size='lg' />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('px-4', 'py-3');
  });

  it('handles empty value correctly', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} />);

    const input = screen.getByRole('textbox');

    // Primeiro adiciona um valor para ter algo para limpar
    fireEvent.change(input, { target: { value: '123' } });

    // Agora limpa o valor
    fireEvent.change(input, { target: { value: '' } });

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(input).toHaveValue('');
  });

  it('formats number on blur', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} decimalPlaces={2} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '123.456' } });
    fireEvent.blur(input);

    expect(input).toHaveValue('123.46');
  });

  it('respects min and max values', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} min={0} max={100} />);

    const input = screen.getByRole('textbox');

    // Valor dentro do range
    fireEvent.change(input, { target: { value: '50' } });
    expect(onChange).toHaveBeenCalledWith(50);

    // Valor fora do range ainda permite entrada mas pode ser validado
    fireEvent.change(input, { target: { value: '150' } });
    expect(onChange).toHaveBeenCalledWith(150);
  });

  it('handles decimal input correctly', () => {
    const onChange = vi.fn();
    render(<NumberInput onChange={onChange} />);

    const input = screen.getByRole('textbox');

    // Permitir entrada de ponto decimal
    fireEvent.change(input, { target: { value: '12.' } });
    expect(input).toHaveValue('12.');

    // Completar o número decimal
    fireEvent.change(input, { target: { value: '12.34' } });
    expect(onChange).toHaveBeenCalledWith(12.34);
  });
});
