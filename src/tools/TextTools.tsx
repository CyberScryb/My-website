import React, { useState } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { FileText, Type, Sparkles } from 'lucide-react';
import { useAI } from '../lib/useAI';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useToolState } from '../lib/useToolState';

export const TextTools = [
  {
    id: 'anti-ai', title: 'Anti-AI Humanizer', desc: 'Evade detectors by normalizing phrasing and entropy. Compares diff.', icon: <Type size={18} />, tag: 'Text',
    component: function AntiAiTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: 'Furthermore, it is pivotal to delve into the multifaceted paradigm of synergistic leverage in a ubiquitous ecosystem.'
      });
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      const ai = useAI();

      const process = () => {
         ai.stream({
            model: 'gemini-3.1-pro',
            prompt: `Rewrite the following text to sound completely human, conversational, and natural. Remove words commonly associated with AI (like 'delve', 'pivotal', 'multifaceted', 'furthermore', 'tapestry', 'synergy'). Improve readability by varying sentence lengths and simplifying complex jargon.\n\nHere is the text:\n${input}\n\nReturn the plain text output directly without extra markdown wrappers unless necessary for formatting.`
         });
      }
      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{whyItMatters: "LLMs have distinct lexical fingerprints. Words like 'delve' and 'robust' are dead giveaways. Normalizing entropy makes text un-detectable but actually legible for humans."}}>
        <SplitPane 
           left={<CodeEditor value={input} onChange={(v: string)=>{setState({input: v});setShowSample(false);}} placeholder="Paste overly-robotic text here..."/>} 
           leftConfig={{ title: 'ROBOTIC INPUT' }} 
           right={
              <div className="h-full overflow-auto p-6 bg-surface/50 text-primary markdown-body">
                 {ai.isLoading && !ai.streamData && <div className="text-muted tracking-widest uppercase text-xs animate-pulse font-bold">Humanizing...</div>}
                 {ai.streamData && <MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}} />}
                 {output && !ai.streamData && !ai.isLoading && <MarkdownPreview source={output} style={{backgroundColor:'transparent', color:'inherit'}} />}
                 {!output && !ai.streamData && !ai.isLoading && <div className="text-muted h-full flex items-center justify-center">Click Humanize to rewrite text.</div>}
              </div>
           } 
           rightConfig={{ 
              title: 'HUMANIZED OUTPUT', 
              actions: <ActionButton onClick={process} label={ai.isLoading ? "Humanizing..." : "Humanize (AI)"} primary disabled={ai.isLoading}/> 
           }} 
        />
      </ToolShell>;
    }
  },
  {
    id: 'lorem', title: 'Lorem Ipsum++', desc: 'Standard, hipster, corporate, hacker jargon profiles.', icon: <FileText size={18} />, tag: 'Text',
    component: function LoremTool({ onClose, config }: any) {
      const [{type, context}, setState, shareUrl, copyShareLink] = useToolState(config.id, { type: 'standard', context: 'A luxury watch brand' });
      const [output, setOutput] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit...');
      const ai = useAI();

      const processText = () => {
         if (type === 'contextual' && context.trim() !== '') {
            ai.stream({
               model: 'gemini-3.1-flash',
               prompt: `Generate exactly 2 paragraphs of placeholder filler text that fits the following context or theme: "${context}". It should look like real text but be largely meaningless filler. Do not use standard Latin lorem ipsum, write actual English sentences that sound related to the theme but say nothing. Return only the text.`
            });
         } else {
            // standard deterministic approaches for immediate result
            const dicts: any = {
              standard: ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'nullam', 'vestibulum', 'aliquet', 'felis', 'et', 'consequat', 'praesent', 'elementum'],
              hacker: ['crypto', 'mainframe', 'botnet', 'cyber', 'terminal', 'override', 'root', 'sudo', 'grep', 'proxy', 'firewall', 'hex', 'buffer', 'overflow', 'payload'],
              corporate: ['synergy', 'leverage', 'paradigm', 'pivot', 'bandwidth', 'alignment', 'agile', 'scrum', 'metrics', 'actionable', 'holistic', 'deliverable', 'ecosystem', 'sync']
            };
            let res = [];
            let d = dicts[type] || dicts['standard'];
            for(let i=0; i<80; i++) {
               let word = d[Math.floor(Math.random()*d.length)];
               if (i === 0 || Math.random() > 0.8) word = word.charAt(0).toUpperCase() + word.slice(1);
               res.push(word);
               if (Math.random() > 0.85) res[res.length-1] += '.';
            }
            setOutput(res.join(' ') + '.');
         }
      };
      
      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} rightSidebar={{whyItMatters: "Client presentations fail when the latin filler is too distracting. Context-aware placeholder text allows stakeholders to evaluate the layout hierarchy without fixating on the copy."}}>
        <div className="flex flex-col h-full bg-base p-8 gap-6 max-w-5xl mx-auto w-full">
           <div className="flex gap-4 p-6 bg-surface border border-subtle rounded-xl shadow-sm items-end flex-wrap">
             <div className="space-y-2">
                 <label className="block text-xs font-bold text-muted uppercase tracking-widest">Mode</label>
                 <select className="bg-elevated border border-strong rounded px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-[#34F5C5] transition-colors" onChange={e => setState(s=>({...s, type: e.target.value}))} value={type}>
                   <option value="standard">Standard Latin</option>
                   <option value="hacker">Hacker / Cyber</option>
                   <option value="corporate">Corporate Speak</option>
                   <option value="contextual">Contextual (AI Gen)</option>
                 </select>
             </div>
             {type === 'contextual' && (
                <div className="space-y-2 flex-1 min-w-[300px]">
                   <label className="block text-xs font-bold text-muted uppercase tracking-widest">Theme Context</label>
                   <input className="w-full bg-elevated border border-strong rounded px-4 py-2.5 text-sm text-primary focus:outline-none focus:border-[#34F5C5] transition-colors" placeholder="e.g. A high-end luxury watch brand" value={context} onChange={e=>setState(s=>({...s, context: e.target.value}))} />
                </div>
             )}
             <Button onClick={processText} isLoading={ai.isLoading} className="gap-2 h-[42px]">
                {type === 'contextual' ? <Sparkles size={16}/> : <FileText size={16}/>} 
                Generate Text
             </Button>
           </div>
           <div className="flex-1 bg-elevated border border-strong rounded-xl p-8 font-serif text-lg leading-relaxed text-primary/80 overflow-auto shadow-inner">
             {ai.isLoading && !ai.streamData && <span className="opacity-50 animate-pulse text-sans text-sm font-bold uppercase tracking-widest">Drafting placeholder text...</span>}
             {type === 'contextual' && ai.streamData ? ai.streamData : output}
           </div>
        </div>
      </ToolShell>;
    }
  },
  {
    id: 'text-toolkit', title: 'Text Toolkit', desc: 'Case converter, slugify, sort, dedupe, count.', icon: <Type size={18} />, tag: 'Text',
    component: function TextApp({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, { input: 'Apple\nBanana\nApple' });
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      const stats = { chars: input.length, words: input.split(/\s+/).filter(Boolean).length, lines: input.split('\n').length };
      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)}>
        <SplitPane 
          left={<CodeEditor value={input} onChange={(v:string)=>{setState({input:v}); setShowSample(false);}} placeholder="Paste text..."/>} 
          leftConfig={{ actions: null, title: 'INPUT TEXT' }}
          right={<CodeEditor value={output} readOnly />} 
          rightConfig={{ actions: (
             <div className="flex gap-2 flex-wrap">
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-subtle px-3 py-1.5 rounded hover:bg-[#34F5C5]/10 hover:border-[#34F5C5]/30 hover:text-[#34F5C5] text-primary transition-all shadow-sm" onClick={()=>setOutput(input.toUpperCase())}>Upper</button>
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-subtle px-3 py-1.5 rounded hover:bg-[#34F5C5]/10 hover:border-[#34F5C5]/30 hover:text-[#34F5C5] text-primary transition-all shadow-sm" onClick={()=>setOutput(input.toLowerCase())}>Lower</button>
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-subtle px-3 py-1.5 rounded hover:bg-[#34F5C5]/10 hover:border-[#34F5C5]/30 hover:text-[#34F5C5] text-primary transition-all shadow-sm" onClick={()=>setOutput(input.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}>Slugify</button>
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-subtle px-3 py-1.5 rounded hover:bg-[#34F5C5]/10 hover:border-[#34F5C5]/30 hover:text-[#34F5C5] text-primary transition-all shadow-sm" onClick={()=>setOutput(input.split('\n').sort().join('\n'))}>Sort Lines</button>
                 <button className="text-[10px] font-bold uppercase tracking-widest bg-surface border border-subtle px-3 py-1.5 rounded hover:bg-[#34F5C5]/10 hover:border-[#34F5C5]/30 hover:text-[#34F5C5] text-primary transition-all shadow-sm" onClick={()=>setOutput(Array.from(new Set(input.split('\n'))).join('\n'))}>Dedupe</button>
             </div>
          ), title: `STATS:  ${stats.chars} Chars  |  ${stats.words} Words  |  ${stats.lines} Lines` }}
        />
      </ToolShell>;
    }
  }
];
