import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ViewMode, CalendarEvent, FamilyNote, User, AppSettings, ShoppingListItem, CalendarSource } from './types';

// Component Imports
import { Sidebar } from './components/Sidebar';
import { CalendarGrid } from './components/CalendarGrid';
import { WeekView } from './components/WeekView';
import { ListView } from './components/ListView';
import { FamilyBoard } from './components/FamilyBoard';
import { AIAssistant } from './components/AIAssistant';
import { ConnectionsView } from './components/ConnectionsView';
import { SettingsView } from './components/SettingsView';
import { LegalView } from './components/LegalView';
import { AuthView } from './components/AuthView';
import { OnboardingWizard } from './components/OnboardingWizard';
import { ToastProvider, useToast } from './components/ToastProvider';
import { AmbientMode } from './components/AmbientMode';
import { WeatherWidget } from './components/WeatherWidget';
import { QuickAddModal } from './components/QuickAddModal';
import { AdminView } from './components/AdminView';
import { LaunchChecklist } from './components/LaunchChecklist';
import { SwiftUIDocs } from './components/SwiftUIDocs';

import { Menu, Plus } from 'lucide-react';

const SUPABASE_URL = "https://qxcxntwiuqsdkgelojcp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4Y3hudHdpdXFzZGtnZWxvamNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcwNTY2MjEsImV4cCI6MjA4MjYzMjYyMX0.mCFh-vEJxKsKBrJjNY64IzCzcCESn8TG06OhZ6-zPyA";

const INITIAL_SETTINGS: AppSettings = {
  familyDisplayName: 'Our Home',
  onboardingComplete: false,
  ambientModeEnabled: true,
  members: ['Family'],
  isPro: false,
  activeTheme: 'ethereal',
  lowPowerMode: false,
  calendars: []
};

