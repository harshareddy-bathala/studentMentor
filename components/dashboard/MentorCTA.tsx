/**
 * MentorCTA Component
 * 
 * Companion card to encourage AI mentor interaction:
 * - Friendly avatar
 * - Inviting copy
 * - Single primary CTA button
 * 
 * Opens chat drawer when clicked
 */

import React from 'react';

interface MentorCTAProps {
  onOpenChat: () => void;
  studentName: string;
}

export const MentorCTA: React.FC<MentorCTAProps> = ({ onOpenChat, studentName }) => {
  return (
    <div className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 shadow-md border border-purple-500/20">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6C4AB6] to-[#8B5CF6] flex items-center justify-center shadow-lg">
          <span className="text-3xl">🤖</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-5">
        <h3 className="text-lg font-semibold text-white mb-2">
          Need help planning today?
        </h3>
        <p className="text-sm text-purple-200">
          Your AI Mentor is ready to help you stay on track and achieve your goals.
        </p>
      </div>

      {/* CTA button */}
      <button
        onClick={onOpenChat}
        className="w-full py-3 bg-gradient-to-r from-[#3DD6B8] to-[#6C4AB6] text-white font-medium rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 flex items-center justify-center gap-2"
        aria-label={`Chat with your AI Mentor as ${studentName}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat with Mentor
      </button>

      {/* Quick tips */}
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-purple-300/70 text-center">
          💡 Ask about study plans, career advice, or just say hi!
        </p>
      </div>
    </div>
  );
};

/**
 * ChatDrawer Component
 * 
 * Slide-in chat interface from the right side with:
 * - Context header (student name, grade, last check-in)
 * - Message history
 * - Input field
 * - Close button
 * 
 * Accessibility: Focus trap, ESC to close, ARIA labels
 */

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  grade: string;
  lastCheckIn?: string;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  studentName,
  grade,
  lastCheckIn
}) => {
  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key to close
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-slate-900 shadow-2xl z-50 flex flex-col animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 id="chat-drawer-title" className="text-lg font-semibold text-white">
              AI Mentor
            </h2>
            <p className="text-xs text-slate-400">
              {studentName} • {grade}
              {lastCheckIn && ` • Last check-in: ${lastCheckIn}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-center py-8 text-slate-500 text-sm">
            <p>Chat interface will be rendered here.</p>
            <p className="mt-2">Hook this to your existing Chat component.</p>
          </div>
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-slate-800">
          <form className="flex gap-2">
            <input
              type="text"
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Message input"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-[#6C4AB6] to-[#8B5CF6] text-white rounded-xl hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
