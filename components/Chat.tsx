import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat as GenAIChat } from '@google/genai';
import { type StudentProfile, type ChatMessage, type DailyCheckIn, type ActivityLog, type TeacherAlert, type Homework, type Test } from '../types';

interface ChatProps {
  profile: StudentProfile;
  checkIns: DailyCheckIn[];
  activities: ActivityLog[];
  homework?: Homework[];
  tests?: Test[];
  onAddActivity: (activity: Omit<ActivityLog, 'id' | 'timestamp'>) => void;
  onTriggerAlert?: (alert: Omit<TeacherAlert, 'id' | 'createdAt'>) => void;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
    <div className="w-2 h-2 bg-sky-400 rounded-full animate-pulse"></div>
  </div>
);

const Chat: React.FC<ChatProps> = ({ profile, checkIns, activities, homework = [], tests = [], onAddActivity, onTriggerAlert }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mentorChat, setMentorChat] = useState<GenAIChat | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Initialize AI mentor with simple prompt
  useEffect(() => {
    const initializeMentorChat = async () => {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your .env file");
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: 'model',
          content: "⚠️ API key not configured. Please add your Gemini API key to the .env file as VITE_GEMINI_API_KEY. Get your free key from: https://aistudio.google.com/app/apikey",
          timestamp: new Date().toISOString(),
        };
        setMessages([errorMessage]);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading || !mentorChat) return;

    const userMessageContent = currentMessage.trim();
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessageContent,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');

    setIsLoading(true);
    try {
      const responseStream = await mentorChat.sendMessageStream({ message: userMessageContent });
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

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.role === 'user';
    return (
      <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
        <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`px-4 py-3 rounded-2xl ${
            isUser 
              ? 'bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-br-none' 
              : 'bg-slate-700 text-slate-100 rounded-bl-none'
          }`}>
            <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
          </div>
          <p className={`text-xs text-slate-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {formatTimestamp(msg.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-800">
      {/* Header */}
      <header className="flex-shrink-0 p-4 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900"></div>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-sky-300">Your AI Mentor</h1>
            <p className="text-xs text-slate-400">Always here to help you grow 🌱</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">{profile.name}</p>
          <p className="text-xs text-slate-500">Grade {profile.grade}</p>
        </div>
      </header>

      {/* Messages */}
      <main ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6 bg-gradient-to-b from-slate-800 to-slate-900">
        {messages.map(renderMessage)}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-700 text-slate-200 rounded-bl-none">
              <TypingIndicator />
            </div>
          </div>
        )}
        
        {messages.length === 1 && !isLoading && (
          <div className="flex justify-center mt-6">
            <div className="max-w-md bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <p className="text-sm text-slate-300 text-center mb-3">💡 Quick prompts to get started:</p>
              <div className="space-y-2">
                {[
                  `Help me understand ${profile.subjects[0] || 'a difficult concept'}`,
                  'How can I manage my time better?',
                  `What steps should I take to become ${profile.dreamJob}?`,
                  'I\'m feeling stressed about exams',
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={async () => {
                      if (!mentorChat || isLoading) return;
                      
                      // Create user message
                      const userMessage: ChatMessage = {
                        id: `user-${Date.now()}`,
                        role: 'user',
                        content: prompt,
                        timestamp: new Date().toISOString(),
                      };
                      
                      setMessages(prev => [...prev, userMessage]);
                      setCurrentMessage('');

                      // Send to AI
                      setIsLoading(true);
                      try {
                        const responseStream = await mentorChat.sendMessageStream({ message: prompt });
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
                      } catch (error) {
                        console.error("Failed to send message:", error);
                        console.error("Error details:", error instanceof Error ? error.message : String(error));
                        
                        let userFriendlyMessage = "I'm having trouble responding right now. Please try again in a moment.";
                        if (error instanceof Error) {
                          if (error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('limit')) {
                            userFriendlyMessage = "I'm getting too many requests. Please wait a moment and try again.";
                          } else if (error.message.toLowerCase().includes('network') || error.message.toLowerCase().includes('fetch')) {
                            userFriendlyMessage = "Connection problem. Please check your internet and try again.";
                          }
                        }
                        
                        const errorMessage: ChatMessage = {
                          id: `error-${Date.now()}`,
                          role: 'model',
                          content: userFriendlyMessage,
                          timestamp: new Date().toISOString(),
                        };
                        setMessages(prev => [...prev, errorMessage]);
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={!mentorChat || isLoading}
                    className="w-full text-left px-3 py-2 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs text-slate-200 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Input */}
      <footer className="flex-shrink-0 p-4 border-t border-slate-700 bg-slate-900/50">
        {!mentorChat ? (
          <div className="text-center p-4 bg-orange-900/30 border border-orange-700/50 rounded-lg">
            <p className="text-orange-300 text-sm font-medium">⚠️ API Key Required</p>
            <p className="text-orange-200/70 text-xs mt-1">
              Please configure your Gemini API key in .env.local to use the chat
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask me anything... I'm here to help!"
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-full shadow-sm placeholder-slate-400 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !currentMessage.trim()}
                className="p-3 rounded-full bg-gradient-to-r from-sky-600 to-purple-600 text-white hover:from-sky-700 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 shadow-lg"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-2">
              AI mentor powered by Gemini • Conversation is private and supportive
            </p>
          </>
        )}
      </footer>
    </div>
  );
};

export default Chat;
