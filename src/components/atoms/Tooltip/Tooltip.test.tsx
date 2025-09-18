import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tooltip from './Tooltip';

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip content='Test tooltip'>
        <button>Hover me</button>
      </Tooltip>
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter with delay', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(
      () => {
        expect(screen.getByText('Test tooltip')).toBeInTheDocument();
      },
      { timeout: 200 }
    );
  });

  it('hides tooltip on mouse leave', async () => {
    render(
      <Tooltip content='Test tooltip' delay={100}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      expect(screen.getByText('Test tooltip')).toBeInTheDocument();
    });

    fireEvent.mouseLeave(trigger);

    await waitFor(() => {
      expect(screen.queryByText('Test tooltip')).not.toBeInTheDocument();
    });
  });

  it('applies correct position classes', async () => {
    render(
      <Tooltip content='Test tooltip' position='bottom' delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveStyle({ position: 'absolute' });
    });
  });

  it('applies custom className', async () => {
    render(
      <Tooltip content='Test tooltip' className='custom-class' delay={0}>
        <button>Hover me</button>
      </Tooltip>
    );

    const trigger = screen.getByText('Hover me');
    fireEvent.mouseEnter(trigger);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveClass('custom-class');
    });
  });
});
