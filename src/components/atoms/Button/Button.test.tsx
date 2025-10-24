import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders button correctly', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-primary-medium');
    expect(button).toHaveClass('text-functional-soft-lightest');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant='secondary'>Secondary</Button>);

    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-functional-heavy-medium');

    rerender(<Button variant='outline'>Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-brand-primary-medium');
    expect(button).toHaveClass('border-brand-primary-medium');

    rerender(<Button variant='ghost'>Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('border-transparent');

    rerender(<Button variant='danger'>Danger</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-feedback-danger-medium');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size='xs'>Extra Small</Button>);

    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-2', 'py-1', 'text-xs', 'rounded');

    rerender(<Button size='sm'>Small</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm', 'rounded-md');

    rerender(<Button size='md'>Medium</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'rounded-md');

    rerender(<Button size='lg'>Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-base', 'rounded-lg');

    rerender(<Button size='xl'>Extra Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-8', 'py-4', 'text-lg', 'rounded-lg');
  });

  it('handles click events correctly', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('handles disabled state correctly', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:cursor-not-allowed');
    expect(button).toHaveClass('disabled:opacity-50');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('handles loading state correctly', () => {
    const onClick = vi.fn();
    render(
      <Button isLoading loadingText='Loading...' onClick={onClick}>
        Submit
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Loading...');

    // Loading spinner should be present
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies fullWidth correctly', () => {
    render(<Button fullWidth>Full Width Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('renders left icon correctly', () => {
    const LeftIcon = () => <span data-testid='left-icon'>←</span>;
    render(<Button leftIcon={<LeftIcon />}>Button with Left Icon</Button>);

    const leftIcon = screen.getByTestId('left-icon');
    expect(leftIcon).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Button with Left Icon');
  });

  it('renders right icon correctly', () => {
    const RightIcon = () => <span data-testid='right-icon'>→</span>;
    render(<Button rightIcon={<RightIcon />}>Button with Right Icon</Button>);

    const rightIcon = screen.getByTestId('right-icon');
    expect(rightIcon).toBeInTheDocument();

    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Button with Right Icon');
  });

  it('hides icons when loading', () => {
    const LeftIcon = () => <span data-testid='left-icon'>←</span>;
    const RightIcon = () => <span data-testid='right-icon'>→</span>;

    render(
      <Button isLoading leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
        Loading Button
      </Button>
    );

    expect(screen.queryByTestId('left-icon')).not.toBeInTheDocument();
    expect(screen.queryByTestId('right-icon')).not.toBeInTheDocument();
  });

  it('applies custom className correctly', () => {
    render(<Button className='custom-class'>Custom Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('sets button type correctly', () => {
    render(<Button type='submit'>Submit Button</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<Button ref={ref}>Ref Button</Button>);

    expect(ref).toHaveBeenCalled();
  });

  it('passes through other HTML button props', () => {
    render(
      <Button
        id='test-button'
        data-testid='button-component'
        aria-label='Test button'
      >
        Props Button
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('id', 'test-button');
    expect(button).toHaveAttribute('data-testid', 'button-component');
    expect(button).toHaveAttribute('aria-label', 'Test button');
  });

  it('combines variant and state classes correctly', () => {
    render(
      <Button variant='outline' disabled>
        Outline Disabled
      </Button>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('text-brand-primary-medium');
    expect(button).toHaveClass('border-brand-primary-medium');
    expect(button).toHaveClass('disabled:opacity-50');
    expect(button).toBeDisabled();
  });
});
