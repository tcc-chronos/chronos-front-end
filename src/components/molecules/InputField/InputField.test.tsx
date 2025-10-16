import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';

describe('InputField', () => {
  it('renders with label', () => {
    render(<InputField label='Email' id='email' />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<InputField label='Email' id='email' required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<InputField label='Email' id='email' error='Email inválido' />);
    expect(screen.getByText('Email inválido')).toBeInTheDocument();
  });

  it('shows hint message', () => {
    render(<InputField label='Email' id='email' hint='Digite seu email' />);
    expect(screen.getByText('Digite seu email')).toBeInTheDocument();
  });

  it('calls onChange handler', () => {
    const handleChange = vi.fn();
    render(<InputField label='Email' id='email' onChange={handleChange} />);

    const input = screen.getByLabelText('Email');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    expect(handleChange).toHaveBeenCalledWith('test@example.com');
  });
});
