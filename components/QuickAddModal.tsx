import React, { useState } from 'react';
import { X, Calendar, Clock, Tag, Save, Timer, Loader2 } from 'lucide-react';
import { format, setHours, setMinutes } from 'date-fns';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from './ToastProvider';
import { User } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  supabase: SupabaseClient | null;
  user: User | null;
  initialDate: Date;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, supabase, user, initialDate }) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [calendar, setCalendar] = useState('Family');
  const [isAllDay, setIsAllDay] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [startTimeStr, setStartTimeStr] = useState('09:00');
  const [endTimeStr, setEndTimeStr] = useState('10:00');

  if (!isOpen) return null;

  const colors = [
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Purple', hex: '#8B5CF6' },
    { name: 'Orange', hex: '#F59E0B' },
  ];

  const handleSave = async () => {
    if (!title || !supabase || !user) return;

    setIsSaving(true);
    let finalStart = initialDate;
    let finalEnd = initialDate;

    if (!isAllDay) {
      const [sH, sM] = startTimeStr.split(':').map(Number);
      const [eH, eM] = endTimeStr.split(':').map(Number);
      finalStart = setHours(setMinutes(initialDate, sM), sH);
      finalEnd = setHours(setMinutes(initialDate, eM), eH);
    }

    try {
      const { error } = await supabase.from('calendar_events').insert([{
        title,
        start_time: finalStart.toISOString(),
        end_time: finalEnd.toISOString(),
        calendar_name: calendar,
        color,
        is_all_day: isAllDay,
        user_id: user.id
      }]);

      if (error) throw error;
      
      showToast("Event posted to family board", "success");
      setTitle('');
      onClose();
    } catch (err: any) {
      showToast(err.message || "Failed to save event", "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-[#F4F1EA] border border-[#E2DDD3] rounded-[3.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <header className="p-10 border-b border-[#E2DDD3] flex items-center justify-between bg-white/50">
          <div>
            <h3 className="text-3xl font-bold text-[#2D2926]">New Event</h3>
            <p className="text-zinc-500 font-medium">{format(initialDate, 'EEEE, MMMM d')}</p>
          </div>
          <button onClick={onClose} className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-zinc-400 hover:text-[#2D2926] shadow-sm transition-all">
            <X size={24} />
          </button>
        </header>

        <div className="p-10 space-y-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Entry Title</label>
            <input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Soccer, Dinner, Grocery..."
              className="w-full bg-transparent text-4xl font-light outline-none placeholder:text-zinc-200 text-[#2D2926] tracking-tight"
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-[#E2DDD3] rounded-3xl space-y-3 shadow-sm">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <Tag size={14} /> Category
              </label>
              <select 
                value={calendar}
                onChange={(e) => setCalendar(e.target.value)}
                className="w-full bg-transparent font-bold text-[#2D2926] outline-none appearance-none cursor-pointer"
              >
                <option value="Family">Family</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="School">School</option>
              </select>
            </div>
            <div className="p-6 bg-white border border-[#E2DDD3] rounded-3xl flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Clock size={14} /> Duration
                </label>
                <div className="font-bold text-[#2D2926]">{isAllDay ? 'All Day' : 'Fixed Time'}</div>
              </div>
              <button 
                onClick={() => setIsAllDay(!isAllDay)}
                className={`w-14 h-8 rounded-full p-1.5 transition-colors shadow-inner ${isAllDay ? 'bg-[#2D2926]' : 'bg-zinc-200'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${isAllDay ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {!isAllDay && (
            <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
              <div className="p-6 bg-white border border-[#E2DDD3] rounded-3xl space-y-3 shadow-sm">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Timer size={14} /> Starts
                </label>
                <input 
                  type="time" 
                  value={startTimeStr}
                  onChange={(e) => setStartTimeStr(e.target.value)}
                  className="w-full bg-transparent font-bold text-[#2D2926] outline-none text-2xl tabular-nums"
                />
              </div>
              <div className="p-6 bg-white border border-[#E2DDD3] rounded-3xl space-y-3 shadow-sm">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                  <Timer size={14} /> Ends
                </label>
                <input 
                  type="time" 
                  value={endTimeStr}
                  onChange={(e) => setEndTimeStr(e.target.value)}
                  className="w-full bg-transparent font-bold text-[#2D2926] outline-none text-2xl tabular-nums"
                />
              </div>
            </div>
          )}

          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-2">Display Color</label>
            <div className="flex flex-wrap gap-5">
              {colors.map(c => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-14 h-14 rounded-full transition-all flex items-center justify-center shadow-lg ${color === c.hex ? 'ring-4 ring-[#2D2926] ring-offset-4 ring-offset-[#F4F1EA] scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: c.hex }}
                >
                  {color === c.hex && <div className="w-3 h-3 bg-white rounded-full shadow-inner" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <footer className="p-10 bg-white/50 border-t border-[#E2DDD3]">
          <button 
            onClick={handleSave}
            disabled={!title || isSaving}
            className="w-full h-20 bg-[#2D2926] text-[#F4F1EA] rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 hover:scale-[0.98] transition-all active:scale-95 disabled:opacity-10 shadow-2xl"
          >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Posting...' : 'Post to Dashboard'}
          </button>
        </footer>
      </div>
    </div>
  );
};