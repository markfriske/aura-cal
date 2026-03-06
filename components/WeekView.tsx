
import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { CalendarEvent } from '../types';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export const WeekView: React.FC<WeekViewProps> = ({ currentDate, events }) => {
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <div className="h-full flex flex-col">
      <header className="mb-10">
        <h2 className="text-5xl font-bold tracking-tight">Week View</h2>
        <p className="text-zinc-500 text-lg">Next 7 days of family activity</p>
      </header>

      <div className="flex-1 grid grid-cols-7 gap-4 h-full">
        {weekDays.map(day => {
          const dayEvents = events.filter(e => isSameDay(e.startTime, day));
          const isToday = isSameDay(day, new Date());

          return (
            <div 
              key={day.toISOString()} 
              className={`flex flex-col rounded-3xl p-6 border transition-all ${
                isToday ? 'bg-zinc-100/5 border-zinc-400/20 ring-1 ring-zinc-400/10' : 'bg-transparent border-zinc-900'
              }`}
            >
              <div className="mb-6 flex flex-col items-center">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${isToday ? 'text-zinc-100' : 'text-zinc-600'}`}>
                  {format(day, 'EEE')}
                </span>
                <span className={`text-4xl font-light tabular-nums ${isToday ? 'text-white underline underline-offset-8' : 'text-zinc-400'}`}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
                {dayEvents.map(event => (
                  <div 
                    key={event.id}
                    className="p-3 rounded-2xl text-xs font-semibold leading-relaxed border-l-4"
                    style={{ backgroundColor: `${event.color}15`, color: event.color, borderColor: event.color }}
                  >
                    <div className="font-black text-[9px] uppercase tracking-wider mb-1 opacity-70">
                      {event.isAllDay ? 'All Day' : format(event.startTime, 'h:mm a')}
                    </div>
                    {event.title}
                  </div>
                ))}
                {dayEvents.length === 0 && (
                  <div className="h-full flex items-center justify-center opacity-10">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
