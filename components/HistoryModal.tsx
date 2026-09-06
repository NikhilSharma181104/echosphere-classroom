'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function HistoryModal({ 
  isOpen, 
  onClose,
  role 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  role: 'student' | 'teacher';
}) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    let mounted = true;
    const fetchHistory = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data, error } = await supabase
        .from('sessions_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('joined_at', { ascending: false });
        
      if (mounted && !error) {
        setSessions(data || []);
      }
      if (mounted) setLoading(false);
    };
    
    fetchHistory();
    return () => { mounted = false; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
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
            className="bg-[#1A1C19] border border-white/10 rounded-[24px] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[80vh]"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1A1C19]/90 backdrop-blur z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-full text-[#D0FFA2]">
                  <Clock className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-white font-manrope">Session History</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 opacity-50">
                  <Loader2 className="w-8 h-8 text-white animate-spin mb-4" />
                  <p className="text-white">Loading history...</p>
                </div>
              ) : sessions.length > 0 ? (
                <div className="space-y-4">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between hover:bg-white/10 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-white tracking-widest uppercase font-mono mb-1">
                          {sess.class_code}
                        </span>
                        <div className="flex items-center gap-4 text-xs text-white/50 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(sess.joined_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(sess.joined_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-xs uppercase tracking-wider font-bold text-[#D0FFA2]/70 mb-1">
                          Role
                        </span>
                        <span className="text-sm font-semibold text-white capitalize">
                          {sess.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 opacity-50 text-center">
                  <Users className="w-12 h-12 text-white/40 mb-4" />
                  <p className="text-white/70 font-medium">No past sessions found.</p>
                  <p className="text-white/40 text-sm mt-2">Join or start a class to see it here.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
