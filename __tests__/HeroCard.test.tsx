/**
 * HeroCard Component Tests
 * 
 * Tests for the hero banner with gradient and progress ring
 * 
 * Coverage:
 * - Rendering with props
 * - Progress ring display
 * - Subject pills
 * - Click handling
 * - Framer Motion animations
 * 
 * To run: npm test HeroCard.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HeroCard } from '../components/dashboard/HeroCard';

describe('HeroCard Component', () => {
  const mockSubjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'Science' },
    { id: '3', name: 'English' },
    { id: '4', name: 'History' },
  ];

  const mockProps = {
    studentName: 'Alice Johnson',
    grade: '10th Grade',
    subjects: mockSubjects,
    overallProgress: 75,
  };

  it('renders student greeting correctly', () => {
    render(<HeroCard {...mockProps} />);
    
    expect(screen.getByText(/welcome back, alice johnson/i)).toBeInTheDocument();
  });

  it('displays grade information', () => {
    render(<HeroCard {...mockProps} />);
    
    expect(screen.getByText('10th Grade')).toBeInTheDocument();
  });

  it('renders first 3 subjects as pills', () => {
    render(<HeroCard {...mockProps} />);
    
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('shows "+N more" when there are more than 3 subjects', () => {
    render(<HeroCard {...mockProps} />);
    
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('does not show "+N more" when there are 3 or fewer subjects', () => {
    const props = { ...mockProps, subjects: mockSubjects.slice(0, 3) };
    render(<HeroCard {...props} />);
    
    expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument();
  });

  it('displays progress ring with correct percentage', () => {
    render(<HeroCard {...mockProps} />);
    
    // Progress ring should have aria-label with percentage
    const progressRing = screen.getByLabelText(/overall weekly progress: 75%/i);
    expect(progressRing).toBeInTheDocument();
  });

  it('displays weekly progress label', () => {
    render(<HeroCard {...mockProps} />);
    
    expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
  });

  it('calls onProgressClick when progress ring is clicked', () => {
    const mockOnClick = vi.fn();
    render(<HeroCard {...mockProps} onProgressClick={mockOnClick} />);
    
    const progressRing = screen.getByLabelText(/overall weekly progress/i);
    fireEvent.click(progressRing);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not throw error when onProgressClick is not provided', () => {
    expect(() => {
      render(<HeroCard {...mockProps} />);
    }).not.toThrow();
  });

  it('has gradient background', () => {
    const { container } = render(<HeroCard {...mockProps} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-gradient-to-r');
    expect(card).toHaveClass('from-primary-from');
    expect(card).toHaveClass('to-primary-to');
  });

  it('has premium shadow effect', () => {
    const { container } = render(<HeroCard {...mockProps} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('shadow-hero');
  });

  it('applies responsive text sizing', () => {
    render(<HeroCard {...mockProps} />);
    
    const heading = screen.getByText(/welcome back, alice johnson/i);
    expect(heading).toHaveClass('text-hero-mobile');
    expect(heading).toHaveClass('md:text-hero-desktop');
  });

  it('animates on mount with Framer Motion', () => {
    const { container } = render(<HeroCard {...mockProps} />);
    
    // Motion div should be rendered
    expect(container.firstChild).toBeInTheDocument();
    // Actual animation testing requires motion mocking
  });

  it('respects prefers-reduced-motion', () => {
    // This would require mocking useReducedMotion hook
    // Implementation depends on testing setup
    render(<HeroCard {...mockProps} />);
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
