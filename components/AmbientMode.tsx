import React, { useState, useEffect, useMemo } from 'react';
import { format, isSameDay, isAfter } from 'date-fns';
import { AppSettings, CalendarEvent } from '../types';
import { X, Clock, ChevronRight, Sparkles, Lock } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';

interface AmbientModeProps {
  familyName: string;
  events: CalendarEvent[];
  settings: AppSettings;
  onExit: () => void;
  supabase: SupabaseClient | null;
}

export const AmbientMode: React.FC<AmbientModeProps> = ({ familyName, events, settings, onExit, supabase }) => {
  const [time, setTime] = useState(new Date());
  const [photos, setPhotos] = useState<string[]>([]);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  useEffect(() => {
    const it = setInterval(() => setTime(new Date()), 1000);
    if ('wakeLock' in navigator) {
      (navigator as any).wakeLock.request('screen').catch(() => {});
    }
    return () => clearInterval(it);
  }, []);

  // Fetch photos if Pro
  useEffect(() => {
    if (settings.isPro && supabase) {
      const fetchPhotos = async () => {
        const { data } = await supabase.storage.from('family_photos').list();
        if (data && data.length > 0) {
          const urls = data.map(f => supabase.storage.from('family_photos').getPublicUrl(f.name).data.publicUrl);
          setPhotos(urls);
        }
      };
      fetchPhotos();
    }
  }, [settings.isPro, supabase]);

  // Slideshow interval
  useEffect(() => {
    if (photos.length > 1) {
      const it = setInterval(() => {
        setCurrentPhotoIdx(prev => (prev + 1) % photos.length);
      }, 15000);
      return () => clearInterval(it);
    }
  }, [photos]);

  const todayEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter(e => isSameDay(e.startTime, now) && isAfter(e.endTime, now))
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 4); 
  }, [events]);

  const currentPhoto = photos[currentPhotoIdx];

  return (
    <div 
      onClick={onExit}
      className="h-full w-full bg-[#020202] relative flex flex-col items-center justify-between p-8 md:p-20 cursor-pointer animate-in fade-in duration-1000 overflow-hidden"
    >
      {/* PHOTO BACKGROUND (PRO ONLY) */}
      {settings.isPro && currentPhoto && (
        <div className="absolute inset-0 transition-opacity duration-1000">
           <img src={currentPhoto} className="w-full h-full object-cover opacity-40 grayscale-[20%]" alt="" />
           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
        </div>
      )}

      <div className="absolute top-10 right-10 opacity-10 hover:opacity-50 transition-opacity z-50">
        <div className="flex items-center gap-2 text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">
          Tap to wake <X size={14} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
        <div className="text-[min(28vw,45vh)] lg:text-[24rem] font-thin leading-none tracking-tighter text-white tabular-nums">
          {format(time, 'h:mm')}
        </div>
        <div className="text-xl sm:text-2xl md:text-4xl text-zinc-400 font-light uppercase tracking-[0.3em] md:tracking-[0.5em] text-center mt-4">
          {format(time, 'EEEE, MMMM do')}
        </div>
        
        {!settings.isPro && (
          <div className="mt-12 flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-zinc-600 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all">
            <Lock size={12} /> Pro: Unlock Photo Slideshow
          </div>
        )}
      </div>

      {todayEvents.length > 0 && (
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10 animate-in slide-in-from-bottom-10 duration-700">
          {todayEvents.map((event) => (
            <div 
              key={event.id}
              className="p-6 md:p-8 bg-black/40 border border-white/5 rounded-[2.5rem] backdrop-blur-xl flex flex-col justify-between h-32 md:h-48 group hover:bg-black/60 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: event.color }} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 truncate">{event.calendarName}</span>
                </div>
                <h4 className="text-sm md:text-lg font-bold text-white/90 line-clamp-1 leading-tight">
                  {event.title}
                </h4>
              </div>
              <div className="flex items-center gap-2 text-zinc-500">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    {event.isAllDay ? 'All Day' : format(event.startTime, 'h:mm a')}
                  </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};