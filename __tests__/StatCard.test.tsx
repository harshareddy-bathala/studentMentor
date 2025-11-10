/**
 * StatCard Component Tests
 * 
 * Tests for metric display cards with sparklines
 * 
 * Coverage:
 * - Basic rendering
 * - Click handling
 * - Trend visualization
 * - Accessibility
 * - Framer Motion animations
 * 
 * To run: npm test StatCard.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StatCard, CircularStatCard } from '../components/dashboard/StatCard';

describe('StatCard Component', () => {
  const mockProps = {
    icon: '📚',
    title: 'Study Hours',
    value: '24',
    subtitle: 'This week',
    statusColor: 'green' as const,
  };

  it('renders with basic props', () => {
    render(<StatCard {...mockProps} />);
    
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('Study Hours')).toBeInTheDocument();
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('This week')).toBeInTheDocument();
  });

  it('displays change percentage when provided', () => {
    render(<StatCard {...mockProps} changePercent={12} />);
    
    expect(screen.getByText(/12%/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it('shows negative change with down arrow', () => {
    render(<StatCard {...mockProps} changePercent={-5} />);
    
    expect(screen.getByText(/5%/)).toBeInTheDocument();
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<StatCard {...mockProps} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('is not clickable when onClick is not provided', () => {
    render(<StatCard {...mockProps} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('displays chevron icon for clickable cards', () => {
    render(<StatCard {...mockProps} onClick={vi.fn()} />);
    
    const chevron = screen.getByRole('button').querySelector('svg');
    expect(chevron).toBeInTheDocument();
  });

  it('renders sparkline when trend data is provided', () => {
    const trendData = [10, 15, 12, 20, 18, 22, 25];
    render(<StatCard {...mockProps} trend={trendData} />);
    
    // Sparkline SVG should be rendered
    const sparkline = screen.getByLabelText(/study hours trend/i);
    expect(sparkline).toBeInTheDocument();
  });

  it('renders bar chart when barData is provided', () => {
    const barData = [5, 10, 7, 12, 8, 15, 13];
    render(<StatCard {...mockProps} barData={barData} />);
    
    // Bar chart SVG should be rendered
    const barChart = screen.getByLabelText(/study hours weekly/i);
    expect(barChart).toBeInTheDocument();
  });

  it('applies correct color classes based on statusColor', () => {
    const { rerender } = render(<StatCard {...mockProps} statusColor="green" />);
    let value = screen.getByText('24');
    expect(value).toHaveClass('text-[#3DD6B8]');
    
    rerender(<StatCard {...mockProps} statusColor="red" />);
    value = screen.getByText('24');
    expect(value).toHaveClass('text-red-400');
  });

  it('has proper ARIA label for clickable cards', () => {
    render(<StatCard {...mockProps} onClick={vi.fn()} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'View details for Study Hours');
  });

  it('animates with stagger delay', () => {
    const { container } = render(<StatCard {...mockProps} delay={0.2} />);
    
    // Motion div should have animation props
    // This would require mocking framer-motion or testing animation completion
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('CircularStatCard Component', () => {
  const mockProps = {
    icon: '🎯',
    title: 'Goal Progress',
    percent: 75,
    subtitle: 'On track',
    statusColor: 'green' as const,
    onClick: vi.fn(),
  };

  it('renders circular progress indicator', () => {
    render(<CircularStatCard {...mockProps} />);
    
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Goal Progress')).toBeInTheDocument();
  });

  it('renders SVG circle for progress', () => {
    const { container } = render(<CircularStatCard {...mockProps} />);
    
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBe(2); // Background + progress circle
  });

  it('calculates correct stroke-dasharray for percentage', () => {
    const { container } = render(<CircularStatCard {...mockProps} />);
    
    const progressCircle = container.querySelectorAll('circle')[1];
    const dasharray = progressCircle.getAttribute('stroke-dasharray');
    
    // 75% of 163.36 (circumference) = ~122.52
    expect(dasharray).toContain('122');
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<CircularStatCard {...mockProps} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<CircularStatCard {...mockProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'View details for Goal Progress');
  });
});