const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.CALENDAR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notes, setNotes] = useState<FamilyNote[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [weather, setWeather] = useState<any>(null);
  const [realtimeStatus, setRealtimeStatus] = useState<any>('CONNECTING');

  const supabase = useMemo(() => {
    try {
      return createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
      return null;
    }
  }, []);

  const isAdmin = user?.email === 'auracalteam@gmail.com';

  // Persist settings whenever they change
  useEffect(() => {
    if (!supabase || !user || !settings.onboardingComplete) return;
    
    const saveSettings = async () => {
       const { error } = await supabase.from('households').upsert({
         id: user.id,
         family_display_name: settings.familyDisplayName,
         is_pro: settings.isPro,
         members: settings.members,
         calendars: settings.calendars, // Persisting as JSONB
         low_power_mode: settings.lowPowerMode,
         updated_at: new Date().toISOString()
       });
       if (error) console.error("Error saving household settings:", error);
    };

    saveSettings();
  }, [settings, supabase, user]);

  useEffect(() => {
    if (!supabase || !user) return;

    const syncData = async () => {
      try {
        const { data: householdData } = await supabase.from('households').select('*').eq('id', user.id).single();
        if (householdData) {
          setSettings({
            familyDisplayName: householdData.family_display_name,
            isPro: householdData.is_pro,
            members: householdData.members || [],
            calendars: householdData.calendars || [],
            lowPowerMode: householdData.low_power_mode,
            onboardingComplete: true,
            ambientModeEnabled: true,
          });
        }

        const { data: eventData } = await supabase.from('calendar_events').select('*');
        if (eventData) {
          setEvents(eventData.map(e => ({
            ...e,
            startTime: new Date(e.start_time),
            endTime: new Date(e.end_time),
            calendarName: e.calendar_name,
            isAllDay: e.is_all_day
          })));
        }

        const { data: notesData } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
        if (notesData) setNotes(notesData);
        
        const { data: shopData } = await supabase.from('shopping_list').select('*').order('created_at', { ascending: false });
        if (shopData) setShoppingList(shopData);
      } catch (err) {
        console.error("Sync Error:", err);
      }
    };

    syncData();

    const channel = supabase.channel('family-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'shopping_list' }, syncData)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'households', filter: `id=eq.${user.id}` }, syncData)
      .subscribe((status) => setRealtimeStatus(status));

    return () => { supabase.removeChannel(channel); };
  }, [supabase, user]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current_weather=true&temperature_unit=fahrenheit');
        const data = await res.json();
        if (data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            conditionCode: data.current_weather.weathercode,
            city: 'Home',
          });
        }
      } catch (e) {}
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000); 
    return () => clearInterval(interval);
  }, []);

  const renderContent = () => {
    if (!user) return <AuthView onLogin={setUser} supabase={supabase} />;
    if (!settings.onboardingComplete) return <OnboardingWizard onComplete={(data) => setSettings({...settings, ...data, onboardingComplete: true})} />;
    if (viewMode === ViewMode.AMBIENT) return <AmbientMode familyName={settings.familyDisplayName} events={events} settings={settings} onExit={() => setViewMode(ViewMode.CALENDAR)} supabase={supabase} />;

    switch (viewMode) {
      case ViewMode.CALENDAR: return <CalendarGrid currentDate={new Date()} events={events} onDateClick={(d) => { setSelectedDate(d); setIsQuickAddOpen(true); }} />;
      case ViewMode.WEEK: return <WeekView currentDate={new Date()} events={events} />;
      case ViewMode.LIST: return <ListView events={events} />;
      case ViewMode.BOARD: return <FamilyBoard notes={notes} shoppingList={shoppingList} supabase={supabase} user={user} members={settings.members} isPro={settings.isPro} />;
      case ViewMode.AI_ASSISTANT: return <AIAssistant events={events} isPro={settings.isPro} />;
      case ViewMode.CONNECTIONS: return <ConnectionsView settings={settings} setSettings={setSettings} onSync={async () => {}} setViewMode={setViewMode} />;
      case ViewMode.SETTINGS: return <SettingsView settings={settings} setSettings={setSettings} user={user} onLogout={() => setUser(null)} onDeleteAccount={() => {}} supabase={supabase} />;
      case ViewMode.LEGAL: return <LegalView />;
      case ViewMode.ADMIN: return <AdminView user={user} supabase={supabase} />;
      case ViewMode.DIAGNOSTICS: return <LaunchChecklist dbStatus="connected" realtimeStatus={realtimeStatus} onRetry={() => {}} />;
      case ViewMode.DOCS: return <SwiftUIDocs />;
      default: return <CalendarGrid currentDate={new Date()} events={events} onDateClick={(d) => { setSelectedDate(d); setIsQuickAddOpen(true); }} />;
    }
  };

  const isAmbient = viewMode === ViewMode.AMBIENT;

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row bg-[#F4F1EA] text-[#2D2926] overflow-hidden select-none safe-area-padding">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] z-[100]"></div>

      {user && settings.onboardingComplete && !isAmbient && (
        <div className={`hidden md:block transition-all duration-500 ease-in-out h-full shrink-0 ${isSidebarOpen ? 'w-80' : 'w-0 overflow-hidden opacity-0'}`}>
          <Sidebar currentDate={new Date()} viewMode={viewMode} setViewMode={setViewMode} familyDisplayName={settings.familyDisplayName} onToggleCollapse={() => setIsSidebarOpen(false)} isAdmin={isAdmin} />
        </div>
      )}

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {user && settings.onboardingComplete && !isAmbient && (
          <header className="px-6 md:px-10 py-6 md:py-8 flex justify-between items-center z-40 bg-gradient-to-b from-[#F4F1EA] to-transparent shrink-0">
            <div className="flex items-center gap-4">
              {!isSidebarOpen && <button onClick={() => setIsSidebarOpen(true)} className="p-4 bg-white/80 backdrop-blur-xl rounded-2xl text-[#2D2926] shadow-xl border border-[#E2DDD3]"><Menu size={24} /></button>}
              <div className="hidden sm:block"><WeatherWidget data={weather} /></div>
            </div>
            <button onClick={() => { setSelectedDate(new Date()); setIsQuickAddOpen(true); }} className="bg-[#2D2926] text-[#F4F1EA] px-8 py-4 rounded-[2rem] font-black uppercase tracking-[0.15em] text-[10px] md:text-xs flex items-center gap-3 shadow-xl hover:scale-105 active:scale-95 transition-all"><Plus size={18} /> New Entry</button>
          </header>
        )}

        <div className={`flex-1 w-full overflow-hidden transition-all duration-500 ${isAmbient ? 'p-0' : 'px-6 md:px-10 pb-10'}`}>
          {renderContent()}
        </div>

        {user && settings.onboardingComplete && !isAmbient && isSidebarOpen && (
          <div className="fixed inset-0 z-[60] flex">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="relative w-80 h-full bg-[#F4F1EA] shadow-2xl animate-in slide-in-from-left duration-300">
               <Sidebar currentDate={new Date()} viewMode={viewMode} setViewMode={(v) => { setViewMode(v); setIsSidebarOpen(false); }} familyDisplayName={settings.familyDisplayName} onToggleCollapse={() => setIsSidebarOpen(false)} isAdmin={isAdmin} />
            </div>
          </div>
        )}

        <QuickAddModal 
          isOpen={isQuickAddOpen} 
          onClose={() => setIsQuickAddOpen(false)} 
          supabase={supabase}
          user={user}
          initialDate={selectedDate} 
        />
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <ToastProvider>
    <AppContent />
  </ToastProvider>
);

export default App;