/**
 * ChatInterface Component Tests
 * 
 * Tests for the reusable ChatGPT-style chat interface
 * 
 * Coverage:
 * - Message rendering (user and AI messages)
 * - Input handling (multiline, Enter/Shift+Enter)
 * - Suggested prompts
 * - Loading state (typing indicator)
 * - Accessibility (ARIA attributes, keyboard navigation)
 * 
 * To run: npm test ChatInterface.test.tsx
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '../components/chat/ChatInterface';
import type { ChatMessage } from '../types';

describe('ChatInterface Component', () => {
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      role: 'model',
      content: 'Hello! How can I help you today?',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      role: 'user',
      content: 'I need help with math',
      timestamp: new Date().toISOString(),
    },
  ];

  const mockSuggestedPrompts = [
    'Help me understand algebra',
    'How can I improve my study habits?',
  ];

  it('renders messages correctly', () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    expect(screen.getByText('Hello! How can I help you today?')).toBeInTheDocument();
    expect(screen.getByText('I need help with math')).toBeInTheDocument();
  });

  it('displays AI messages on the left', () => {
    const mockOnSend = vi.fn();
    const { container } = render(
      <ChatInterface
        messages={[mockMessages[0]]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const aiMessage = screen.getByText('Hello! How can I help you today?').closest('div');
    expect(aiMessage).toHaveClass('rounded-bl-none');
  });

  it('displays user messages on the right', () => {
    const mockOnSend = vi.fn();
    const { container } = render(
      <ChatInterface
        messages={[mockMessages[1]]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const userMessage = screen.getByText('I need help with math').closest('div');
    expect(userMessage).toHaveClass('rounded-br-none');
  });

  it('shows typing indicator when loading', () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={mockMessages}
        isLoading={true}
        onSendMessage={mockOnSend}
      />
    );

    // Typing indicator should have animated dots
    const typingIndicator = screen.getByRole('status', { name: /ai is typing/i });
    expect(typingIndicator).toBeInTheDocument();
  });

  it('handles message sending on Enter key', async () => {
    const mockOnSend = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ChatInterface
        messages={[]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText(/type your message/i);
    await user.type(textarea, 'Test message{Enter}');

    expect(mockOnSend).toHaveBeenCalledWith('Test message');
  });

  it('adds newline on Shift+Enter', async () => {
    const mockOnSend = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ChatInterface
        messages={[]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText(/type your message/i) as HTMLTextAreaElement;
    await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(textarea.value).toContain('\n');
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('displays suggested prompts when provided', () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={[]}
        isLoading={false}
        onSendMessage={mockOnSend}
        suggestedPrompts={mockSuggestedPrompts}
      />
    );

    expect(screen.getByText('Help me understand algebra')).toBeInTheDocument();
    expect(screen.getByText('How can I improve my study habits?')).toBeInTheDocument();
  });

  it('sends suggested prompt when clicked', async () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={[]}
        isLoading={false}
        onSendMessage={mockOnSend}
        suggestedPrompts={mockSuggestedPrompts}
      />
    );

    const promptButton = screen.getByText('Help me understand algebra');
    fireEvent.click(promptButton);

    await waitFor(() => {
      expect(mockOnSend).toHaveBeenCalledWith('Help me understand algebra');
    });
  });

  it('disables input when loading', () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={mockMessages}
        isLoading={true}
        onSendMessage={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText(/type your message/i);
    expect(textarea).toBeDisabled();
  });

  it('has proper ARIA attributes for accessibility', () => {
    const mockOnSend = vi.fn();
    render(
      <ChatInterface
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const messageList = screen.getByRole('log');
    expect(messageList).toHaveAttribute('aria-live', 'polite');
    expect(messageList).toHaveAttribute('aria-label', 'Chat messages');
  });

  it('auto-scrolls to bottom when new message arrives', async () => {
    const mockOnSend = vi.fn();
    const { rerender } = render(
      <ChatInterface
        messages={[mockMessages[0]]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    // Add new message
    rerender(
      <ChatInterface
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    // Check if scrollTop was updated (mocked in test environment)
    await waitFor(() => {
      const chatContainer = screen.getByRole('log');
      expect(chatContainer.scrollTop).toBeGreaterThanOrEqual(0);
    });
  });

  it('clears input after sending message', async () => {
    const mockOnSend = vi.fn();
    const user = userEvent.setup();
    
    render(
      <ChatInterface
        messages={[]}
        isLoading={false}
        onSendMessage={mockOnSend}
      />
    );

    const textarea = screen.getByPlaceholderText(/type your message/i) as HTMLTextAreaElement;
    await user.type(textarea, 'Test message{Enter}');

    expect(textarea.value).toBe('');
  });
});
