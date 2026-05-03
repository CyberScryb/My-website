import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, Cpu, Database, Zap, BookOpen } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../lib/tools.registry';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [showManifesto, setShowManifesto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('cyberscryb_manifesto_seen')) {
       setShowManifesto(true);
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't focus input if cmd/ctrl k used, wait, cmd+k triggers command palette in App.tsx
      // For local search focus, maybe just '/'
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleDismissManifesto = (action: 'read' | 'skip') => {
     localStorage.setItem('cyberscryb_manifesto_seen', 'true');
     setShowManifesto(false);
     if (action === 'read') {
        navigate('/manifesto');
     }
  };

  const tags = Array.from(new Set(TOOLS.map(t => t.category)));

  const filteredTools = TOOLS.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? tool.category === selectedTag : true;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <Helmet>
        <title>CyberScryb | Universal Client-Side Tools</title>
        <meta name="description" content="A powerful suite of client-side developer tools. No tracking, minimal server dependency, optional AI features. Privacy first." />
      </Helmet>
      
      <AnimatePresence>
        {showManifesto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-base/80 backdrop-blur-sm p-4">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="bg-surface border border-accent/30 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 blur-[50px] -mr-10 -mt-10 rounded-full pointer-events-none"></div>
               <ShieldCheck className="text-accent w-12 h-12 mb-6" />
               <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome to the Anti-Cloud.</h2>
               <p className="text-muted leading-relaxed mb-8">
                 You are about to use a suite of tools that do not send your data to a server. We don't want your telemetry, and we don't want to store your secrets. Before you begin, you have a choice.
               </p>
               <div className="flex flex-col gap-3">
                  <button onClick={() => handleDismissManifesto('read')} className="w-full py-4 bg-accent text-black font-bold rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2">
                     <BookOpen size={18} /> Read the Manifesto
                  </button>
                  <button onClick={() => handleDismissManifesto('skip')} className="w-full py-4 bg-transparent border border-subtle text-muted hover:text-primary hover:border-strong font-bold rounded-lg transition-colors">
                     I just want tools
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div 
        ref={heroRef}
        onMouseMove={handleMouseMove}
        className="relative pt-32 pb-24 px-6 border-b border-subtle overflow-hidden flex flex-col items-center justify-center min-h-[70vh] bg-base"
      >
        <div className="absolute inset-0 z-0 mesh-bg opacity-40"></div>
        <div className="absolute inset-0 bg-base/60 z-0 pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base/50 to-base z-0 pointer-events-none"></div>
        
        {/* Custom cursor dot */}
        <motion.div 
          className="absolute w-2 h-2 rounded-full bg-accent z-50 pointer-events-none hidden sm:block mix-blend-screen"
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
          style={{ translateX: '-50%', translateY: '-50%', filter: 'drop-shadow(0 0 8px var(--accent-glow))' }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-subtle text-xs font-mono text-accent uppercase tracking-widest mb-4">
             <ShieldCheck size={14} /> Local-First Execution (Optional AI)
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary leading-[1.1] mb-2">
            Local-first dev tools. <br/>
            <span className="text-muted">No tracking. No bullshit.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Stop pasting your production secrets into random ad-filled websites. Run everything offline, securely, directly in your browser.
          </p>

          <div className="w-full max-w-xl mx-auto bg-elevated border border-strong rounded-xl p-4 shadow-2xl flex items-center gap-3 relative group overflow-hidden">
             <div className="absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Search size={20} className="text-muted shrink-0" />
             <div className="flex-1 flex items-center gap-1 text-left">
                <span className="text-muted font-mono">Press</span>
                <kbd className="px-1.5 py-0.5 bg-surface border border-subtle rounded text-xs fold-bold font-mono text-primary">⌘K</kbd>
                <span className="text-muted font-mono">to summon the toolbox...</span>
                <span className="w-1.5 h-4 bg-accent animate-cursor-blink ml-1"></span>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-surface border-b border-subtle py-8">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 text-left">
               <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Database size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-primary font-mono uppercase tracking-widest text-xs mb-1">Zero Telemetry</h4>
                  <p className="text-muted text-sm leading-relaxed">Nothing leaves your machine. Your payloads stay in your RAM.</p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-left">
               <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Zap size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-primary font-mono uppercase tracking-widest text-xs mb-1">Instant Execution</h4>
                  <p className="text-muted text-sm leading-relaxed">No network round-trips. Powered by local Web Workers and WASM.</p>
               </div>
            </div>
            <div className="flex items-center gap-4 text-left">
               <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                  <Cpu size={24} />
               </div>
               <div>
                  <h4 className="font-bold text-primary font-mono uppercase tracking-widest text-xs mb-1">Open Standards</h4>
                  <p className="text-muted text-sm leading-relaxed">Built on standardized browser APIs for long-term stability.</p>
               </div>
            </div>
         </div>
      </div>

      <section className="py-24 px-6 bg-base relative min-h-screen">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          
          <div className="sticky top-[4.5rem] z-30 bg-base/80 backdrop-blur-xl border border-subtle rounded-xl p-4 shadow-xl flex flex-col lg:flex-row gap-4 justify-between items-center transition-all">
             <div className="relative w-full lg:max-w-md">
               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
               <input 
                 ref={searchInputRef}
                 type="text" 
                 placeholder="Filter list... (Press '/')" 
                 value={searchQuery}
                 onChange={e => setSearchQuery(e.target.value)}
                 className="w-full bg-elevated border border-strong rounded-lg pl-11 pr-14 py-3 text-primary text-sm focus-ring transition-all font-mono"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                 <kbd className="w-6 h-6 flex items-center justify-center bg-surface border border-subtle rounded text-xs text-muted font-sans font-medium">/</kbd>
               </div>
             </div>

             <div className="flex w-full lg:w-auto overflow-x-auto gap-2 pb-2 lg:pb-0 scrollbar-hide snap-x">
               <button 
                 onClick={() => setSelectedTag(null)}
                 className={`snap-center shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border ${!selectedTag ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-transparent text-muted hover:text-primary hover:border-subtle'}`}
               >
                 All Tools
               </button>
               {tags.map(tag => (
                 <button 
                   key={tag}
                   onClick={() => setSelectedTag(tag)}
                   className={`snap-center shrink-0 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all border ${selectedTag === tag ? 'bg-accent/10 border-accent text-accent' : 'bg-surface border-transparent text-muted hover:text-primary hover:border-subtle'}`}
                 >
                   {tag}
                 </button>
               ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
            <AnimatePresence>
              {filteredTools.map((tool) => (
                <Link to={"/tools/" + tool.slug} key={tool.id} className="block outline-none rounded-xl focus-ring">
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col items-start justify-between rounded-xl interactive-card p-6 text-left w-full h-full overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="flex items-center justify-between w-full mb-5 relative z-10">
                      <div className="flex items-center justify-center w-12 h-12 text-accent bg-accent/10 border border-accent/20 rounded-xl group-hover:scale-110 group-hover:bg-accent/20 transition-all duration-300">
                        {React.createElement(tool.icon as any, { size: 20 })}
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded bg-base text-[10px] font-bold text-muted border border-subtle font-mono uppercase tracking-widest group-hover:border-accent/30 group-hover:text-accent transition-colors">
                        {tool.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary mb-3 tracking-tight relative z-10">
                       {tool.name}
                    </h3>
                    <p className="text-sm text-muted leading-relaxed font-normal mb-8 relative z-10 line-clamp-2">{tool.description}</p>
                    
                    <div className="relative z-10 mt-auto flex items-center justify-between w-full">
                       <div className="flex items-center gap-1.5 text-xs font-mono text-muted/70 group-hover:text-accent transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span> {tool.aiFeatures?.length > 0 ? "local + optional AI" : "process locally"}
                       </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </AnimatePresence>
            {filteredTools.length === 0 && (
              <div className="col-span-full py-24 text-center">
                 <div className="inline-flex w-16 h-16 bg-surface border border-strong rounded-2xl items-center justify-center text-muted mb-4 shadow-inner">
                   <Search size={24} />
                 </div>
                 <h3 className="text-lg font-bold text-primary mb-2 tracking-tight">No components matched</h3>
                 <p className="text-sm text-muted">Adjust your search parameters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
