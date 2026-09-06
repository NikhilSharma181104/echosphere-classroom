'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function DashboardCalendar({ 
  selectedDate, 
  onSelectDate 
}: { 
  selectedDate: Date, 
  onSelectDate: (d: Date) => void 
}) {
  const [baseDate, setBaseDate] = useState<Date>(selectedDate);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  
  // State for the calendar popup view
  const [viewMonth, setViewMonth] = useState<Date>(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  const datePickerRef = useRef<HTMLDivElement>(null);

  const currentMonth = baseDate.toLocaleString('default', { month: 'long' });
  const currentYear = baseDate.getFullYear();

  // Close picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDatePickerOpen]);

  // Generate 5 days centered around baseDate for the main view
  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(baseDate);
    d.setDate(baseDate.getDate() + i - 2);
    return {
      dateObj: d,
      dStr: d.toLocaleString('default', { weekday: 'short' }),
      n: d.getDate(),
      isToday: d.toDateString() === new Date().toDateString()
    };
  });

  const handlePrev = () => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() - 5);
    setBaseDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(baseDate);
    newDate.setDate(baseDate.getDate() + 5);
    setBaseDate(newDate);
  };

  // Calendar Popup Logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonthView = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1));
  const nextMonthView = () => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1));

  const daysInMonth = getDaysInMonth(viewMonth.getFullYear(), viewMonth.getMonth());
  const firstDay = getFirstDayOfMonth(viewMonth.getFullYear(), viewMonth.getMonth());
  
  const blanks = Array.from({ length: firstDay }).map((_, i) => <div key={`blank-${i}`} className="w-8 h-8"></div>);
  const days = Array.from({ length: daysInMonth }).map((_, i) => {
    const dayDate = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), i + 1);
    const isSelected = selectedDate.toDateString() === dayDate.toDateString();
    const isToday = new Date().toDateString() === dayDate.toDateString();
    
    return (
      <button
        key={i}
        onClick={() => {
          setBaseDate(dayDate);
          onSelectDate(dayDate);
          setIsDatePickerOpen(false);
        }}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
          isSelected 
            ? 'bg-[#D0FFA2] text-[#031A10] shadow-md' 
            : isToday 
              ? 'bg-[#031A10]/10 text-[#031A10]' 
              : 'text-[#031A10]/70 hover:bg-white/50'
        }`}
      >
        {i + 1}
      </button>
    );
  });

  const weekDayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
    <div key={day} className="w-8 text-center text-xs font-bold text-gray-400">
      {day}
    </div>
  ));

  return (
    <div className="col-span-1 md:col-span-2 md:row-span-1 rounded-[24px] p-6 flex flex-col justify-center bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <button onClick={handlePrev} className="text-gray-500 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center gap-2 relative" ref={datePickerRef}>
          <h3 className="text-sm font-bold text-[#031A10] font-manrope">{currentMonth} {currentYear}</h3>
          
          <button 
            onClick={() => {
              setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
              setIsDatePickerOpen(!isDatePickerOpen);
            }}
            className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-white/50 transition-colors text-[#031A10]"
          >
            <CalendarIcon className="w-4 h-4" />
          </button>

          {/* Custom Calendar Popup */}
          <AnimatePresence>
            {isDatePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-[24px] shadow-2xl"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.05)',
                  width: '280px'
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonthView} className="p-1 rounded-full hover:bg-white/60 text-[#031A10]/70 transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-[#031A10] font-manrope">
                    {viewMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button onClick={nextMonthView} className="p-1 rounded-full hover:bg-white/60 text-[#031A10]/70 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDayLabels}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {blanks}
                  {days}
                </div>
                
                <div className="mt-4 pt-3 border-t border-black/5 flex justify-end">
                  <button 
                    onClick={() => {
                      const today = new Date();
                      setBaseDate(today);
                      onSelectDate(today);
                      setIsDatePickerOpen(false);
                    }}
                    className="text-xs font-bold text-[#031A10]/60 hover:text-[#031A10] transition-colors px-2 py-1"
                  >
                    Today
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button onClick={handleNext} className="text-gray-500 bg-white/50 p-2 rounded-full hover:bg-white/80 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Days Header */}
      <div className="grid grid-cols-5 gap-4 px-12">
        {weekDays.map(day => {
          const isActive = selectedDate.toDateString() === day.dateObj.toDateString();
          return (
            <button 
              key={day.dateObj.toISOString()} 
              onClick={() => onSelectDate(day.dateObj)}
              className="flex flex-col items-center group focus:outline-none"
            >
              <span className={`text-xs font-medium mb-2 transition-colors ${isActive ? 'text-[#031A10]' : 'text-gray-500 group-hover:text-[#031A10]'}`}>
                {day.dStr}
              </span>
              <span className={`text-sm font-bold transition-all ${isActive ? 'text-[#031A10] bg-[#D0FFA2] w-8 h-8 rounded-full flex items-center justify-center shadow-md scale-110' : 'text-gray-400 group-hover:text-gray-600'}`}>
                {day.n}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
