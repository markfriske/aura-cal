import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { CalendarEvent } from '../types';
import { Stars, Send, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  events: CalendarEvent[];
  isPro?: boolean;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ events }) => {
  const [messages, setMessages] = useState([{ role: 'assistant', text: "How can I help your family today?" }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: { 
          systemInstruction: "You are Aura, a wall-mounted family assistant. Be concise, warm, and helpful. You are helping a family stay organized." 
        }
      });
      
      const text = response.text || "I'm sorry, I couldn't process that request right now.";
      setMessages(prev => [...prev, { role: 'assistant', text }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', text: "I'm having trouble connecting to my AI brain. Please check your internet connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full max-w-2xl mx-auto flex flex-col bg-zinc-900/50 rounded-[3rem] border border-zinc-800 overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-zinc-800 flex items-center gap-4 bg-zinc-900/50">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Stars size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">Aura AI</h2>
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Family Intelligence</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((m, i) => {
          const isUser = m.role === 'user';
          const alignmentClass = isUser ? 'justify-end' : 'justify-start';
          const bubbleClass = isUser 
            ? 'bg-white text-black rounded-tr-none shadow-xl' 
            : 'bg-zinc-800 text-white rounded-tl-none border border-zinc-700';
          
          return (
            <div key={i} className={`flex ${alignmentClass} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`p-5 rounded-2xl max-w-[85%] text-lg font-medium leading-relaxed ${bubbleClass}`}>
                {m.text}
              </div>
            </div>
          );
        })}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none border border-zinc-700 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-zinc-500" />
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 bg-black/40 border-t border-zinc-800">
        <div className="relative flex items-center gap-4 bg-zinc-800 p-2 rounded-3xl border border-zinc-700 shadow-inner">
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSend()} 
            placeholder="Ask Aura something..." 
            className="flex-1 bg-transparent rounded-2xl px-6 py-4 outline-none text-white text-lg placeholder:text-zinc-600"
            disabled={isLoading}
          />
          <button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="p-4 bg-white text-black rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-xl"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};