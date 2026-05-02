import React, { useState } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { Type, Play, Code, Clock, Sparkles } from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useAI } from '../lib/useAI';
import { Button } from '../components/ui/Button';
import { useToolState } from '../lib/useToolState';
import cronstrue from 'cronstrue';
import parser from 'cron-parser';

export const DevTools = [
  {
    id: 'cron', title: 'Cron Expression Builder', desc: 'Visual builder for cron expressions with human translation.', icon: <Clock size={18} />, tag: 'Dev',
    component: function CronTool({ onClose, config }: any) {
       const [{cron}, setState, shareUrl, copyShareLink] = useToolState(config.id, { cron: '*/15 9-17 * * 1-5' });
       const [showSample, setShowSample] = useState(true);

       let human = '';
       let nextRun = [];
       try {
         human = cronstrue.toString(cron);
         const interval = parser.parseExpression(cron);
         for(let i=0; i<5; i++) {
            nextRun.push(interval.next().toString());
         }
       } catch(e) {
         human = 'Invalid cron expression';
       }

       return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
         whyItMatters: "Cron strings are write-only code. Human-readable translation plus evaluating the exact next 5 ticks is the only way to prove your backup job won't fire at noon instead of midnight.",
         presets: [
             { label: 'Every 15 Minutes', onClick: () => {setState({cron: '*/15 * * * *'}); setShowSample(false);}},
             { label: 'Every Weekday 9am', onClick: () => {setState({cron: '0 9 * * 1-5'}); setShowSample(false);}}
         ]
       }}>
          <div className="p-12 flex flex-col items-center h-full w-full justify-center overflow-auto w-full">
             <input type="text" value={cron} onChange={e=>{setState({cron: e.target.value}); setShowSample(false);}} className="w-full max-w-xl text-center bg-surface border-strong border p-4 rounded text-3xl font-mono text-primary focus:outline-none focus:border-accent shadow-inner"/>
             <div className="mt-8 text-2xl font-bold text-accent">{human}</div>
             {nextRun.length > 0 && (
                <div className="mt-12 bg-elevated border border-subtle rounded-lg p-6 w-full max-w-xl">
                   <h3 className="text-xs uppercase tracking-widest font-bold text-muted mb-4 font-mono">Next 5 Ticks</h3>
                   <ul className="space-y-2 font-mono text-sm text-primary">
                      {nextRun.map((r, i) => <li key={i} className="py-2 border-b border-subtle/50 last:border-0">{r}</li>)}
                   </ul>
                </div>
             )}
          </div>
       </ToolShell>
    }
  },
  {
    id: 'markdown', title: 'Markdown Lab', desc: 'Live preview, syntax highlighting, GFM.', icon: <Code size={18} />, tag: 'Dev',
    component: function MdTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         input: '# Markdown Lab\n\nWrite some **Markdown** here.\n\n```ts\nconsole.log("Hello local execution");\n```\n\n- Lists\n- Links\n- Tables\n\n'
      });
      const [showSample, setShowSample] = useState(true);
      
      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "A good markdown editor parses GitHub Flavored Markdown locally without sending your private docs over the wire for rendering.",
        presets: [ { label: 'Clear Editor', onClick: ()=>{setState({input:''});setShowSample(false);}}]
      }}>
        <SplitPane 
          left={<CodeEditor value={input} onChange={(v: string)=>{setState({input:v});setShowSample(false);}} placeholder="Type Markdown here..."/>} 
          leftConfig={{ title: 'MARKDOWN SOURCE' }}
          right={
            <div className="p-6 overflow-auto h-full markdown-body bg-transparent" style={{backgroundColor: 'transparent'}} data-color-mode="dark">
              <MarkdownPreview source={input} style={{backgroundColor:'transparent', color:'inherit'}} />
            </div>
          } 
          rightConfig={{ title: 'LIVE PREVIEW' }}
        />
      </ToolShell>;
    }
  },
  {
    id: 'regex-playground', title: 'Regex Playground Pro', desc: 'Multi-flavor, named groups, replace.', icon: <Type size={18} />, tag: 'Dev',
    component: function RegexTool({ onClose, config }: any) {
      const [{regex, flags, testStr}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         regex: '\\b\\w+@\\w+\\.\\w+\\b',
         flags: 'g',
         testStr: 'Contact us at support@example.com or sales@test.org for more info.'
      });
      const [showSample, setShowSample] = useState(true);
      const ai = useAI();
      const [aiMode, setAiMode] = useState<'explain' | 'generate' | null>(null);
      
      let matches: RegExpMatchArray[] = [];
      let err = '';
      try {
         const re = new RegExp(regex, flags);
         matches = [...testStr.matchAll(re)];
      } catch(e:any) { err = e.message; }

      const handleExplain = () => {
         setAiMode('explain');
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Explain this regular expression in plain English: /${regex}/${flags}. Break down the pattern, named groups, edge cases, and give an example match and non-match. Format in markdown.`,
         });
      };

      const handleGenerate = () => {
         const desc = prompt("What should the regex match? (e.g., 'Valid email address')");
         if (!desc) return;
         setAiMode('generate');
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Generate a regular expression for: ${desc}. Return ONLY JSON.`,
            schema: {
               type: 'object',
               properties: {
                  regex: { type: 'string', description: 'The regex pattern without slashes' },
                  flags: { type: 'string', description: 'Regex flags (g, i, m)' },
                  explanation: { type: 'string' }
               },
               required: ['regex', 'flags', 'explanation']
            }
         }).then((res: any) => {
             if (res && res.regex) {
                setState(s => ({...s, regex: res.regex, flags: res.flags}));
                setShowSample(false);
             }
         });
      };

      const presets = [
        { label: 'Email', r: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', f: 'g' },
        { label: 'URL', r: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$', f: 'g' },
        { label: 'IPv4', r: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$', f: 'g' },
        { label: 'Hex Color', r: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', f: 'g' }
      ];

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "Most regex testers run your string against an external server's PCRE engine. This runs strictly inside the browser's V8 Regex engine, guaranteeing your test data stays local.",
        presets: presets.map(p => ({
           label: p.label, onClick: () => { setState(s=>({...s, regex: p.r, flags: p.f})); setShowSample(false); }
        })),
        shortcuts: []
      }}>
         <SplitPane 
           leftConfig={{
             title: 'EXPRESSION & TEST',
             actions: (
                <div className="flex gap-2">
                   <ActionButton onClick={() => navigator.clipboard.writeText(`/${regex}/${flags}`)} label="Copy /re/" />
                   <ActionButton onClick={() => {setState(s=>({...s, regex:'', testStr:''})); setShowSample(false);}} label="Clear" />
                </div>
             )
           }}
           left={
              <div className="flex flex-col h-full bg-base p-6 gap-6 overflow-auto">
                 <div className="flex gap-2">
                    <Button size="sm" onClick={handleExplain} disabled={ai.isLoading} className="gap-2 shrink-0">
                       <Sparkles size={14}/> {ai.isLoading && aiMode === 'explain' ? 'Explaining...' : 'Explain (AI)'}
                    </Button>
                    <Button size="sm" onClick={handleGenerate} variant="secondary" className="gap-2 shrink-0">
                       <Sparkles size={14}/> Generate (AI)
                    </Button>
                 </div>
                 
                 {(aiMode && (ai.isLoading || ai.streamData || ai.result)) && (
                    <div className="bg-elevated border border-accent/20 p-4 rounded-lg text-sm text-primary flex flex-col gap-2 relative">
                       <button onClick={() => setAiMode(null)} className="absolute top-2 right-2 text-muted hover:text-primary">✕</button>
                       <div className="flex justify-between items-center mb-2">
                          <span className="font-bold flex items-center gap-2 text-accent"><Sparkles size={14}/> AI Response</span>
                       </div>
                       {aiMode === 'explain' && <div className="markdown-body bg-transparent text-sm opacity-90"><MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}}/></div>}
                       {aiMode === 'generate' && ai.result && <div className="text-sm opacity-90">{ai.result.explanation}</div>}
                       {ai.error && <p className="text-danger">Error: {ai.error.message}</p>}
                    </div>
                 )}

                 <div className="flex flex-col gap-2">
                    <label className="text-xs font-mono tracking-widest text-muted font-bold uppercase">Pattern</label>
                    <div className="flex bg-surface rounded-lg border border-strong shadow-inner overflow-hidden focus-within:ring-1 focus-within:ring-accent focus-within:border-accent transition-all">
                       <div className="px-4 py-3 text-muted font-mono bg-elevated border-r border-strong items-center flex font-bold">/</div>
                       <input type="text" className="flex-1 bg-transparent px-4 font-mono text-accent text-lg focus:outline-none" value={regex} spellCheck={false} onChange={e=>{setState(s=>({...s,regex:e.target.value}));setShowSample(false);}} />
                       <div className="px-4 py-3 text-muted font-mono bg-elevated border-l border-strong items-center flex font-bold">/</div>
                       <input type="text" className="w-20 bg-transparent px-2 font-mono text-indigo-400 focus:outline-none" value={flags} spellCheck={false} onChange={e=>{setState(s=>({...s,flags:e.target.value}));setShowSample(false);}} />
                    </div>
                 </div>
                 
                 <div className="flex-1 flex flex-col min-h-[200px]">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-xs font-mono tracking-widest text-muted font-bold uppercase">Test String</label>
                       <span className="text-xs text-muted font-mono">{testStr.length} chars</span>
                    </div>
                    <textarea className="flex-1 bg-surface border border-strong rounded-lg p-4 font-mono text-primary resize-none focus:outline-none focus:ring-1 focus:ring-accent transition-all leading-relaxed" spellCheck={false} value={testStr} onChange={e=>{setState(s=>({...s,testStr:e.target.value}));setShowSample(false);}} />
                 </div>
              </div>
           }
           rightConfig={{
             title: `RESULTS (${matches.length})`,
             actions: matches.length > 0 ? <ActionButton onClick={() => navigator.clipboard.writeText(JSON.stringify(matches, null, 2))} label="Copy JSON" /> : null
           }}
           right={
              <div className="flex flex-col h-full bg-base overflow-hidden">
                 <div className="flex-1 p-6 overflow-auto bg-surface">
                    {err ? (
                       <div className="p-4 bg-danger/10 border border-danger/20 text-danger rounded-lg font-mono text-sm">{err}</div>
                    ) : (
                       <div className="space-y-4">
                          {matches.map((m,i) => (
                             <div key={i} className="bg-elevated rounded-lg border border-strong overflow-hidden shadow-sm">
                                <div className="px-4 py-2 border-b border-subtle bg-base flex justify-between items-center">
                                   <span className="text-xs font-mono text-muted">Match #{i+1}</span>
                                   <span className="text-xs font-mono text-muted">Index: {m.index}</span>
                                </div>
                                <div className="p-4 flex flex-col gap-3">
                                   <div className="font-mono text-sm break-all text-accent bg-accent/10 px-3 py-2 rounded border border-accent/20">
                                      {m[0]}
                                   </div>
                                   {m.length > 1 && (
                                     <div className="mt-2 text-xs">
                                        <div className="font-bold text-muted uppercase tracking-widest mb-2 font-mono">Capture Groups</div>
                                        <div className="space-y-2">
                                           {Array.from(m).slice(1).map((g, gIdx) => (
                                              <div key={gIdx} className="flex gap-4 p-2 bg-base rounded border border-subtle items-center">
                                                 <span className="w-6 h-6 rounded-full bg-surface border border-strong flex items-center justify-center font-mono text-muted text-[10px]">{gIdx + 1}</span>
                                                 <span className="font-mono text-primary break-all">{g || <span className="text-muted/50 italic">undefined</span>}</span>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                   )}
                                   {m.groups && Object.keys(m.groups).length > 0 && (
                                     <div className="mt-2 text-xs">
                                        <div className="font-bold text-muted uppercase tracking-widest mb-2 font-mono">Named Groups</div>
                                        <div className="space-y-2">
                                           {Object.entries(m.groups).map(([k, v]) => (
                                              <div key={k} className="flex gap-4 p-2 bg-base rounded border border-subtle items-center">
                                                 <span className="px-2 py-0.5 rounded bg-surface border border-strong font-mono text-indigo-400 text-[10px]">{k}</span>
                                                 <span className="font-mono text-primary break-all">{v || <span className="text-muted/50 italic">undefined</span>}</span>
                                              </div>
                                           ))}
                                        </div>
                                     </div>
                                   )}
                                </div>
                             </div>
                          ))}
                          {!err && matches.length === 0 && (
                            <div className="text-center py-12 text-muted">No matches found in the test string.</div>
                          )}
                       </div>
                    )}
                 </div>
                 
                 {/* Cheatsheet Footer */}
                 <div className="bg-elevated border-t border-strong p-4 text-xs font-mono text-muted/70 flex justify-between h-auto">
                    <span className="font-bold uppercase tracking-widest">Cheatsheet</span>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-2 mt-2 w-full">
                       <div><span className="text-primary font-bold">^</span> Start of string</div>
                       <div><span className="text-primary font-bold">$</span> End of string</div>
                       <div><span className="text-primary font-bold">\b</span> Word boundary</div>
                       <div><span className="text-primary font-bold">\d</span> Digit</div>
                       <div><span className="text-primary font-bold">.*</span> Any chars</div>
                       <div><span className="text-primary font-bold">(.+)</span> Capture group</div>
                       <div><span className="text-primary font-bold">?=&lt;</span> Lookahead</div>
                       <div><span className="text-primary font-bold">\w</span> Word char</div>
                    </div>
                 </div>
              </div>
           }
         />
      </ToolShell>;
    }
  }
];
