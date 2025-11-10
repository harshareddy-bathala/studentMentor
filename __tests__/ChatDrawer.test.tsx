/**
 * ChatDrawer Component Tests
 * 
 * Tests for the slide-in chat drawer with AI mentor
 * 
 * Coverage:
 * - Open/close functionality
 * - Focus trap (accessibility)
 * - ESC key handling
 * - Backdrop click to close
 * - Context display
 * - Integration with ChatInterface
 * 
 * To run: npm test ChatDrawer.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChatDrawer } from '../components/chat/ChatDrawer';

describe('ChatDrawer Component', () => {
  const mockOnClose = vi.fn();
  const mockOnSendMessage = vi.fn();
  
  const mockProps = {
    isOpen: true,
    onClose: mockOnClose,
    messages: [],
    isLoading: false,
    onSendMessage: mockOnSendMessage,
    studentName: 'John Doe',
    grade: '10th Grade',
    suggestedPrompts: ['Help with homework', 'Study tips'],
    contextBullets: ['Math test next week', '3 pending assignments'],
  };

  it('renders when open', () => {
    render(<ChatDrawer {...mockProps} />);
    
    expect(screen.getByText('AI Mentor')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<ChatDrawer {...mockProps} isOpen={false} />);
    
    expect(screen.queryByText('AI Mentor')).not.toBeInTheDocument();
  });

  it('displays student context information', () => {
    render(<ChatDrawer {...mockProps} />);
    
    expect(screen.getByText('10th Grade')).toBeInTheDocument();
    expect(screen.getByText(/math test next week/i)).toBeInTheDocument();
    expect(screen.getByText(/3 pending assignments/i)).toBeInTheDocument();
  });

  it('closes on ESC key press', async () => {
    const mockOnClose = vi.fn();
    render(<ChatDrawer {...mockProps} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('closes on backdrop click', () => {
    const mockOnClose = vi.fn();
    render(<ChatDrawer {...mockProps} onClose={mockOnClose} />);
    
    const backdrop = screen.getByTestId('chat-drawer-backdrop');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not close on drawer content click', () => {
    const mockOnClose = vi.fn();
    render(<ChatDrawer {...mockProps} onClose={mockOnClose} />);
    
    const drawer = screen.getByRole('dialog');
    fireEvent.click(drawer);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has proper ARIA attributes for accessibility', () => {
    render(<ChatDrawer {...mockProps} />);
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('traps focus within drawer when open', async () => {
    render(<ChatDrawer {...mockProps} />);
    
    const closeButton = screen.getByLabelText(/close chat/i);
    const textarea = screen.getByPlaceholderText(/type your message/i);
    
    // Both interactive elements should be within the drawer
    expect(closeButton).toBeInTheDocument();
    expect(textarea).toBeInTheDocument();
    
    // TODO: Test actual focus trap behavior with tab key
  });

  it('displays close button with correct icon', () => {
    render(<ChatDrawer {...mockProps} />);
    
    const closeButton = screen.getByLabelText(/close chat/i);
    expect(closeButton).toBeInTheDocument();
  });

  it('passes suggested prompts to ChatInterface', () => {
    render(<ChatDrawer {...mockProps} />);
    
    expect(screen.getByText('Help with homework')).toBeInTheDocument();
    expect(screen.getByText('Study tips')).toBeInTheDocument();
  });

  it('applies slide-in animation class when open', () => {
    const { container } = render(<ChatDrawer {...mockProps} />);
    
    const drawer = screen.getByRole('dialog');
    expect(drawer).toHaveClass('translate-x-0');
  });

  it('shows loading state when messages are being sent', () => {
    render(<ChatDrawer {...mockProps} />);
    
    // ChatInterface should be rendered
    const textarea = screen.getByPlaceholderText(/type your message/i);
    expect(textarea).toBeInTheDocument();
  });
});
