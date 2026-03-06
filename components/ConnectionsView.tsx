import React, { useState } from 'react';
import { 
  Cloud, Globe, RefreshCw, Calendar, Smartphone, Heart, 
  ChevronRight, Lock, Trash2, Plus, Zap, Sparkles, 
  Check, Mail, Briefcase, User, GraduationCap
} from 'lucide-react';
import { AppSettings, ViewMode, CalendarSource } from '../types';
import { useToast } from './ToastProvider';

interface ConnectionsViewProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
  onSync: () => Promise<void>;
  setViewMode: (v: any) => void;
}

export const ConnectionsView: React.FC<ConnectionsViewProps> = ({ settings, setSettings, onSync, setViewMode }) => {
  const { showToast } = useToast();
  const [isSyncing, setIsSyncing] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#3B82F6');
  const [newProvider, setNewProvider] = useState<CalendarSource['provider']>('other');

  const palette = [
    '#3B82F6', // Blue (Work)
    '#EF4444', // Red (Personal)
    '#10B981', // Green (Family)
    '#F59E0B', // Orange (School)
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#64748B', // Slate
    '#2D2926', // Aura Black
  ];

  const handleAddCalendar = async () => {
    if (!settings.isPro) {
      showToast("Syncing requires a Household License.", "error");
      setViewMode(ViewMode.SETTINGS);
      return;
    }

    if (!newUrl.trim() || !newName.trim()) {
      showToast("Please provide a name and URL.", "error");
      return;
    }

    setIsSyncing(true);
    try {
      const newSource: CalendarSource = {
        id: crypto.randomUUID(),
        name: newName.trim(),
        url: newUrl.trim(),
        color: newColor,
        provider: newProvider,
        lastSynced: new Date().toISOString()
      };

      const updatedCalendars = [...settings.calendars, newSource];
      setSettings({ ...settings, calendars: updatedCalendars });
      
      // Reset form
      setNewUrl('');
      setNewName('');
      setNewColor('#3B82F6');
      setNewProvider('other');
      
      await onSync();
      showToast(`${newName} linked successfully!`);
    } catch (err) {
      showToast("Couldn't sync this calendar feed.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  const removeCalendar = (id: string) => {
    const updated = settings.calendars.filter(c => c.id !== id);
    setSettings({ ...settings, calendars: updated });
    showToast("Calendar removed.");
  };

  const updateCalendarColor = (id: string, color: string) => {
    const updated = settings.calendars.map(c => 
      c.id === id ? { ...c, color } : c
    );
    setSettings({ ...settings, calendars: updated });
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google': return <Mail size={18} />;
      case 'outlook': return <Briefcase size={18} />;
      case 'icloud': return <Smartphone size={18} />;
      default: return <Calendar size={18} />;
    }
  };

  return (
    <div className="h-full max-w-5xl mx-auto space-y-12 overflow-y-auto pr-6 custom-scrollbar pb-32 px-4">
      <header className="space-y-4 pt-4">
        <div className="inline-block px-4 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-green-500">
          Sync Hub
        </div>
        <h2 className="text-6xl font-black tracking-tighter text-[#2D2926]">Connected Accounts</h2>
        <p className="text-zinc-500 text-lg max-w-2xl font-medium leading-relaxed">
          Manage your household's data sources. Each calendar is color-coded for glanceable legibility on the wall.
        </p>
      </header>

      {/* PRO PAYWALL CARD */}
      {!settings.isPro && (
        <section className="bg-[#2D2926] rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles size={160} /></div>
           <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg">
                  <Lock size={24} />
                </div>
                <h3 className="text-3xl font-black tracking-tight">Multi-Account Hub</h3>
              </div>
              <p className="text-zinc-400 text-lg max-w-xl">Connecting professional Work (MS365/Google) and Personal accounts requires a **Lifetime Household License**.</p>
              <button 
                onClick={() => setViewMode(ViewMode.SETTINGS)}
                className="bg-white text-black px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
              >
                Unlock Sync Hub ($9.99) <ChevronRight size={16} />
              </button>
           </div>
        </section>
      )}

      {/* ACTIVE CONNECTIONS LIST */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Family Syncs ({settings.calendars.length})</label>
          <div className="text-[9px] text-zinc-300 font-bold uppercase">Real-time update active</div>
        </div>
        
        <div className="grid gap-6">
          {settings.calendars.map((cal) => (
            <div key={cal.id} className="bg-white border border-[#E2DDD3] rounded-[3rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm group">
              <div className="flex items-center gap-6">
                <div 
                  className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105"
                  style={{ backgroundColor: cal.color }}
                >
                  {getProviderIcon(cal.provider)}
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-black text-[#2D2926] tracking-tight">{cal.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{cal.provider}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-300" />
                    <span className="text-[10px] font-bold text-zinc-400 truncate max-w-[200px]">{cal.url}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex gap-2 p-2 bg-[#F4F1EA] rounded-2xl border border-[#E2DDD3]">
                  {palette.slice(0, 4).map(c => (
                    <button 
                      key={c}
                      onClick={() => updateCalendarColor(cal.id, c)}
                      className={`w-6 h-6 rounded-full transition-all ${cal.color === c ? 'ring-2 ring-black scale-110' : 'opacity-40 hover:opacity-100'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <button 
                  onClick={() => removeCalendar(cal.id)} 
                  className="p-4 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {settings.calendars.length === 0 && (
            <div className="py-20 border-2 border-dashed border-[#E2DDD3] rounded-[3.5rem] text-center text-zinc-300 font-bold uppercase tracking-widest text-xs flex flex-col items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center opacity-40">
                <Globe size={40} />
              </div>
              <p>No external accounts linked yet</p>
            </div>
          )}
        </div>
      </section>

      {/* ADD NEW CONNECTION FORM */}
      <section className={`bg-white border border-[#E2DDD3] rounded-[4rem] p-12 space-y-10 shadow-sm transition-all ${!settings.isPro ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-[1.75rem] bg-[#2D2926] text-[#F4F1EA] flex items-center justify-center shadow-xl">
            <Plus size={32} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-[#2D2926]">Add a Connection</h3>
            <p className="text-sm text-zinc-500 font-medium">Link a new professional or personal feed.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Account Label</label>
             <input 
               value={newName}
               onChange={(e) => setNewName(e.target.value)}
               placeholder="Mom's Work, School Lunch, etc."
               className="w-full bg-[#F4F1EA]/50 border border-[#E2DDD3] rounded-[2rem] py-5 px-8 outline-none focus:border-[#2D2926] transition-all text-lg font-bold"
             />
           </div>
           <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Provider</label>
             <div className="flex gap-4">
               {(['icloud', 'google', 'outlook', 'other'] as const).map(p => (
                 <button 
                  key={p} 
                  onClick={() => setNewProvider(p)}
                  className={`flex-1 py-5 rounded-[2rem] border transition-all text-[10px] font-black uppercase tracking-widest ${newProvider === p ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-lg' : 'bg-white text-zinc-400 border-[#E2DDD3] hover:border-zinc-300'}`}
                 >
                   {p}
                 </button>
               ))}
             </div>
           </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Public iCal URL (.ics)</label>
          <input 
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="webcal://p20-caldav.icloud.com/..."
            className="w-full bg-[#F4F1EA]/50 border border-[#E2DDD3] rounded-[2rem] py-6 px-8 outline-none focus:border-[#2D2926] transition-all text-sm font-medium"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
           <div className="flex-1 space-y-3 w-full">
             <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-4">Dashboard Color</label>
             <div className="flex flex-wrap gap-4 p-4 bg-[#F4F1EA]/50 rounded-[2.5rem] border border-[#E2DDD3]">
               {palette.map(c => (
                 <button 
                  key={c}
                  onClick={() => setNewColor(c)}
                  className={`w-10 h-10 rounded-full transition-all ${newColor === c ? 'ring-4 ring-white ring-offset-2 ring-offset-black scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'}`}
                  style={{ backgroundColor: c }}
                 />
               ))}
             </div>
           </div>
           <button 
            onClick={handleAddCalendar}
            disabled={isSyncing || !newUrl.trim() || !newName.trim()}
            className="w-full md:w-80 h-24 bg-[#2D2926] text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-4 shadow-2xl hover:scale-[0.98] active:scale-95 transition-all disabled:opacity-20"
          >
            {isSyncing ? <RefreshCw className="animate-spin" size={24} /> : <Check size={24} />}
            {isSyncing ? 'Syncing...' : 'Link Account'}
          </button>
        </div>
      </section>
    </div>
  );
};