/**
 * MentorCTA Component
 * 
 * Companion card to encourage AI mentor interaction:
 * - Friendly avatar
 * - Inviting copy
 * - Single primary CTA button
 * 
 * Opens chat drawer when clicked
 * 
 * Updated: Uses new design system colors
 */

import React from 'react';

interface MentorCTAProps {
  onOpenChat: () => void;
  studentName: string;
}

export const MentorCTA: React.FC<MentorCTAProps> = ({ onOpenChat, studentName }) => {
  return (
    <div className="bg-gradient-to-br from-primary-from/30 to-primary-to/30 rounded-2xl p-6 shadow-card border border-card-border">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-from to-primary-to flex items-center justify-center shadow-lg">
          <span className="text-3xl">🤖</span>
        </div>
      </div>

      {/* Content */}
      <div className="text-center mb-5">
        <h3 className="text-lg font-semibold text-white mb-2">
          Need help planning today?
        </h3>
        <p className="text-sm text-muted-ink">
          Your AI Mentor is ready to help you stay on track and achieve your goals.
        </p>
      </div>

      {/* CTA button */}
      <button
        onClick={onOpenChat}
        className="w-full py-3 bg-gradient-to-r from-accent-green to-primary-to text-white font-medium rounded-xl shadow-md hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-discrete-highlight flex items-center justify-center gap-2"
        aria-label={`Chat with your AI Mentor as ${studentName}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Chat with Mentor
      </button>

      {/* Quick tips */}
      <div className="mt-4 pt-4 border-t border-card-border">
        <p className="text-xs text-slate-500 text-center">
          💡 Ask about study plans, career advice, or just say hi!
        </p>
      </div>
    </div>
  );
};

// Note: ChatDrawer now lives at '@/features/chat/components/ChatDrawer'.
