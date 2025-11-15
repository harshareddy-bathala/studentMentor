import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Login from '@/features/auth/components/Login';
import { User } from '@/features/auth/types';

describe('Login Component', () => {
  it('renders login form', () => {
    const mockOnLoginSuccess = (_user: User) => {};
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    // Check if the component renders
    expect(screen.getByText(/Student Mentor AI/i)).toBeInTheDocument();
  });

  it('displays login buttons', () => {
    const mockOnLoginSuccess = (_user: User) => {};
    render(<Login onLoginSuccess={mockOnLoginSuccess} />);
    
    // Check if login buttons exist
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});
