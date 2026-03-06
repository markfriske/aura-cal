import React, { useState, useMemo } from 'react';
import { FamilyNote, ShoppingListItem, User, ViewMode } from '../types';
import { Plus, X, User as UserIcon, ShoppingBag, StickyNote, CheckCircle2, Circle, Loader2, Users, UserCheck, Filter, Utensils, MessageSquareText, RefreshCw, ClipboardList, Lock } from 'lucide-react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useToast } from './ToastProvider';

interface FamilyBoardProps {
  notes: FamilyNote[];
  shoppingList: ShoppingListItem[];
  supabase: SupabaseClient | null;
  user: User | null;
  members: string[];
  isPro?: boolean;
}

export const FamilyBoard: React.FC<FamilyBoardProps> = ({ notes, shoppingList, supabase, user, members, isPro }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'notes' | 'shopping'>('notes');
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState('');
  const [assignedTo, setAssignedTo] = useState<string>('Everyone');
  const [noteCategory, setNoteCategory] = useState<'general' | 'meal' | 'task'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const colors = [
    '#FFF9E6', // Softest yellow
    '#F0FDF4', // Softest green
    '#EFF6FF', // Softest blue
    '#FEF2F2', // Softest red
    '#FAF5FF'  // Softest purple
  ];

  const filteredNotes = useMemo(() => {
    if (activeFilter === 'All') return notes;
    return notes.filter(n => n.assigned_to === activeFilter);
  }, [notes, activeFilter]);

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    
    if (!supabase) {
      showToast("Sync Error", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'notes') {
        const { error } = await supabase.from('notes').insert([{
          content: newItem,
          author: user?.name || 'Unknown',
          color: colors[Math.floor(Math.random() * colors.length)],
          assigned_to: assignedTo === 'Everyone' ? null : assignedTo,
          category: noteCategory,
          user_id: user?.id
        }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('shopping_list').insert([{
          text: newItem,
          added_by: user?.name || 'Unknown',
          user_id: user?.id
        }]);
        if (error) throw error;
      }
      setNewItem('');
      setIsAdding(false);
      showToast("Pinned to the board", "success");
    } catch (err: any) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleItem = async (item: ShoppingListItem) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from('shopping_list').update({ completed: !item.completed }).eq('id', item.id);
      if (error) throw error;
    } catch (err: any) {
      showToast("Error updating list.", "error");
    }
  };

  const removeItem = async (id: string, table: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
    } catch (err: any) {
      showToast("Error removing item.", "error");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-8 items-end">
          <button 
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-3 transition-all ${activeTab === 'notes' ? 'text-[#2D2926]' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <StickyNote size={32} />
            <div className="text-left">
              <h2 className="text-4xl font-bold tracking-tight">Family Board</h2>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Digital Fridge Notes</p>
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('shopping')}
            className={`flex items-center gap-3 transition-all ${activeTab === 'shopping' ? 'text-[#2D2926]' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            <ShoppingBag size={32} />
            <div className="text-left">
              <h2 className="text-4xl font-bold tracking-tight">Grocery List</h2>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Kitchen Inventory</p>
            </div>
          </button>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {activeTab === 'notes' && (
             <div className="flex items-center bg-white/40 rounded-2xl px-6 border border-[#E2DDD3] flex-1 md:flex-none">
               <Filter size={16} className="text-zinc-400 mr-3" />
               <select 
                 value={activeFilter}
                 onChange={(e) => setActiveFilter(e.target.value)}
                 className="bg-transparent text-[#2D2926] font-black text-[10px] uppercase tracking-widest outline-none py-4 w-full cursor-pointer"
               >
                 <option value="All">Everyone</option>
                 {members.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
             </div>
          )}
          <button 
            onClick={() => setIsAdding(true)}
            disabled={isSubmitting}
            className="bg-[#2D2926] text-[#F4F1EA] px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
            New {activeTab === 'notes' ? 'Note' : 'Item'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        {activeTab === 'notes' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {isAdding && (
              <div className="bg-white border-2 border-[#2D2926]/10 rounded-[3rem] p-10 flex flex-col gap-6 min-h-[22rem] animate-in zoom-in-95 duration-200 shadow-xl">
                 <textarea 
                   autoFocus
                   value={newItem}
                   onChange={(e) => setNewItem(e.target.value)}
                   className="bg-transparent text-[#2D2926] text-3xl font-light outline-none resize-none flex-1 placeholder:text-zinc-200"
                   placeholder="Write a message for the family..."
                   disabled={isSubmitting}
                 />
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Assigned To</label>
                      <select 
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="w-full bg-[#F4F1EA]/50 border border-[#E2DDD3] rounded-xl px-4 py-3 text-[10px] font-bold text-[#2D2926] outline-none"
                      >
                        <option value="Everyone">Everyone</option>
                        {members.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-2">Note Type</label>
                      <select 
                        value={noteCategory}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          if (!isPro && val !== 'general') {
                            showToast("Meal and Task tagging requires Pro.", "error");
                            return;
                          }
                          setNoteCategory(val);
                        }}
                        className="w-full bg-[#F4F1EA]/50 border border-[#E2DDD3] rounded-xl px-4 py-3 text-[10px] font-bold text-[#2D2926] outline-none"
                      >
                        <option value="general">Regular Note</option>
                        <option value="meal">Meal Plan {!isPro && '🔒'}</option>
                        <option value="task">Family Task {!isPro && '🔒'}</option>
                      </select>
                    </div>
                 </div>

                 <div className="flex justify-end gap-4 pt-4 border-t border-zinc-100">
                   <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest hover:text-zinc-600 transition-colors">Cancel</button>
                   <button 
                    onClick={handleAdd} 
                    disabled={isSubmitting}
                    className="bg-[#2D2926] text-[#F4F1EA] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg hover:scale-105 transition-all"
                   >
                     {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Pin to Board'}
                   </button>
                 </div>
              </div>
            )}
            {filteredNotes.map(note => (
              <div 
                key={note.id} 
                className="group relative h-72 p-10 flex flex-col justify-between rounded-[3rem] shadow-sm hover:shadow-xl transition-all border border-[#E2DDD3]/50"
                style={{ backgroundColor: note.color || '#FFF9E6', color: '#2D2926' }}
              >
                <button 
                  onClick={() => removeItem(note.id, 'notes')}
                  className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 p-2 hover:bg-black/5 rounded-full transition-all z-20"
                >
                  <X size={20} />
                </button>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    {note.category === 'meal' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        <Utensils size={10} /> Meal
                      </div>
                    ) : note.category === 'task' ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        <UserCheck size={10} /> Task
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                        <MessageSquareText size={10} /> Note
                      </div>
                    )}
                  </div>
                  <p className="text-3xl font-light leading-tight tracking-tight line-clamp-4">{note.content}</p>
                </div>

                <div className={`flex items-center ${note.assigned_to ? 'justify-between' : 'justify-end'} border-t border-black/5 pt-6`}>
                  {note.assigned_to && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm border border-[#E2DDD3]">
                      {note.assigned_to}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6 pb-20">
            {isAdding && (
              <div className="bg-white border border-[#E2DDD3] rounded-[2.5rem] p-8 flex gap-6 items-center animate-in slide-in-from-top-4 shadow-xl">
                 <input 
                   autoFocus
                   value={newItem}
                   onChange={(e) => setNewItem(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                   className="bg-transparent text-[#2D2926] text-2xl font-light outline-none flex-1 placeholder:text-zinc-200"
                   placeholder="Milk, Bread, Eggs..."
                   disabled={isSubmitting}
                 />
                 <button 
                  onClick={handleAdd} 
                  disabled={isSubmitting}
                  className="bg-[#2D2926] text-[#F4F1EA] px-8 py-4 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2"
                 >
                   {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : 'Add'}
                 </button>
              </div>
            )}
            <div className="space-y-3">
              {shoppingList.map(item => (
                <div 
                  key={item.id}
                  onClick={() => toggleItem(item)}
                  className={`group flex items-center gap-6 p-8 rounded-[2.5rem] border cursor-pointer transition-all animate-in fade-in ${
                    item.completed ? 'bg-zinc-100/50 border-transparent opacity-40' : 'bg-white border-[#E2DDD3] hover:border-zinc-400 shadow-sm'
                  }`}
                >
                  {item.completed ? <CheckCircle2 className="text-zinc-300" /> : <Circle className="text-zinc-200 group-hover:text-zinc-400" />}
                  <span className={`flex-1 text-2xl font-light ${item.completed ? 'line-through text-zinc-400' : 'text-[#2D2926]'}`}>
                    {item.text}
                  </span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeItem(item.id, 'shopping_list'); }}
                    className="p-3 text-zinc-100 group-hover:text-red-400 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};