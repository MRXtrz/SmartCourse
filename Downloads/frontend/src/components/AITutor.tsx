import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import type { Message } from '../types';
import { Sparkles, Send, Bot, User, Loader } from 'lucide-react';

interface AITutorProps {
  courseTitle: string;
  lessonTitle: string;
}

const AITutor = ({ courseTitle, lessonTitle }: AITutorProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `👋 Hello! I'm your AI Tutor for "${courseTitle}". I'm here to help you understand "${lessonTitle}" better. Feel free to ask me any questions!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post(API_ENDPOINTS.ai.chat, {
        course_title: courseTitle,
        lesson_title: lessonTitle,
        question: input,
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.answer,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-purple-200">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
            <span>AI Tutor</span>
            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          </h3>
          <p className="text-sm text-gray-600">Your smart learning assistant</p>
        </div>
        </div>

      <div className="space-y-4 mb-4 max-h-[400px] overflow-y-auto pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500'
              }`}
            >
              {message.role === 'user' ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>
            <div
              className={`flex-1 rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  : 'bg-white text-gray-900 shadow-md border border-gray-200'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
              <p
                className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-purple-600" />
                <span className="text-gray-600">AI Tutor is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything about this lesson..."
          className="flex-1 input-field"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-2 text-center">
        💡 Tip: Ask specific questions to get the best help from your AI Tutor
      </p>
    </div>
  );
};

export default AITutor;

