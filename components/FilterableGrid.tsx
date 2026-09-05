'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COURSES = [
  { id: 1, title: 'English Mastery', category: 'English', duration: '5 Weeks', lectures: 20, level: 'Beginner' },
  { id: 2, title: 'Advanced Arabic', category: 'Arabic', duration: '8 Weeks', lectures: 35, level: 'Advanced' },
  { id: 3, title: 'French for Business', category: 'French', duration: '6 Weeks', lectures: 25, level: 'Intermediate' },
  { id: 4, title: 'Conversational Spanish', category: 'Spanish', duration: '4 Weeks', lectures: 15, level: 'Beginner' },
  { id: 5, title: 'German Literature', category: 'German', duration: '10 Weeks', lectures: 40, level: 'Advanced' },
  { id: 6, title: 'Mandarin Basics', category: 'Mandarin', duration: '12 Weeks', lectures: 50, level: 'Beginner' },
];

const CATEGORIES = ['All Languages', 'English', 'Arabic', 'French', 'Spanish', 'German', 'Mandarin'];

export function FilterableGrid() {
  const [activeTab, setActiveTab] = useState('All Languages');

  const filteredCourses = activeTab === 'All Languages' 
    ? COURSES 
    : COURSES.filter(course => course.category === activeTab);

  return (
    <section className="py-20 md:py-28" style={{ background: '#FFFFFF' }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2
            className="font-extrabold mb-8"
            style={{
              fontSize: '48px',
              lineHeight: '1.2',
              letterSpacing: '-1.488px',
              color: '#000000',
              fontFamily: 'var(--font-manrope)',
            }}
          >
            Find Your Perfect Path
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveTab(category)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-300 cursor-none"
                style={{
                  background: activeTab === category ? '#031A10' : '#F5F5F5',
                  color: activeTab === category ? '#D0FFA2' : '#707070',
                  border: '1px solid',
                  borderColor: activeTab === category ? '#031A10' : 'rgba(0,0,0,0.06)'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div 
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => (
              <motion.div
                layout
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden cursor-none"
                style={{
                  background: '#F5F5F5',
                  border: '1px solid rgba(0,0,0,0.06)',
                  aspectRatio: '4/3'
                }}
              >
                {/* Thumbnail Placeholder */}
                <div 
                  className="w-full h-full transition-transform duration-500 group-hover:scale-105"
                  style={{ background: '#E0E0E0' }} 
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span style={{ color: '#A0A0A0', fontWeight: 600 }}>[ Course Image ]</span>
                  </div>
                </div>

                {/* Always visible title */}
                <div className="absolute top-4 left-4 right-4 z-10">
                  <div className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-2" style={{ background: '#031A10', color: '#D0FFA2' }}>
                    {course.category}
                  </div>
                  <h3 className="text-xl font-bold" style={{ color: '#031A10', fontFamily: 'var(--font-manrope)' }}>
                    {course.title}
                  </h3>
                </div>

                {/* Hover Overlay Info Bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out flex justify-between items-center"
                  style={{
                    background: 'rgba(3, 26, 16, 0.9)',
                    backdropFilter: 'blur(8px)'
                  }}
                >
                  <div className="text-xs font-medium" style={{ color: '#FFFFFF' }}>
                    <p>{course.lectures} Lectures</p>
                    <p style={{ color: '#D0FFA2' }}>{course.duration}</p>
                  </div>
                  <div className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#FFFFFF', color: '#031A10' }}>
                    {course.level}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
