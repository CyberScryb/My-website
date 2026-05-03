import React, { useState } from 'react';
import { ChevronRight, Star, History, HelpCircle, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { Badge } from './ui/Skeleton';
import { Helmet } from 'react-helmet-async';
import { TOOLS } from '../lib/tools.registry';
import { EXAMPLES } from '../lib/examples.data';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export const ToolShell = ({ config, children, sampleBanner, onDismissSample, shareMethod, rightSidebar }: any) => {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  
  const toolExamples = EXAMPLES.filter(ex => ex.toolSlug === config.slug);
  
  const handleCopyHash = async () => {
    if (shareMethod) {
      await shareMethod();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full bg-base animate-in fade-in duration-300">
      <Helmet>
        <title>{config.name} — {config.aiFeatures?.length > 0 ? "Local + AI" : "100% Local, No Server"} | CyberScryb</title>
        <meta name="description" content={`Free client-side ${config.name.toLowerCase()}. ${config.description} ${config.aiFeatures?.length > 0 ? 'Includes optional AI.' : 'No tracking, no uploads.'}`} />
        <meta property="og:title" content={`${config.name} — ${config.aiFeatures?.length > 0 ? "Local + AI" : "100% Local"} | CyberScryb`} />
        <meta property="og:description" content={`Free client-side ${config.name.toLowerCase()}. ${config.description}`} />
        <meta property="og:image" content={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="%2309090b"/><rect x="50" y="50" width="1100" height="530" rx="20" fill="%23121214" stroke="%2327272a" stroke-width="2"/><text x="100" y="200" font-family="monospace" font-size="60" font-weight="bold" fill="%23f4f4f5">${encodeURIComponent(config.name)}</text><text x="100" y="280" font-family="sans-serif" font-size="30" fill="%23a1a1aa">${encodeURIComponent(config.description)}</text><text x="100" y="500" font-family="monospace" font-size="40" fill="%2334f5c5" font-weight="bold">CYBERSCRYB ${encodeURIComponent(config.category.toUpperCase())}</text></svg>`} />
        <meta property="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Left Rail - Tool Nav */}
      <div className="w-16 hidden md:flex flex-col items-center py-4 gap-4 border-r border-subtle bg-surface z-20">
         {TOOLS.map((t) => {
            const isActive = t.id === config.id;
            return (
              <button 
                 key={t.id} 
                 onClick={() => navigate('/tools/' + t.slug)}
                 title={t.name}
                 className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isActive ? 'bg-accent/10 text-accent border border-accent/30 shadow-[0_0_10px_rgba(52,245,197,0.1)]' : 'text-muted hover:text-primary hover:bg-elevated'}`}
              >
                 {React.createElement(t.icon as any, { size: 18 })}
              </button>
            )
         })}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex flex-col px-6 py-4 border-b border-subtle bg-elevated/50 backdrop-blur-xl shrink-0 z-10 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-primary">{config.name}</h1>
              <Badge variant="default" className="font-mono text-[10px] uppercase tracking-widest">{config.category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              {shareMethod && (
                 <Button variant="ghost" size="sm" onClick={handleCopyHash} className={copied ? 'text-accent' : 'text-muted'}>
                    {copied ? <Check size={14}/> : <LinkIcon size={14}/>} 
                    <span className="hidden sm:inline-block ml-1">{copied ? 'Copied' : 'Share State'}</span>
                 </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">{config.description}</p>
            <div className="text-[10px] font-mono text-muted uppercase tracking-widest flex items-center gap-2 px-2 py-0.5 bg-surface rounded border border-subtle">
               <span className="w-1.5 h-1.5 bg-accent rounded-full"></span> {config.aiFeatures?.length > 0 ? 'Local + Optional Cloud AI' : '100% Local Execution'}
            </div>
          </div>
          
          <AnimatePresence>
            {sampleBanner && (
              <motion.div 
                 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-2 bg-accent/10 border border-accent/20 text-accent text-xs font-mono px-3 py-1.5 rounded shadow-lg flex items-center gap-2 z-50">
                 Demo loaded. <button className="underline hover:text-white" onClick={onDismissSample}>Clear</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col xl:flex-row relative z-0">
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
          <div className="flex-1 relative z-10 overflow-hidden flex">
             {children}
          </div>
          
          {/* Right Sidebar */}
          {rightSidebar && (
            <div className="w-full xl:w-72 border-t xl:border-t-0 xl:border-l border-subtle bg-surface flex flex-col shrink-0 z-20 overflow-y-auto">
               {rightSidebar.whyItMatters && (
                  <div className="p-4 border-b border-strong">
                     <h3 className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest mb-2">Why this matters</h3>
                     <p className="text-xs text-muted leading-relaxed">{rightSidebar.whyItMatters}</p>
                  </div>
               )}
               {rightSidebar.presets && rightSidebar.presets.length > 0 && (
                  <div className="p-4 border-b border-strong">
                     <h3 className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest mb-2">Examples</h3>
                     <div className="flex flex-col gap-1.5">
                        {rightSidebar.presets.map((p: any, i: number) => (
                           <button key={i} onClick={p.onClick} className="text-left py-1.5 px-2 rounded hover:bg-elevated text-xs text-muted hover:text-primary transition-colors border border-transparent hover:border-subtle truncate">
                              {p.label}
                           </button>
                        ))}
                     </div>
                  </div>
               )}
               {toolExamples && toolExamples.length > 0 && (
                  <div className="p-4 border-b border-strong">
                     <h3 className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest mb-2">Common Patterns</h3>
                     <div className="flex flex-col gap-1.5">
                        {toolExamples.map((ex, i) => (
                           <Link key={i} to={`/tools/${config.slug}/examples/${ex.exampleSlug}`} className="text-left py-1.5 px-2 rounded hover:bg-elevated text-xs text-muted hover:text-primary transition-colors border border-transparent hover:border-subtle truncate block">
                              {ex.h1.replace(`Regex pattern: `, '').replace(`Cron expression: `, '').replace(`Decode `, '')}
                           </Link>
                        ))}
                     </div>
                  </div>
               )}
               {rightSidebar.shortcuts && (
                  <div className="p-4">
                     <h3 className="text-[10px] font-bold text-primary font-mono uppercase tracking-widest mb-2">Shortcuts</h3>
                     <div className="flex flex-col gap-2">
                        {rightSidebar.shortcuts.map((s: any, i: number) => (
                           <div key={i} className="flex items-center justify-between text-xs text-muted">
                              <span>{s.label}</span>
                              <kbd className="font-mono bg-elevated px-1 border border-subtle rounded">{s.key}</kbd>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
               
               <div className="mt-auto p-4 opacity-50">
                   <div className="text-[10px] font-mono text-muted flex items-center justify-between">
                      <span>CYBERSCRYB {config.category.toUpperCase()}</span>
                      <span>LOCAL</span>
                   </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export const SplitPane = ({ left, right, leftConfig, rightConfig }: any) => {
  return (
    <div className="flex flex-col lg:flex-row h-full">
       <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-subtle bg-base/50 min-h-[50vh] lg:min-h-0 relative">
         <div className="flex justify-between items-center px-4 py-3 bg-surface border-b border-subtle z-10">
            <span className="text-xs font-bold font-mono text-[#34F5C5] uppercase tracking-widest">{leftConfig.title || 'INPUT'}</span>
            <div className="flex gap-2">
               {leftConfig.actions}
            </div>
         </div>
         <div className="flex-1 relative overflow-auto hide-scrollbar p-0">
            {left}
         </div>
       </div>
       <div className="flex-1 flex flex-col bg-base/50 min-h-[50vh] lg:min-h-0 relative">
         <div className="flex justify-between items-center px-4 py-3 bg-surface border-b border-subtle z-10">
            <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest">{rightConfig.title || 'OUTPUT'}</span>
            <div className="flex gap-2">
               {rightConfig.actions}
            </div>
         </div>
         <div className="flex-1 relative overflow-auto hide-scrollbar bg-elevated/20 p-0">
            {right}
         </div>
       </div>
    </div>
  );
};

export const CodeEditor = ({ value, onChange, placeholder, readOnly = false, className, spellCheck=false }: any) => (
  <textarea
     value={value}
     onChange={e => onChange && onChange(e.target.value)}
     readOnly={readOnly}
     placeholder={placeholder}
     spellCheck={spellCheck}
     className={`w-full h-full p-4 bg-transparent text-primary font-mono text-sm resize-none focus:outline-none placeholder:text-muted/50 ${readOnly ? 'opacity-90' : ''} ${className || ''}`}
  />
);

// We export ActionButton for backwards compat in tools until refactored completely
export const ActionButton = ({ onClick, icon: Icon, label, primary }: any) => (
  <Button onClick={onClick} variant={primary ? 'primary' : 'secondary'} size="sm" className="gap-1.5 h-7 px-2">
    {Icon && <Icon size={12} />} {label}
  </Button>
);

