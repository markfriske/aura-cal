import React, { useState } from 'react';
import { Database, RotateCw, Copy, Check, Bomb, Monitor, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useToast } from './ToastProvider';

interface LaunchChecklistProps {
  dbStatus: 'connected' | 'error' | 'checking';
  realtimeStatus: 'SUBSCRIBED' | 'TIMED_OUT' | 'CLOSED' | 'CHANNEL_ERROR' | 'CONNECTING';
  onRetry: () => void;
}

export const LaunchChecklist: React.FC<LaunchChecklistProps> = ({ dbStatus, realtimeStatus, onRetry }) => {
  const [copied, setCopied] = useState<string | null>(null);
  const { showToast } = useToast();

  const nuclearRepairScript = `-- Aura Nuclear Reset: RECREATES TABLES FROM SCRATCH
-- WARNING: THIS WILL DELETE ALL CURRENT DATA
DROP TABLE IF EXISTS public.households;
DROP TABLE IF EXISTS public.calendar_events;
DROP TABLE IF EXISTS public.notes;
DROP TABLE IF EXISTS public.shopping_list;

-- 1. HOUSEHOLDS (Persistent Settings & Pro Status)
CREATE TABLE public.households (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  family_display_name TEXT DEFAULT 'Our Home',
  is_pro BOOLEAN DEFAULT false,
  members TEXT[] DEFAULT '{}',
  calendars JSONB DEFAULT '[]', -- Complex objects for Multi-Account support
  low_power_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. CALENDAR EVENTS (Shared Household Feed)
CREATE TABLE public.calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  calendar_name TEXT DEFAULT 'Family',
  color TEXT DEFAULT '#3B82F6',
  is_all_day BOOLEAN DEFAULT false,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. NOTES
CREATE TABLE public.notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  color TEXT DEFAULT '#FFF9E6',
  assigned_to TEXT,
  category TEXT DEFAULT 'general',
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. SHOPPING LIST
CREATE TABLE public.shopping_list (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  added_by TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. DISABLE ALL SECURITY (Kiosk Mode)
ALTER TABLE public.households DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list DISABLE ROW LEVEL SECURITY;

-- 6. RE-SYNC REALTIME
DROP PUBLICATION IF EXISTS supabase_realtime;
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;`;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    showToast("Reset script copied!", "success");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col overflow-y-auto pr-6 custom-scrollbar pb-40 px-4">
      <header className="mb-12 shrink-0 pt-4">
        <div className="inline-block px-4 py-1.5 bg-[#2D2926] rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 shadow-lg text-[#F4F1EA]">
          System Recovery
        </div>
        <h2 className="text-6xl font-thin tracking-tighter mb-4 text-[#2D2926]">Cloud Health</h2>
        <p className="text-zinc-500 text-lg max-w-2xl font-medium leading-relaxed">
          Ensure your shared household database is correctly configured for real-time syncing.
        </p>
      </header>

      <section className="mb-8 bg-red-50 border border-red-200 rounded-[3rem] p-10 shadow-sm">
        <div className="flex items-start gap-6">
          <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shrink-0">
             <Bomb size={24} />
          </div>
          <div className="space-y-4 flex-1">
            <h3 className="text-2xl font-bold text-red-900">Database Initialize</h3>
            <p className="text-red-800/80 font-medium text-sm">
              Run this in your Supabase SQL Editor to create the shared Family tables.
            </p>
            <button 
              onClick={() => copyToClipboard(nuclearRepairScript, 'nuclear')}
              className="flex items-center gap-4 px-10 py-5 bg-red-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
            >
              {copied === 'nuclear' ? <Check size={20} /> : <Copy size={20} />}
              {copied === 'nuclear' ? 'Copied' : 'Copy SQL Script'}
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-10 bg-white border border-[#E2DDD3] rounded-[3rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 bg-[#F4F1EA] rounded-2xl flex items-center justify-center text-[#2D2926] shadow-inner"><Database size={28} /></div>
            <button onClick={onRetry} className="p-3 bg-[#F4F1EA] rounded-xl text-zinc-400 hover:text-[#2D2926]"><RefreshCw size={20} /></button>
          </div>
          <h3 className="text-2xl font-bold text-[#2D2926]">Database</h3>
          <div className="flex items-center gap-3 mt-2">
             <div className={`w-2.5 h-2.5 rounded-full ${dbStatus === 'connected' ? 'bg-green-500' : 'bg-zinc-300'}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{dbStatus === 'connected' ? 'Secure' : 'Reconnecting'}</span>
          </div>
        </div>
        <div className="p-10 bg-white border border-[#E2DDD3] rounded-[3rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="w-14 h-14 bg-[#F4F1EA] rounded-2xl flex items-center justify-center text-[#2D2926] shadow-inner"><Monitor size={28} /></div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Live</div>
          </div>
          <h3 className="text-2xl font-bold text-[#2D2926]">Realtime</h3>
          <div className="flex items-center gap-3 mt-2">
             {realtimeStatus === 'SUBSCRIBED' ? <Wifi size={16} className="text-green-500" /> : <WifiOff size={16} className="text-zinc-300" />}
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{realtimeStatus === 'SUBSCRIBED' ? 'Online' : 'Standby'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};