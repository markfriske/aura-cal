
import React from 'react';
import { format, isAfter, startOfDay } from 'date-fns';
import { CalendarEvent } from '../types';

interface ListViewProps {
  events: CalendarEvent[];
}

export const ListView: React.FC<ListViewProps> = ({ events }) => {
  const upcomingEvents = [...events]
    .filter(e => isAfter(e.startTime, startOfDay(new Date())))
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      <header className="mb-12">
        <h2 className="text-5xl font-bold tracking-tight">Agenda</h2>
        <p className="text-zinc-500 text-lg">Upcoming family events and tasks</p>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto pr-6 custom-scrollbar">
        {upcomingEvents.map((event, idx) => {
          const isFirstOfMonth = idx === 0 || format(event.startTime, 'MMM') !== format(upcomingEvents[idx-1].startTime, 'MMM');
          
          return (
            <React.Fragment key={event.id}>
              {isFirstOfMonth && (
                <div className="sticky top-0 bg-black/80 backdrop-blur-md py-4 z-10 border-b border-zinc-900">
                  <span className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">
                    {format(event.startTime, 'MMMM yyyy')}
                  </span>
                </div>
              )}
              <div className="group flex gap-8 items-center p-6 rounded-3xl hover:bg-zinc-900/40 transition-all border border-transparent hover:border-zinc-800/50">
                <div className="flex flex-col items-center min-w-[60px]">
                  <span className="text-sm font-black uppercase text-zinc-600 tracking-tighter">{format(event.startTime, 'EEE')}</span>
                  <span className="text-4xl font-light text-zinc-200">{format(event.startTime, 'dd')}</span>
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }}></div>
                    <span className="text-sm font-bold uppercase tracking-widest text-zinc-500">{event.calendarName}</span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white group-hover:translate-x-1 transition-transform">{event.title}</h3>
                </div>

                <div className="text-right flex flex-col">
                  <span className="text-xl font-light text-zinc-400">
                    {event.isAllDay ? 'All Day' : format(event.startTime, 'h:mm a')}
                  </span>
                  {!event.isAllDay && (
                    <span className="text-[10px] text-zinc-600 font-bold uppercase">Until {format(event.endTime, 'h:mm a')}</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}

        {upcomingEvents.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 space-y-4">
             <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
               <div className="w-2 h-2 bg-zinc-800 rounded-full animate-pulse"></div>
             </div>
             <p className="text-lg font-medium italic">Your schedule is clear</p>
          </div>
        )}
      </div>
    </div>
  );
};
