'use client';

import { useState, useEffect } from 'react';
import { Plus, Check, Calendar as CalendarIcon, Loader2, X } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardTasks({ selectedDate }: { selectedDate: Date }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Fetch tasks
  useEffect(() => {
    let mounted = true;
    const fetchTasks = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const dateStr = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', dateStr)
        .order('created_at', { ascending: true });
        
      if (mounted && !error) {
        setTasks(data || []);
      }
      if (mounted) setLoading(false);
    };
    fetchTasks();
    return () => { mounted = false; };
  }, [selectedDate]);

  const handleToggleTask = async (task: any) => {
    // optimistic update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t));
    await supabase.from('tasks').update({ completed: !task.completed }).eq('id', task.id);
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setIsAdding(false);
      return;
    }

    const dateStr = selectedDate.toISOString().split('T')[0];
    const newTask = {
      user_id: session.user.id,
      title: newTaskTitle.trim(),
      date: dateStr,
      completed: false
    };

    const { data, error } = await supabase.from('tasks').insert(newTask).select().single();
    if (!error && data) {
      setTasks(prev => [...prev, data]);
      setIsAddModalOpen(false);
      setNewTaskTitle('');
    }
    setIsAdding(false);
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <>
      <div 
        className="col-span-1 md:col-span-2 md:row-span-1 rounded-[32px] p-6 flex flex-col shadow-2xl relative overflow-hidden"
        style={{ background: '#1A1C19' }}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <h3 className="text-base font-medium text-white/90">Tasks</h3>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-lg font-light text-white/50">{tasks.length > 0 ? `${completedCount}/${tasks.length}` : '0/0'}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-2 min-h-0 pointer-events-auto custom-scrollbar overscroll-contain relative z-10">
          {loading ? (
            <div className="flex justify-center items-center h-full opacity-50">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
          ) : tasks.length > 0 ? (
            tasks.map(task => (
              <div key={task.id} className={`flex items-start gap-3 transition-opacity duration-300 ${task.completed ? '' : 'opacity-70 hover:opacity-100'}`}>
                <button 
                  onClick={() => handleToggleTask(task)}
                  className={`mt-0.5 min-w-[16px] w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                    task.completed 
                      ? 'border-[#D0FFA2]/50 bg-[#D0FFA2]/10 text-[#D0FFA2]' 
                      : 'border-white/30 bg-white/5 hover:border-white/60'
                  }`}
                >
                  {task.completed && <Check className="w-3 h-3" />}
                </button>
                <div>
                  <p className={`text-xs font-medium transition-all ${task.completed ? 'text-white/40 line-through' : 'text-white/90'}`}>
                    {task.title}
                  </p>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {new Date(task.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-full opacity-50 py-8">
              <CalendarIcon className="w-6 h-6 text-white/40 mb-2" />
              <p className="text-xs text-white/70">No tasks for {selectedDate.toLocaleString('default', { month: 'short' })} {selectedDate.getDate()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Sleek Add Task Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-[#1A1C19] border border-white/10 rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white font-manrope">New Task</h2>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <form onSubmit={handleAddTask}>
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">
                      Task Details
                    </label>
                    <input
                      type="text"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="e.g. Grade science assignments"
                      autoFocus
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none focus:border-[#D0FFA2]/50 focus:bg-white/10 transition-all"
                    />
                    <p className="text-xs text-white/40 mt-3 flex items-center gap-1.5">
                      <CalendarIcon className="w-3 h-3" />
                      Will be scheduled for {selectedDate.toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="flex-1 py-3 rounded-xl font-bold text-white/70 bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!newTaskTitle.trim() || isAdding}
                      className="flex-1 py-3 rounded-xl font-bold text-[#031A10] transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                      style={{ background: '#D0FFA2' }}
                    >
                      {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Task'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
