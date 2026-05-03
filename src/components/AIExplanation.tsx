import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { useAI } from '../lib/useAI';

export function AIInlineExplanation({ prompt, context, label = "AI Explanation" }: { prompt: string, context: string, label?: string }) {
  const ai = useAI();
  const [open, setOpen] = useState(false);

  const fetchExplanation = async () => {
    if (open) {
      setOpen(false);
      ai.cancel();
      return;
    }
    setOpen(true);
    try {
      await ai.run({
        model: 'gemini-3.1-flash',
        prompt: `${prompt}\nContext value: ${context}\nKeep the explanation very concise, 1-2 short sentences. Avoid markdown blocks.`,
      });
    } catch (e) {
      // Intentionally ignore aborts or let boundary handle errors
    }
  };

  return (
    <div className="mt-2 text-sm w-full max-w-xl mx-auto">
      <button 
        onClick={fetchExplanation} 
        disabled={ai.isLoading && !open}
        className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none"
      >
        <Sparkles size={12} />
        {ai.isLoading ? 'Thinking...' : open ? 'Close Explanation' : label}
      </button>
      
      {open && (
        <div className="mt-2 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-indigo-200 text-xs leading-relaxed animate-in fade-in slide-in-from-top-2">
          {ai.isLoading ? (
            <span className="animate-pulse">Loading AI explanation...</span>
          ) : ai.error ? (
            <span className="text-red-400">Failed to load explanation.</span>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: String(ai.result || '').replace(/\n/g, '<br/>') }} />
          )}
        </div>
      )}
    </div>
  );
}

export function AITooltipInfo({ prompt, value, children }: { prompt: string, value: string, children: React.ReactNode }) {
  const ai = useAI();
  const [open, setOpen] = useState(false);

  const handleFetch = async () => {
    setOpen(true);
    if (!ai.result && !ai.isLoading) {
      try {
        await ai.run({
          model: 'gemini-3.1-flash',
          prompt: `${prompt}\nContext: ${value}\nProvide a very brief 1-2 sentence explanation. Do not use formatting, just plain text.`,
        });
      } catch (e) {}
    }
  };

  return (
    <div className="relative inline-block">
      <div 
        onMouseEnter={handleFetch}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex cursor-help"
      >
        {children}
      </div>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-elevated border border-indigo-500/30 shadow-2xl rounded-lg text-xs leading-relaxed animate-in fade-in zoom-in-95 pointer-events-none">
          <div className="text-indigo-400 font-bold mb-1 flex items-center gap-1.5">
            <Sparkles size={12} /> AI Insight
          </div>
          <div className="text-muted">
            {ai.isLoading ? (
              <span className="animate-pulse text-indigo-300">Thinking...</span>
            ) : ai.error ? (
              <span className="text-red-400">Failed.</span>
            ) : (
              ai.result || ''
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-indigo-500/30"></div>
        </div>
      )}
    </div>
  );
}
