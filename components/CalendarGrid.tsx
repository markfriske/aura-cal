import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay } from 'date-fns';
import { CalendarEvent } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, events, onDateClick }) => {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-7xl font-thin mb-10 text-[#2D2926] tracking-tighter">{format(currentDate, 'MMMM yyyy')}</h2>
      
      <div className="grid grid-cols-7 mb-4">
        {dayHeaders.map(day => (
          <div key={day} className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center pb-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1 border-t border-[#E2DDD3]">
        {days.map((day, idx) => {
          const isCurrent = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());
          const dayEvents = events.filter(e => isSameDay(e.startTime, day));

          return (
            <div 
              key={idx} 
              onClick={() => isCurrent && onDateClick(day)}
              className={`border-r border-b border-[#E2DDD3] p-4 transition-colors cursor-pointer group relative ${
                isCurrent ? 'bg-transparent hover:bg-white/40' : 'bg-zinc-200/20 opacity-20 pointer-events-none'
              }`}
            >
              <div className="flex justify-start mb-2">
                <span className={`text-2xl font-light w-10 h-10 flex items-center justify-center rounded-xl transition-all group-hover:scale-110 ${
                  isToday ? 'bg-[#2D2926] text-[#F4F1EA] shadow-xl' : 'text-zinc-400'
                }`}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1.5 overflow-hidden">
                {dayEvents.slice(0, 3).map(event => (
                  <div 
                    key={event.id}
                    className="px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wide truncate border shadow-sm"
                    style={{ 
                      backgroundColor: 'white', 
                      color: event.color, 
                      borderColor: '#E2DDD3',
                      borderLeft: `3px solid ${event.color}`
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] font-black text-zinc-400 pl-2">
                    + {dayEvents.length - 3} more
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