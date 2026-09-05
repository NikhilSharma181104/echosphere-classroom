'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  PhoneOff,
  LayoutGrid,
  Users,
  CheckCircle,
  Video,
  Camera,
  Hand,
  MonitorUp,
  MoreHorizontal
} from 'lucide-react';

export type ClassroomConversationLayoutProps = {
  statusPanel: ReactNode;
  pipelineMetrics: ReactNode;
  transcriptPanel: ReactNode;
  visualizer: ReactNode;
  controls: ReactNode;
  micSelector: ReactNode;
  aiMuteControl?: ReactNode;
  chatInput: ReactNode;
  onEndConversation: () => void;
};

export function ClassroomConversationLayout({
  statusPanel,
  pipelineMetrics,
  transcriptPanel,
  visualizer,
  controls,
  micSelector,
  aiMuteControl,
  chatInput,
  onEndConversation,
}: ClassroomConversationLayoutProps) {
  const [activeTab, setActiveTab] = useState<'ai' | 'notes' | 'transcript' | 'qa'>('ai');

  const glassPanel = {
    background: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
  };


  return (
    <div className="flex h-screen w-full flex-col bg-[#F8F9FA] relative">
      
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/SonaAI%20icon1.png" alt="SonaAI Logo" className="h-8 w-8 object-contain bg-white p-1 rounded-xl shadow-sm" />
          <span className="text-xl font-extrabold tracking-tight text-[#031A10] font-manrope">
            SonaAI Meet <span className="bg-[#D0FFA2] text-xs px-2 py-0.5 rounded-md ml-1">AI</span>
          </span>
        </Link>
        
        {/* Title */}
        <div className="items-center gap-4 hidden md:flex ml-12 flex-1">
          <span className="font-bold text-[#031A10]">Product Roadmap Planning</span>
          <span className="text-gray-500 text-sm flex items-center gap-1">00:24:58 <CheckCircle className="w-4 h-4 text-green-600" /></span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {statusPanel}
          <div className="hidden sm:flex min-w-0 flex-col justify-center gap-0.5 mr-4" style={{ '--es-text-primary': '#031A10', '--es-text-muted': '#6B7280', '--es-border-subtle': '#E5E7EB' } as any}>
             {pipelineMetrics}
          </div>
          <button className="hidden lg:flex items-center gap-1.5 bg-white/60 hover:bg-white/80 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors text-[#031A10]">
            <LayoutGrid className="w-4 h-4" /> Layout
          </button>
          <button className="hidden lg:flex items-center gap-1.5 bg-white/60 hover:bg-white/80 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors text-[#031A10]">
            <Users className="w-4 h-4" /> 6
          </button>
          <div className="h-8 w-8 rounded-full bg-[#D0FFA2] text-[#031A10] font-bold flex items-center justify-center shadow-sm">
            T
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 gap-4 p-4 pt-0">
        
        {/* Left Stage (Video Grid) */}
        <div className="flex-1 flex flex-col relative rounded-[32px] overflow-hidden bg-[#0B0C10] shadow-2xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full pb-24 w-full max-w-5xl mx-auto">
            
            {/* Tile 1: You (Teacher) */}
            <div className="relative rounded-2xl overflow-hidden flex items-center justify-center bg-[#1F2833]">
               <img src="https://ui-avatars.com/api/?name=Teacher&background=1F2833&color=D0FFA2&size=512" className="w-full h-full object-cover opacity-80" />
               <div className="absolute top-3 left-3 bg-[#D0FFA2] text-[#031A10] text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                 Speaking <div className="flex gap-0.5">{[1,2,3].map(i=><div key={i} className="w-0.5 h-2 bg-[#031A10] rounded-full animate-pulse-subtle"/>)}</div>
               </div>
               <span className="absolute bottom-3 left-3 text-white text-sm font-semibold drop-shadow-md">Teacher (You)</span>
            </div>
            
            {/* Tile 2: SonaAI */}
            <div className="relative rounded-2xl overflow-hidden flex flex-col items-center justify-center bg-[#052329] border border-[#D0FFA2]/30">
               <div className="scale-[1.2] origin-center">{visualizer}</div>
               <span className="absolute bottom-3 left-3 text-[#D0FFA2] text-sm font-semibold flex items-center gap-1.5 drop-shadow-md">
                 <Sparkles className="w-3.5 h-3.5" /> SonaAI
               </span>
               <div className="absolute top-3 right-3 bg-black/40 rounded-full p-1.5">
                  <MoreHorizontal className="w-4 h-4 text-white" />
               </div>
            </div>
          </div>

          {/* Floating Control Dock */}
          <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center px-6">
             <div className="flex items-center gap-3 bg-[#202124] rounded-full px-6 py-3 shadow-2xl border border-white/5">
                
                {/* Mic button with hover-reveal settings */}
                <div className="relative group/mic flex items-center">
                  {controls}
                  <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover/mic:opacity-100 transition-opacity pointer-events-none group-hover/mic:pointer-events-auto">
                    <div className="bg-[#202124] rounded-full p-1 shadow-xl border border-white/10">
                      {micSelector}
                    </div>
                  </div>
                </div>

                <button className="w-12 h-12 rounded-full bg-[#3C4043] flex items-center justify-center hover:bg-[#4d5155] transition-colors text-white/80 hover:text-white" title="Camera">
                  <Video className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex w-12 h-12 rounded-full bg-[#3C4043] items-center justify-center hover:bg-[#4d5155] transition-colors text-white/80 hover:text-white" title="Raise Hand">
                  <Hand className="w-5 h-5" />
                </button>
                <button className="hidden md:flex w-12 h-12 rounded-full bg-[#3C4043] items-center justify-center hover:bg-[#4d5155] transition-colors text-white/80 hover:text-white" title="Share Screen">
                  <MonitorUp className="w-5 h-5" />
                </button>
                <button className="hidden sm:flex w-12 h-12 rounded-full bg-[#3C4043] items-center justify-center hover:bg-[#4d5155] transition-colors text-white/80 hover:text-white" title="More">
                  <MoreHorizontal className="w-5 h-5" />
                </button>

                {/* Separator */}
                <div className="w-px h-8 bg-white/10" />
                
                {/* End Call */}
                <button 
                  onClick={onEndConversation}
                  className="w-14 h-12 rounded-full bg-[#EA4335] flex items-center justify-center hover:bg-[#d93025] transition-colors shadow-lg"
                  title="Leave meeting"
                >
                  <PhoneOff className="w-5 h-5 text-white" />
                </button>
             </div>

             {/* AI Mute/Unmute - right side, same row */}
             {aiMuteControl && (
               <div className="absolute right-6">
                 {aiMuteControl}
               </div>
             )}
          </div>
        </div>

        {/* Right Sidebar (Tabs) */}
        <div className="w-[420px] hidden lg:flex flex-col rounded-[32px] overflow-hidden shadow-xl p-6" style={glassPanel}>
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-4">
            {(['ai', 'notes', 'transcript', 'qa'] as const).map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold px-2 py-1 transition-colors relative ${activeTab === tab ? 'text-[#031A10]' : 'text-gray-500 hover:text-gray-800'}`}
              >
                {tab === 'ai' ? 'AI Assistant' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute -bottom-4 left-0 right-0 h-[3px] rounded-t-full bg-[#031A10]" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar relative">
            {activeTab === 'transcript' && transcriptPanel}
            
            {activeTab === 'ai' && (
              <div className="flex flex-col gap-6 h-full pb-4">
                 {/* SonaAI Listening Status */}
                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                     <p className="text-sm font-bold text-[#031A10] flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-green-500"/> SonaAI is listening...</p>
                     <p className="text-[10px] text-gray-500 mt-1 max-w-[180px]">It can take notes, summarize and answer questions for you.</p>
                   </div>
                   <img src="/SonaAI%20icon1.png" className="w-12 h-12 object-contain rounded-xl" />
                 </div>

                 {/* Meeting Summary */}
                 <div>
                   <div className="flex items-center justify-between mb-3">
                     <h3 className="text-sm font-bold text-[#031A10]">Meeting Summary (Live)</h3>
                   </div>
                   <ul className="text-xs text-gray-600 space-y-2.5 list-disc pl-4 mb-4 font-medium">
                     <li>Discussed Q2 product roadmap and key priorities.</li>
                     <li>Decided to focus on <strong>AI feature enhancement</strong>.</li>
                     <li><strong>Marketing campaign</strong> for launch in May.</li>
                     <li>Next review <strong>meeting on April 30</strong>.</li>
                   </ul>
                   <button className="bg-[#D0FFA2]/30 text-[#031A10] text-xs font-bold px-4 py-2 rounded-lg hover:bg-[#D0FFA2]/50 transition-colors w-max">
                     View Full Summary
                   </button>
                 </div>

                 {/* Action Items */}
                 <div>
                   <h3 className="text-sm font-bold text-[#031A10] mb-3">Action Items</h3>
                   <div className="space-y-4">
                     <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl">
                       <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 bg-white flex items-center justify-center"></div>
                       <p className="text-xs text-gray-700 flex-1"><strong>Neha</strong> to share the updated roadmap</p>
                       <span className="text-[9px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">Due Apr 25</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl">
                       <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 bg-white flex items-center justify-center"></div>
                       <p className="text-xs text-gray-700 flex-1"><strong>Arjun</strong> to prepare AI feature demo</p>
                       <span className="text-[9px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">Due Apr 22</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white/50 p-2 rounded-xl">
                       <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 bg-white flex items-center justify-center"></div>
                       <p className="text-xs text-gray-700 flex-1"><strong>Priya</strong> to draft marketing plan</p>
                       <span className="text-[9px] font-bold text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm">Due Apr 24</span>
                     </div>
                   </div>
                   <button className="text-green-600 text-xs font-bold mt-4 flex items-center gap-1 hover:text-green-700 transition-colors">
                     + Add Action Item
                   </button>
                 </div>
              </div>
            )}
            {/* Other tabs can be empty placeholders */}
            {(activeTab === 'notes' || activeTab === 'qa') && (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">
                Coming Soon
              </div>
            )}
          </div>
          
          {/* Ask SonaAI Chat input area */}
          <div className="mt-4 pt-4 border-t border-black/10 shrink-0">
             <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#031A10]">Ask SonaAI</h3>
             </div>
             <div className="flex gap-2 mb-3 overflow-x-auto custom-scrollbar pb-1">
                <button className="text-[10px] font-semibold text-gray-600 bg-white/60 hover:bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100 whitespace-nowrap transition-colors">What are the key decisions?</button>
                <button className="text-[10px] font-semibold text-gray-600 bg-white/60 hover:bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100 whitespace-nowrap transition-colors">Summarize the last 10 minutes</button>
             </div>
             {chatInput}
          </div>
        </div>
      </div>
    </div>
  );
}
