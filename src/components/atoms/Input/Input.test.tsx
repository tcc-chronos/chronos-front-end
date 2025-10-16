import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Input from './Input';

describe('Input', () => {
  it('renders with correct value', () => {
    render(<Input value='test' onChange={() => {}} />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(<Input hasError value='test' onChange={() => {}} />);
    const input = screen.getByDisplayValue('test');
    expect(input).toHaveClass('border-feedback-danger-medium');
  });

  it('renders with correct size', () => {
    render(<Input size='lg' value='test' onChange={() => {}} />);
    const input = screen.getByDisplayValue('test');
    expect(input).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('renders with full width', () => {
    render(<Input fullWidth value='test' onChange={() => {}} />);
    const input = screen.getByDisplayValue('test');
    expect(input).toHaveClass('w-full');
  });

  it('renders disabled state', () => {
    render(<Input disabled value='test' onChange={() => {}} />);
    const input = screen.getByDisplayValue('test');
    expect(input).toBeDisabled();
  });
});
