import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import NumberInputField from './NumberInputField';

describe('NumberInputField', () => {
  it('renders label and input correctly', () => {
    render(
      <NumberInputField label='Amount' id='amount' placeholder='Enter amount' />
    );

    expect(screen.getByLabelText('Amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<NumberInputField label='Amount' id='amount' required={true} />);

    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays info tooltip when provided', () => {
    render(
      <NumberInputField
        label='Amount'
        id='amount'
        infoTooltip='This is helpful information'
      />
    );

    // Buscar o SVG que representa o ícone de informação
    const svg = document.querySelector('svg[aria-hidden="true"]');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('cursor-help');
  });

  it('displays error message when error is provided', () => {
    render(
      <NumberInputField label='Amount' id='amount' error='Invalid amount' />
    );

    const errorMessage = screen.getByRole('alert');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent('Invalid amount');
  });

  it('displays hint when no error is present', () => {
    render(
      <NumberInputField
        label='Amount'
        id='amount'
        hint='Enter a positive number'
      />
    );

    expect(screen.getByText('Enter a positive number')).toBeInTheDocument();
  });

  it('hides hint when error is present', () => {
    render(
      <NumberInputField
        label='Amount'
        id='amount'
        hint='Enter a positive number'
        error='Invalid amount'
      />
    );

    expect(
      screen.queryByText('Enter a positive number')
    ).not.toBeInTheDocument();
    expect(screen.getByText('Invalid amount')).toBeInTheDocument();
  });

  it('handles number input correctly', () => {
    const onChange = vi.fn();
    render(<NumberInputField label='Amount' id='amount' onChange={onChange} />);

    const input = screen.getByLabelText('Amount');
    fireEvent.change(input, { target: { value: '123.45' } });

    expect(onChange).toHaveBeenCalledWith(123.45);
  });

  it('applies aria attributes correctly', () => {
    render(
      <NumberInputField label='Amount' id='amount' error='Invalid amount' />
    );

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'amount-error');
  });

  it('applies hint aria-describedby when no error', () => {
    render(
      <NumberInputField
        label='Amount'
        id='amount'
        hint='Enter a positive number'
      />
    );

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-describedby', 'amount-hint');
  });
});
