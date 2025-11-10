import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Chat as GenAIChat } from '@google/genai';
import { type StudentProfile, type ChatMessage, type DailyCheckIn, type ActivityLog, type TeacherAlert, type Homework, type Test } from '../types';
import { ChatInterface } from './chat/ChatInterface';

interface ChatProps {
  profile: StudentProfile;
  checkIns: DailyCheckIn[];
  activities: ActivityLog[];
  homework?: Homework[];
  tests?: Test[];
  onAddActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onTriggerAlert?: (alert: Omit<TeacherAlert, 'id' | 'createdAt'>) => void;
}

const Chat: React.FC<ChatProps> = ({ profile, checkIns, activities, homework = [], tests = [], onAddActivity, onTriggerAlert }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  // mentorChat can be a real GenAI chat instance or a lightweight mock when API key is missing
  const [mentorChat, setMentorChat] = useState<any | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Initialize AI mentor with simple prompt
  useEffect(() => {
    const initializeMentorChat = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      // If API key is not present, fall back to a local demo/mocked chat to keep the UI functional.
      if (!apiKey) {
        console.warn("Gemini API key not found. Running AI Mentor in demo mode (mock responses).");
        setIsDemoMode(true);

        // Create a tiny mock chat with an async iterable response stream
        const mockSendMessageStream = async function* (opts: { message: string } | any) {
          const userMsg = typeof opts === 'string' ? opts : opts.message || '';
          const firstName = (profile.name && profile.name.split(' ')[0]) || profile.name;
          const reply = `Hi ${firstName}, I'm running in demo mode because the API key isn't configured. I can provide simple tips and canned answers. You asked: "${userMsg}"\n\nTry: "Help me with ${profile.subjects[0] || 'a topic'}"`;
          const chunks = reply.match(/.{1,60}/g) || [reply];
          for (const c of chunks) {
            // small delay to simulate streaming
            // eslint-disable-next-line no-await-in-loop
            await new Promise((r) => setTimeout(r, 120));
            yield { text: c };
          }
        };

        const mockChat = { sendMessageStream: mockSendMessageStream };
        setMentorChat(mockChat);

        const firstName = (profile.name && profile.name.split(' ')[0]) || profile.name;
        const welcomeMessage: ChatMessage = {
          id: `model-welcome-${Date.now()}`,
          role: 'model',
          content: `Hello ${firstName}! 👋\n\nYou're in demo mode: the AI mentor will return simulated answers so you can try the chat without an API key.`,
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
        return;
      }

      try {
        const ai = new GoogleGenAI({ apiKey });
        
        // Simple system instruction with just name, subjects, and goals
        const systemInstruction = `You are an AI personal mentor for ${profile.name}, a student in ${profile.grade}.

**STUDENT INFORMATION:**
- Name: ${profile.name}
- Grade: ${profile.grade}
- Subjects: ${profile.subjects.join(', ')}
- Dream Job: ${profile.dreamJob}
- Academic Goals: ${profile.academicGoals}
- Career Aspirations: ${profile.careerAspirations}

**YOUR ROLE:**
You are a friendly, supportive mentor who helps ${profile.name} with their studies and personal growth. 

**GUIDELINES:**
- Always use their name (${profile.name}) occasionally to personalize
- Help with homework and study strategies for their subjects: ${profile.subjects.join(', ')}
- Encourage them toward their goal of becoming ${profile.dreamJob}
- Be warm, encouraging, and age-appropriate for ${profile.grade}
- Keep responses conversational and helpful
- Ask follow-up questions to understand their needs

Remember: You're here to support ${profile.name}'s journey to becoming ${profile.dreamJob}!`;
        
        const newChat = ai.chats.create({
          model: 'gemini-2.0-flash-exp',
          config: { 
            systemInstruction,
            temperature: 0.8,
            topP: 0.95,
          },
        });
        
        setMentorChat(newChat);

        // Send welcome message
        const welcomeMessage: ChatMessage = {
          id: `model-welcome-${Date.now()}`,
          role: 'model',
          content: getWelcomeMessage(profile),
          timestamp: new Date().toISOString(),
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error("Failed to initialize mentor chat:", error);
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'model',
          content: "Hi! I'm having a bit of trouble connecting to the AI service. Please check your API key and try refreshing the page.",
          timestamp: new Date().toISOString(),
        };
        setMessages([errorMessage]);
      }
    };

    initializeMentorChat();
  }, [profile]);

  const getWelcomeMessage = (profile: StudentProfile): string => {
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening';
    
    return `Good ${timeOfDay}, ${profile.name}! 👋

I'm your personal AI mentor, here to support you in achieving your dream of becoming ${profile.dreamJob}. 

Whether you need help with ${profile.subjects[0] || 'your studies'}, want to talk about your goals, or just need someone to listen, I'm here for you. What's on your mind today?`;
  };

  const handleSendMessage = async (userMessageContent: string) => {
    if (!userMessageContent.trim() || isLoading || !mentorChat) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    
    // Helper function to send with retry
    const sendWithRetry = async (maxRetries = 2) => {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          return await mentorChat.sendMessageStream({ message: userMessageContent });
        } catch (error: any) {
          const isRateLimit = error?.message?.toLowerCase().includes('quota') || 
                             error?.message?.toLowerCase().includes('limit') ||
                             error?.message?.toLowerCase().includes('429');
          
          if (isRateLimit && attempt < maxRetries) {
            // Wait before retrying (exponential backoff)
            const waitTime = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s...
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          }
          throw error;
        }
      }
    };
    
    try {
      const responseStream = await sendWithRetry();
      const modelMessageId = `model-${Date.now()}`;
      setMessages(prev => [...prev, { 
        id: modelMessageId, 
        role: 'model', 
        content: '',
        timestamp: new Date().toISOString(),
      }]);

      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === modelMessageId ? { ...msg, content: msg.content + chunkText } : msg
        ));
      }

      // Analyze message for activity logging
      const messageType = detectMessageType(userMessageContent);
      if (messageType) {
        onAddActivity({
          studentId: profile.id,
          type: messageType.type,
          category: messageType.category,
          description: messageType.description,
        });

        // Check if we should trigger a teacher alert
        if ('shouldAlert' in messageType && messageType.shouldAlert && onTriggerAlert && 'alert' in messageType) {
          onTriggerAlert(messageType.alert!);
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      
      let userFriendlyMessage = "I'm having a little trouble thinking right now. Please try sending your message again in a moment.";
      if (error instanceof Error) {
        console.error("Error stack:", error.stack);
        if (error.message.toLowerCase().includes('api key')) {
          userFriendlyMessage = "It seems I've lost my connection. Please give me a moment and then try again.";
        } else if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('limit')) {
          userFriendlyMessage = "I'm getting too many requests right now. Please wait a moment and try again.";
        } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
          userFriendlyMessage = "I'm having trouble connecting. Please check your internet and try again.";
        }
      }
      
      setMessages(prev => [...prev, { 
        id: `error-${Date.now()}`, 
        role: 'model', 
        content: userFriendlyMessage,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const detectMessageType = (message: string): { 
    type: ActivityLog['type'], 
    category: string, 
    description: string,
    shouldAlert?: boolean,
    alert?: Omit<TeacherAlert, 'id' | 'createdAt'>
  } | null => {
    const lowerMessage = message.toLowerCase();
    
    // Critical mental health keywords - trigger immediate alert
    if (lowerMessage.includes('depressed') || lowerMessage.includes('hopeless') || 
        lowerMessage.includes('can\'t cope') || lowerMessage.includes('give up')) {
      return {
        type: 'mental-health',
        category: 'emotional-crisis',
        description: 'Expressed serious emotional distress',
        shouldAlert: true,
        alert: {
          studentId: profile.id,
          studentName: profile.name,
          alertType: 'mental-health',
          severity: 'urgent',
          title: 'Student Expressing Serious Emotional Distress',
          description: `${profile.name} has used concerning language in chat that may indicate mental health crisis.`,
          aiInsight: 'The student used language indicating potential depression or hopelessness. Immediate check-in recommended.',
          suggestedActions: [
            'Schedule immediate one-on-one conversation',
            'Contact school counselor',
            'Reach out to parents/guardians',
            'Provide mental health resources'
          ],
          relatedData: {
            recentCheckIns: checkIns.slice(0, 3),
            recentActivities: activities.slice(0, 5),
          },
          status: 'new',
        },
      };
    }
    
    // Academic struggle - ongoing pattern
    if ((lowerMessage.includes('failing') || lowerMessage.includes('don\'t understand') || 
         lowerMessage.includes('too hard') || lowerMessage.includes('can\'t do it')) &&
        checkIns.filter(c => c.academicChallengesFaced).length >= 3) {
      return {
        type: 'academic',
        category: 'struggling',
        description: 'Expressed difficulty with coursework',
        shouldAlert: true,
        alert: {
          studentId: profile.id,
          studentName: profile.name,
          alertType: 'academic-struggle',
          severity: 'high',
          title: 'Student Struggling with Academic Performance',
          description: `${profile.name} has repeatedly mentioned academic difficulties and may need extra support.`,
          aiInsight: 'Pattern detected: Student has expressed academic challenges in multiple check-ins and is seeking help.',
          suggestedActions: [
            'Arrange tutoring sessions',
            'Review study methods and materials',
            'Break down complex topics into smaller parts',
            'Consider additional practice resources'
          ],
          relatedData: {
            recentCheckIns: checkIns.slice(0, 5),
            recentActivities: activities.filter(a => a.type === 'academic').slice(0, 5),
          },
          status: 'new',
        },
      };
    }
    
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return {
        type: 'mental-health',
        category: 'emotional-support',
        description: 'Sought support for stress or anxiety',
      };
    }
    
    if (lowerMessage.includes('homework') || lowerMessage.includes('assignment') || lowerMessage.includes('study')) {
      return {
        type: 'academic',
        category: 'study-help',
        description: 'Asked for academic help',
      };
    }
    
    if (lowerMessage.includes('career') || lowerMessage.includes('future') || lowerMessage.includes('goal')) {
      return {
        type: 'achievement',
        category: 'goal-planning',
        description: 'Discussed career goals and aspirations',
      };
    }
    
    return null;
  };

  // Suggested prompts for the chat interface
  const suggestedPrompts = [
    `Help me understand ${profile.subjects[0] || 'a difficult concept'}`,
    'How can I manage my time better?',
    `What steps should I take to become ${profile.dreamJob}?`,
    'I\'m feeling stressed about exams',
  ];

  return (
    <div className="flex flex-col h-full bg-bg-dark">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-card-border bg-panel flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-from to-primary-to rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-accent-green rounded-full border-2 border-bg-dark"></div>
          </div>
          <div>
            <h1 className="text-section-title text-white">Your AI Mentor</h1>
            <p className="text-micro text-muted-ink">Always here to help you grow 🌱</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-micro text-slate-300">{profile.name}</p>
          <p className="text-micro text-muted-ink">Grade {profile.grade}</p>
        </div>
      </header>

      {/* Chat Interface */}
      <div className="flex-1 overflow-hidden">
        {!mentorChat ? (
          <div className="flex items-center justify-center h-full p-8">
            <div className="max-w-md text-center p-6 bg-panel border border-card-border rounded-2xl">
              <p className="text-section-title text-accent-amber font-medium mb-2">⚠️ API Key Required</p>
              <p className="text-body-sm text-muted-ink">
                Please configure your Gemini API key in .env.local to use the chat
              </p>
            </div>
          </div>
        ) : (
          <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              suggestedPrompts={messages.length === 1 ? suggestedPrompts : undefined}
              showHeader={false} // Header is rendered by the page wrapper to avoid duplication
            />
        )}
      </div>

      {/* Footer */}
      {mentorChat && (
        <footer className="flex-shrink-0 p-3 border-t border-card-border bg-panel">
          <p className="text-micro text-muted-ink text-center">
            AI mentor powered by Gemini • Conversation is private and supportive
          </p>
        </footer>
      )}
    </div>
  );
};

export default Chat;
