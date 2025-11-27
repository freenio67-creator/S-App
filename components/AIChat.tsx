import React, { useState, useRef, useEffect } from 'react';
import { createChatSession } from '../services/geminiService';
import { Send, Bot, User as UserIcon, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { Chat, GenerateContentResponse } from "@google/genai";

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export const AIChat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'ai', text: 'Hello! I am your AI Study Tutor. I can help with HTML, CSS, JavaScript, and more. Ask me anything!' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatSessionRef = useRef<Chat | null>(null);

  useEffect(() => {
    // Initialize chat session
    const session = createChatSession();
    if (session) {
      chatSessionRef.current = session;
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      if (!chatSessionRef.current) {
        // Fallback or re-init if session missing
        const session = createChatSession();
        if (session) chatSessionRef.current = session;
        else throw new Error("API Key missing");
      }

      const streamResult = await chatSessionRef.current!.sendMessageStream({ message: userMsg.text });
      
      const aiMsgId = (Date.now() + 1).toString();
      let fullText = '';
      
      // Add placeholder message for AI
      setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: '' }]);

      for await (const chunk of streamResult) {
        const chunkText = (chunk as GenerateContentResponse).text || '';
        fullText += chunkText;
        
        setMessages(prev => prev.map(msg => 
          msg.id === aiMsgId ? { ...msg, text: fullText } : msg
        ));
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please check your API key." }]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    const session = createChatSession();
    if (session) chatSessionRef.current = session;
    setMessages([{ id: Date.now().toString(), role: 'ai', text: 'Chat reset. How can I help you now?' }]);
  };

  const formatMessage = (text: string) => {
    // Simple parser for code blocks
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract content and optional language
        const content = part.slice(3, -3);
        const match = content.match(/^([a-z0-9]+)\n/i);
        const language = match ? match[1] : '';
        const code = match ? content.slice(match[0].length) : content;

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 shadow-sm">
            {language && <div className="bg-slate-800 px-3 py-1 text-xs text-slate-400 font-mono border-b border-slate-700">{language}</div>}
            <pre className="p-3 overflow-x-auto text-xs font-mono text-indigo-100 whitespace-pre">
              {code.trim()}
            </pre>
          </div>
        );
      }
      // Handle bold text **bold**
      const boldParts = part.split(/(\*\*.*?\*\*)/g);
      return (
        <span key={index}>
          {boldParts.map((bp, i) => {
            if (bp.startsWith('**') && bp.endsWith('**')) {
              return <strong key={i} className="font-semibold text-slate-900">{bp.slice(2, -2)}</strong>;
            }
            return <span key={i} className="whitespace-pre-wrap">{bp}</span>;
          })}
        </span>
      );
    });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-sm">
            <Sparkles className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Gemini Tutor</h2>
            <p className="text-xs text-slate-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Online & Ready
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs font-mono text-slate-400 bg-slate-200 px-2 py-1 rounded hidden sm:block">
            gemini-2.5-flash
          </div>
          <button 
            onClick={resetChat}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            title="Reset Chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end space-x-2 max-w-[85%] lg:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-white border border-slate-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
              }`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4 text-slate-600" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-slate-800 rounded-br-none border border-slate-200' 
                  : 'bg-white border border-indigo-100 text-slate-700 rounded-bl-none'
              }`}>
                {msg.role === 'ai' ? formatMessage(msg.text) : <p className="whitespace-pre-wrap">{msg.text}</p>}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex items-end space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 opacity-50">
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex space-x-1.5">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Ask a question about your code..."
            disabled={loading}
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI can make mistakes. Please verify important code snippets.
        </p>
      </div>
    </div>
  );
};