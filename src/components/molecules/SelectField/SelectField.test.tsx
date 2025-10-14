import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import SelectField from './SelectField';

describe('SelectField', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'test-select',
    label: 'Test Select',
    options: mockOptions,
  };

  it('renders select field correctly', () => {
    render(<SelectField {...defaultProps} />);

    const label = screen.getByText('Test Select');
    const select = screen.getByRole('combobox');

    expect(label).toBeInTheDocument();
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'test-select');
  });

  it('displays required asterisk when required prop is true', () => {
    render(<SelectField {...defaultProps} required />);

    const requiredMark = screen.getByLabelText('required');
    expect(requiredMark).toBeInTheDocument();
    expect(requiredMark).toHaveTextContent('*');
  });

  it('shows info tooltip when provided', () => {
    render(
      <SelectField {...defaultProps} infoTooltip='This is helpful info' />
    );

    const svgIcon = document.querySelector('svg');
    expect(svgIcon).toBeInTheDocument();
  });

  it('displays hint text when provided and no error', () => {
    const hint = 'This is a helpful hint';
    render(<SelectField {...defaultProps} hint={hint} />);

    const hintElement = screen.getByText(hint);
    expect(hintElement).toBeInTheDocument();
    expect(hintElement).toHaveClass('text-functional-heavy-medium');
  });

  it('displays error message when error prop is provided', () => {
    const errorMessage = 'This field is required';
    render(<SelectField {...defaultProps} error={errorMessage} />);

    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveClass('text-feedback-danger-medium');
    expect(errorElement).toHaveAttribute('role', 'alert');
  });

  it('hides hint when error is present', () => {
    const hint = 'This is a helpful hint';
    const error = 'This field is required';
    render(<SelectField {...defaultProps} hint={hint} error={error} />);

    const hintElement = screen.queryByText(hint);
    const errorElement = screen.getByText(error);

    expect(hintElement).not.toBeInTheDocument();
    expect(errorElement).toBeInTheDocument();
  });

  it('sets aria-describedby correctly for error state', () => {
    const errorMessage = 'This field is required';
    render(<SelectField {...defaultProps} error={errorMessage} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby', 'test-select-error');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets aria-describedby correctly for hint state', () => {
    const hint = 'This is a helpful hint';
    render(<SelectField {...defaultProps} hint={hint} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-describedby', 'test-select-hint');
  });

  it('handles onChange events correctly', () => {
    const mockOnChange = vi.fn();
    render(<SelectField {...defaultProps} onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(mockOnChange).toHaveBeenCalledWith('option2');
  });

  it('applies custom className to select element', () => {
    render(<SelectField {...defaultProps} className='custom-class' />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('custom-class');
  });

  it('applies custom labelClassName to label element', () => {
    render(
      <SelectField {...defaultProps} labelClassName='custom-label-class' />
    );

    const label = screen.getByText('Test Select');
    expect(label).toHaveClass('custom-label-class');
  });

  it('passes through additional select props', () => {
    render(<SelectField {...defaultProps} disabled />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('renders all provided options', () => {
    render(<SelectField {...defaultProps} />);

    const select = screen.getByRole('combobox');
    const options = select.querySelectorAll('option');

    // +1 for the empty placeholder option
    expect(options).toHaveLength(mockOptions.length + 1);

    mockOptions.forEach((option, index) => {
      expect(options[index + 1]).toHaveValue(option.value);
      expect(options[index + 1]).toHaveTextContent(option.label);
    });
  });

  it('shows loading state correctly', () => {
    render(<SelectField {...defaultProps} loading />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });

  it('maintains accessibility when disabled', () => {
    render(<SelectField {...defaultProps} disabled />);

    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
  });
});
