/**
 * ChatInterface Component
 * 
 * Shared chat UI component with ChatGPT-style interface:
 * - Message bubbles (user on right, AI on left)
 * - Typing indicator with animated dots
 * - Multiline input composer (Enter to send, Shift+Enter for newline)
 * - Suggested prompts as clickable chips
 * - Auto-scroll to bottom on new messages
 * - Accessible with aria-live regions
 * 
 * This component can be used in both full-page Chat view and ChatDrawer.
 * 
 * Props:
 * - messages: ChatMessage[] - Message history
 * - isLoading: boolean - Show typing indicator
 * - onSendMessage: (message: string) => void - Send callback
 * - suggestedPrompts?: string[] - Optional prompt chips
 * - studentName?: string - For context display
 * - grade?: string - For context display
 * - compact?: boolean - Compact mode for drawer
 */

import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  suggestedPrompts?: string[];
  studentName?: string;
  grade?: string;
  compact?: boolean;
  showHeader?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
  suggestedPrompts = [],
  studentName,
  grade,
  compact = false,
  showHeader = true,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    onSendMessage(input.trim());
    setInput('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg">
      {/* Header (optional) */}
      {showHeader && (
        <div className="flex-shrink-0 p-4 border-b border-slate-800 bg-panel">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-from to-primary-to rounded-full flex items-center justify-center text-white font-bold shadow-md">
                AI
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-green rounded-full border-2 border-panel"></div>
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Your AI Mentor</h2>
              {studentName && grade && (
                <p className="text-xs text-muted-ink">
                  {studentName} • {grade}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto ${compact ? 'p-3' : 'p-4 sm:p-6'} space-y-4`}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-ink">
              <p className="text-sm">Start a conversation with your AI Mentor</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              message={msg}
              compact={compact}
              timestamp={formatTimestamp(msg.timestamp)}
            />
          ))
        )}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-from to-primary-to rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              AI
            </div>
            <div className="bg-chat-bubble-ai rounded-2xl rounded-bl-md px-4 py-3 max-w-xs sm:max-w-md">
              <TypingIndicator />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts (show when no messages and not loading) */}
      {messages.length === 0 && !isLoading && suggestedPrompts.length > 0 && (
        <div className={`flex-shrink-0 ${compact ? 'px-3 pb-2' : 'px-4 sm:px-6 pb-3'}`}>
          <p className="text-xs text-muted-ink mb-2">💡 Suggested prompts:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 bg-panel-elevated hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 rounded-lg transition-colors border border-card-border hover:border-discrete-highlight"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Composer */}
      <div className={`flex-shrink-0 border-t border-slate-800 bg-panel ${compact ? 'p-3' : 'p-4'}`}>
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything... (Shift+Enter for new line)"
              disabled={isLoading}
              rows={1}
              className="w-full px-4 py-3 bg-panel-elevated border border-slate-700 rounded-xl text-white placeholder-muted-ink focus:outline-none focus:ring-2 focus:ring-discrete-highlight focus:border-transparent transition-all disabled:opacity-50 resize-none max-h-32 overflow-y-auto"
              aria-label="Message input"
              style={{ minHeight: '48px' }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-slate-600">
              {input.length > 0 && `${input.length} chars`}
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-primary-from to-primary-to text-white hover:shadow-lg disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-chat-bg focus:ring-discrete-highlight shadow-md"
            aria-label="Send message"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </form>
        
        <p className="text-xs text-slate-600 text-center mt-2">
          AI mentor powered by Gemini • Press Enter to send
        </p>
      </div>
    </div>
  );
};

/**
 * ChatBubble Component
 * Individual message bubble with role-based styling
 */

interface ChatBubbleProps {
  message: ChatMessage;
  compact?: boolean;
  timestamp: string;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, compact = false, timestamp }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3 animate-fade-in-up`}>
      {/* AI Avatar (left side) */}
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-primary-from to-primary-to rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          AI
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-xs sm:max-w-md lg:max-w-lg`}>
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-chat-bubble-user text-white rounded-br-md'
              : 'bg-chat-bubble-ai text-slate-100 rounded-bl-md'
          } shadow-sm`}
        >
          <p className={`whitespace-pre-wrap break-words ${compact ? 'text-sm' : 'text-sm sm:text-base'}`}>
            {message.content}
          </p>
        </div>
        
        <span className={`text-xs text-slate-600 mt-1 ${compact ? 'hidden' : 'block'}`}>
          {timestamp}
        </span>
      </div>

      {/* User Avatar (right side) */}
      {isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-discrete-highlight rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
};

/**
 * TypingIndicator Component
 * Animated three-dot typing indicator
 */

const TypingIndicator: React.FC = () => (
  <div className="flex items-center gap-1" role="status" aria-label="AI is typing">
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
  </div>
);

export default ChatInterface;
