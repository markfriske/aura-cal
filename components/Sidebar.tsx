import React from 'react';
import { format } from 'date-fns';
import { ViewMode } from '../types';
import { 
  LayoutGrid, 
  Settings, 
  PanelLeftClose, 
  Sparkles, 
  Calendar, 
  List, 
  StickyNote, 
  Link2, 
  Layout,
  Smartphone,
  Activity,
  Box
} from 'lucide-react';

interface SidebarProps {
  currentDate: Date;
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  familyDisplayName: string;
  onToggleCollapse: () => void;
  isAdmin: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ viewMode, setViewMode, familyDisplayName, onToggleCollapse, isAdmin }) => {
  const navItems = [
    { mode: ViewMode.CALENDAR, label: 'Monthly View', icon: LayoutGrid },
    { mode: ViewMode.WEEK, label: 'Week View', icon: Calendar },
    { mode: ViewMode.LIST, label: 'Agenda', icon: List },
    { mode: ViewMode.BOARD, label: 'Family Board', icon: StickyNote },
    { mode: ViewMode.AI_ASSISTANT, label: 'Family AI', icon: Sparkles },
    { mode: ViewMode.CONNECTIONS, label: 'Sync Hub', icon: Link2 },
  ];

  const adminItems = [
    { mode: ViewMode.ADMIN, label: 'Household Displays', icon: Smartphone },
    { mode: ViewMode.DIAGNOSTICS, label: 'Connectivity', icon: Activity },
    { mode: ViewMode.DOCS, label: 'Prep Guide', icon: Box },
  ];

  return (
    <div className="h-full bg-[#F4F1EA] p-8 flex flex-col justify-between border-r border-[#E2DDD3]">
      <div className="space-y-10 overflow-y-auto custom-scrollbar pr-2">
        <header className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="w-16 h-16 bg-[#2D2926] rounded-[2rem] flex items-center justify-center mb-6 shadow-xl">
              <Sparkles className="text-[#F4F1EA]" size={32} />
            </div>
            <div className="text-6xl font-thin text-[#2D2926] leading-none tracking-tighter tabular-nums">
              {format(new Date(), 'h:mm')}
            </div>
            <div className="text-xl font-black text-zinc-500 tracking-tight uppercase tracking-widest text-[11px]">{familyDisplayName}</div>
          </div>
          <button 
            onClick={onToggleCollapse} 
            className="p-3 text-zinc-400 hover:text-[#2D2926] hover:bg-zinc-200/50 rounded-xl transition-all"
          >
            <PanelLeftClose size={24} />
          </button>
        </header>

        <nav className="space-y-10">
          <section>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-4 mb-4">Views</div>
            <div className="space-y-2">
              {navItems.map((item) => (
                <button 
                  key={item.mode}
                  onClick={() => setViewMode(item.mode)} 
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${
                    viewMode === item.mode 
                    ? 'bg-[#2D2926] text-[#F4F1EA] shadow-xl scale-105' 
                    : 'text-zinc-500 hover:text-[#2D2926] hover:bg-zinc-200/50'
                  }`}
                >
                  <item.icon size={20} className={viewMode === item.mode ? 'text-[#F4F1EA]' : 'text-zinc-400'} /> 
                  <span className="font-black uppercase tracking-[0.15em] text-[10px]">{item.label}</span>
                </button>
              ))}
            </div>
          </section>

          {isAdmin && (
            <section className="animate-in fade-in slide-in-from-bottom-2">
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 ml-4 mb-4">Home Controls</div>
              <div className="space-y-2">
                {adminItems.map((item) => (
                  <button 
                    key={item.mode}
                    onClick={() => setViewMode(item.mode)} 
                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 ${
                      viewMode === item.mode 
                      ? 'bg-indigo-600 text-white shadow-xl scale-105' 
                      : 'text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                    }`}
                  >
                    <item.icon size={18} className={viewMode === item.mode ? 'text-white' : 'text-zinc-400'} /> 
                    <span className="font-black uppercase tracking-[0.15em] text-[9px]">{item.label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </nav>
      </div>

      <div className="space-y-2 pt-6 border-t border-[#E2DDD3]">
        <button 
          onClick={() => setViewMode(ViewMode.SETTINGS)} 
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all ${
            viewMode === ViewMode.SETTINGS ? 'bg-zinc-200 text-[#2D2926]' : 'text-zinc-500 hover:text-[#2D2926]'
          }`}
        >
          <Settings size={20} />
          <span className="font-bold text-xs uppercase tracking-widest">Settings</span>
        </button>
        
        <div 
          onClick={() => setViewMode(ViewMode.AMBIENT)}
          className="mt-6 p-6 bg-white/50 rounded-[2rem] border border-[#E2DDD3] cursor-pointer hover:bg-white transition-all group shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <Layout size={18} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          <div className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">Sleep Mode</div>
        </div>
      </div>
    </div>
  );
};