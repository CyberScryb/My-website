import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, Clock, Globe, Github, Compass, Hash, FileText } from 'lucide-react';
import { TOOLS as tools } from '../lib/tools.registry';
import { POSTS as posts } from '../lib/blog.data';
import { motion, AnimatePresence } from 'framer-motion';

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ElementType;
  section: string;
  action: () => void;
};

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Quick actions
  const quickActions: SearchResult[] = [
    { id: 'act_gh', title: 'Open GitHub Repository', icon: Github, section: 'System', action: () => { window.open('https://github.com', '_blank'); onClose(); } },
    { id: 'act_url', title: 'Copy Current URL', icon: Globe, section: 'System', action: () => { navigator.clipboard.writeText(window.location.href); onClose(); } },
    { id: 'act_home', title: 'Go to Home', icon: Compass, section: 'System', action: () => { navigate('/'); onClose(); } },
  ];

  // Map everything to SearchResult
  const allItems: SearchResult[] = useMemo(() => {
    const t = tools.map(tool => ({
      id: `tool_${tool.id}`,
      title: tool.name,
      subtitle: tool.description,
      icon: tool.icon,
      section: 'Tools',
      action: () => { navigate(`/tools/${tool.slug}`); onClose(); }
    }));
    const p = posts.map(post => ({
      id: `post_${post.slug}`,
      title: post.title,
      subtitle: post.snippet,
      icon: FileText,
      section: 'Blog',
      action: () => { navigate(`/blog/${post.slug}`); onClose(); }
    }));
    return [...t, ...p, ...quickActions];
  }, [navigate, onClose]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Return recent tools or defaults when empty
      return allItems.filter(i => i.section === 'Tools').slice(0, 5);
    }
    const lowerQ = query.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(lowerQ) || 
      (item.section.toLowerCase().includes(lowerQ)) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(lowerQ))
    ).slice(0, 15);
  }, [query, allItems]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, results.length]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
         onClose();
         return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, results.length));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + Math.max(1, results.length)) % Math.max(1, results.length));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        results[selectedIndex].action();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Handle scroll into view
  useEffect(() => {
    if (isOpen && listRef.current) {
       const selectedEl = listRef.current.querySelector('[data-selected="true"]');
       if (selectedEl) {
         selectedEl.scrollIntoView({ block: 'nearest' });
       }
    }
  }, [selectedIndex, isOpen]);

  // Group results
  const groupedResults = results.reduce((acc, curr) => {
    if (!acc[curr.section]) acc[curr.section] = [];
    acc[curr.section].push(curr);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  let absoluteIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-base/60 backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-2xl bg-elevated/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-strong overflow-hidden flex flex-col max-h-[80vh]"
          >
            <div className="flex items-center px-4 py-4 border-b border-subtle bg-base/50">
               <Search size={20} className="text-muted mr-3" />
               <input
                 ref={inputRef}
                 className="flex-1 bg-transparent border-none text-primary text-lg focus:outline-none placeholder-muted/50 font-sans"
                 placeholder="Search tools, read blogs, or type a command..."
                 value={query}
                 onChange={(e) => setQuery(e.target.value)}
               />
               <kbd className="text-[10px] font-mono text-muted tracking-widest uppercase border border-subtle bg-surface px-1.5 py-0.5 rounded">ESC</kbd>
            </div>
            
            <div ref={listRef} className="overflow-y-auto flex-1 p-2 scrollbar-hide">
               {results.length === 0 ? (
                 <div className="p-12 text-center text-muted flex flex-col items-center">
                    <Search className="w-12 h-12 opacity-20 mb-4" />
                    <p>No matches found for "{query}"</p>
                 </div>
               ) : (
                 <div className="space-y-4 pb-2">
                    {Object.entries(groupedResults).map(([section, items]) => (
                       <div key={section}>
                          <div className="px-3 py-2 text-[10px] font-bold text-muted tracking-widest uppercase">
                             {query === '' && section === 'Tools' ? 'Recent Tools' : section}
                          </div>
                          <div className="space-y-1">
                             {items.map(item => {
                                const isSelected = absoluteIndex === selectedIndex;
                                const currentIndex = absoluteIndex;
                                absoluteIndex++;
                                return (
                                   <div 
                                      key={item.id} 
                                      data-selected={isSelected}
                                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                                      onClick={() => item.action()} 
                                      className={`px-3 py-3 cursor-pointer rounded-xl flex items-center gap-4 transition-all duration-150 ${isSelected ? 'bg-accent/10 border-accent/20 border text-accent shadow-[inset_0_0_12px_rgba(52,245,197,0.1)]' : 'border border-transparent text-primary hover:bg-surface'}`}
                                   >
                                      <div className={isSelected ? 'text-accent' : 'text-muted'}>
                                         <item.icon size={18} strokeWidth={isSelected ? 2.5 : 2} />
                                      </div>
                                      <div className="flex-1 flex flex-col justify-center min-w-0">
                                         <div className={`font-medium ${isSelected ? 'text-accent' : 'text-primary'}`}>{item.title}</div>
                                         {item.subtitle && <div className={`text-xs truncate ${isSelected ? 'text-accent/70' : 'text-muted/70'}`}>{item.subtitle}</div>}
                                      </div>
                                      {isSelected && (
                                         <kbd className="hidden sm:inline-block ml-auto text-[10px] font-mono text-accent tracking-widest uppercase border border-accent/30 bg-accent/10 px-2 py-0.5 rounded">ENTER</kbd>
                                      )}
                                   </div>
                                );
                             })}
                          </div>
                       </div>
                    ))}
                 </div>
               )}
            </div>
            <div className="px-4 py-2 flex items-center justify-between border-t border-subtle bg-base/50 text-[10px] uppercase font-mono tracking-widest text-muted/50">
               <div>CyberScryb OS</div>
               <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><span className="px-1 border border-subtle rounded text-muted">↑↓</span> Navigate</span>
                  <span className="flex items-center gap-1"><span className="px-1 border border-subtle rounded text-muted">TAB</span> Actions</span>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
