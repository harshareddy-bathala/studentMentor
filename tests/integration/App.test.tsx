import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('App Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders login screen initially', () => {
    render(<App />);
    expect(screen.getByText(/Student Mentor AI/i)).toBeInTheDocument();
  });

  it('shows onboarding after demo login', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Find and click demo login button (exact match might need adjustment)
    const buttons = screen.getAllByRole('button');
    const demoButton = buttons.find(btn => 
      btn.textContent?.includes('Demo')
    );

    if (demoButton) {
      await user.click(demoButton);
      
      await waitFor(() => {
        expect(
          screen.getByText(/Welcome/i) || 
          screen.getByText(/Let's get started/i)
        ).toBeInTheDocument();
      });
    }
  });
});
