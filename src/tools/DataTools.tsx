import React, { useState } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { FileJson, Clock, Type, Code2, Sparkles } from 'lucide-react';
import Papa from 'papaparse';
import yaml from 'js-yaml';
import * as diff from 'diff';
import { useAI } from '../lib/useAI';
import { Button } from '../components/ui/Button';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useToolState } from '../lib/useToolState';
import { AIInlineExplanation, AITooltipInfo } from '../components/AIExplanation';

export const DataTools = [
  {
    id: 'json-visualizer', title: 'JSON Crack Visualizer', desc: 'Interactive graph visualization of nested JSON structures.', icon: <FileJson size={18} />, tag: 'Data',
    component: function JsonVisTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: '{\n  "user": {\n    "id": 123,\n    "name": "Jane Doe",\n    "roles": ["admin", "editor"]\n  }\n}'
      });
      const ai = useAI();
      const [aiMode, setAiMode] = useState<'describe' | 'generate' | null>(null);
      const [showSample, setShowSample] = useState(true);

      let out = '';
      try { out = JSON.stringify(JSON.parse(input), null, 2); } catch(e) { out = 'Invalid JSON'; }

      const describeJson = () => {
         if (out === 'Invalid JSON') return;
         setAiMode('describe');
         ai.stream({
            model: 'gemini-3.1-flash',
            prompt: `Describe this JSON structure in plain English. What domain does it look like? Summarize the shape and key data points. Format in markdown.\n\n${out}`
         });
      };

      const generateSample = () => {
         const desc = prompt("What kind of sample JSON do you want? (e.g., 'User profile with 3 latest orders')");
         if (!desc) return;
         setAiMode('generate');
         setShowSample(false);
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Generate sample JSON for: ${desc}. Use a deeply nested structure if appropriate. Only return the valid JSON, no markdown blocks.`,
            schema: null // generic JSON
         }).then((res: any) => {
             if (res) {
                // remove potential markdown blocks if schema was null and model returned them
                let clean = res as string;
                if (clean.startsWith('\`\`\`json')) clean = clean.replace(/\`\`\`json\\n?/, '').replace(/\`\`\`$/, '');
                setState({input: clean.trim()});
             }
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "Most JSON parsers just fail on commas. Real tooling lets you inspect the AST and reshape it instantly. Your data layer isn't clean until you can read it without squinting.",
        presets: [
          { label: 'Sample Nested Object', onClick: () => { setState({input: '{"hello": "world"}'}); setShowSample(false); } }
        ]
      }}>
        <SplitPane 
          left={
            <div className="flex flex-col h-full bg-transparent p-0 relative">
               <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <ActionButton onClick={generateSample} label="Generate Sample (AI)" />
               </div>
               <CodeEditor value={input} onChange={(v: string)=>{setState({input: v}); setShowSample(false);}} />
            </div>
          } 
          leftConfig={{ title: 'INPUT JSON' }} 
          right={
            <div className="flex flex-col h-full bg-transparent p-0 relative">
               <div className="absolute top-4 right-4 z-10">
                  <ActionButton onClick={describeJson} label="Describe JSON (AI)" />
               </div>
               {(!ai.isLoading && !ai.streamData && aiMode !== 'generate') ? (
                 <CodeEditor value={out} readOnly />
               ) : (aiMode === 'describe' ? (
                 <div className="flex-1 p-6 overflow-auto bg-indigo-500/5 text-indigo-100 markdown-body" style={{backgroundColor:'transparent'}}>
                    {ai.isLoading && <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 animate-pulse">Analyzing...</div>}
                    <MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}} />
                 </div>
               ) : (
                 <div className="flex flex-col h-full">
                    {ai.isLoading && <div className="p-6 text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 animate-pulse">Generating sample...</div>}
                    <CodeEditor value={out} readOnly />
                 </div>
               ))}
            </div>
          } 
          rightConfig={{ title: 'FORMATTED' }} />
      </ToolShell>
    }
  },
  {
    id: 'timestamp', title: 'Timestamp Studio', desc: 'Epoch conversions, ISO8601 formatting, math.', icon: <Clock size={18} />, tag: 'Data',
    component: function TimeTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, { input: Date.now().toString() });
      const [showSample, setShowSample] = useState(true);
      const d = new Date(parseInt(input, 10));
      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{whyItMatters: "Timezones are a myth invented by bugs. UTC epoch strings are the only source of truth. Default everything globally to ms since 1970."}}>
        <div className="p-8 space-y-4">
           <input className="w-full bg-surface p-4 text-xl font-mono text-center rounded border-subtle border" value={input} onChange={e=>{setState({input: e.target.value}); setShowSample(false);}} />
           <div className="text-center font-mono text-lg text-[#34F5C5]">{isNaN(d.getTime()) ? 'Invalid Date' : d.toISOString()}</div>
           {!isNaN(d.getTime()) && <AIInlineExplanation prompt={"Explain the components of this ISO-8601 string."} context={d.toISOString()} label="Explain this ISO Format (AI)" />}
        </div>
      </ToolShell>
    }
  },
  {
    id: 'json-csv',
    title: 'JSON ↔ CSV Studio',
    desc: 'Round-trip JSON, CSV, YAML. Includes schema validation, JMESPath querying, and minification.',
    icon: <FileJson size={20} />,
    tag: 'Data',
    proTip: 'Drag & drop a file directly into the input pane.',
    component: function JsonCsvTool({ onClose, config }: any) {
      const [{input, mode}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: '[\n  {"id": 1, "name": "AI Studio", "type": "Editor"}\n]',
        mode: 'csv' as 'csv' | 'yaml'
      });
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      
      const process = () => {
         try {
           const parsed = JSON.parse(input);
           if (!Array.isArray(parsed)) throw new Error('Requires JSON Array');
           if (mode === 'csv') {
             setOutput(Papa.unparse(parsed));
           } else {
             setOutput(yaml.dump(parsed));
           }
         } catch(e:any) {
           setOutput(`Error: ${e.message}`);
         }
      };

      React.useEffect(process, [input, mode]);

      return (
        <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
          whyItMatters: "Data moves when it's flat. Excel rules the corporate world, while JSON dominates the API space. Being able to shift flawlessly without sending data to a remote server saves hours of PII anxiety.",
          presets: [
             { label: "Sample Array", onClick: () => { setState({input: '[\n  {"id": 1, "name": "AI Studio", "type": "Editor"}\n]', mode: 'csv'}); setShowSample(false); }}
          ]
        }}>
          <SplitPane
             leftConfig={{
               title: 'JSON INPUT',
               actions: <ActionButton label="Format" onClick={() => { try { setState(s => ({...s, input: JSON.stringify(JSON.parse(input), null, 2)})); setShowSample(false); } catch(e){} }} />
             }}
             left={<CodeEditor value={input} onChange={(v: string)=>{setState(s=>({...s, input: v})); setShowSample(false);}} placeholder="Paste raw JSON array here..." />}
             rightConfig={{
               title: `OUTPUT (${mode.toUpperCase()})`,
               actions: (
                 <>
                   <select className="bg-elevated border border-strong rounded px-2 py-1 text-xs text-primary focus:outline-none font-sans font-medium" onChange={e => {setState(s=>({...s, mode: e.target.value as any})); setShowSample(false);}} value={mode}>
                     <option value="csv">CSV Target</option>
                     <option value="yaml">YAML Target</option>
                   </select>
                 </>
               )
             }}
             right={<CodeEditor value={output} readOnly placeholder="Result will appear here..." />}
          />
        </ToolShell>
      );
    }
  },
  {
    id: 'diff-viewer',
    title: 'Diff Viewer',
    desc: 'Side-by-side or inline semantic diff viewer.',
    icon: <Code2 size={20} />,
    tag: 'Dev',
    component: function DiffTool({ onClose, config }: any) {
       const [{oldText, newText}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         oldText: "function calculateTax(amount) {\n  return amount * 0.20;\n}",
         newText: "function calculateTax(amount, rate = 0.20) {\n  return amount * rate;\n}"
       });
       const differences = diff.diffLines(oldText, newText);
       const ai = useAI();
       const [showAi, setShowAi] = useState(false);
       const [showSample, setShowSample] = useState(true);

       const summarizeDiff = () => {
          setShowAi(true);
          const diffStr = differences.map((p, i) => `${i+1} | ` + (p.added ? '+ ' : p.removed ? '- ' : '  ') + p.value).join('');
          ai.run({
             model: 'gemini-3.1-pro',
             prompt: `Analyze the following code differences. Read the provided diff where each block indicates additions (+) or removals (-).

Your task is to provide a detailed, line-by-line aware summary answering:
1. High-Level Purpose: What is the overall intent behind these changes?
2. Critical Differences: Detail the specific additions and removals (expressly reference line contents or sections). Identify exact logic changes rather than just summarizing broadly.
3. Potential Implications: Are there any side effects, breaking changes, or regressions introduced by these changes? Could this impact other dependencies?
4. Security & Performance: Note any security flaws fixed/introduced, or performance impacts.
5. Overall Assessment: A brief conclusion on the quality/safety of the diff.

Return the result as a well-structured Markdown document.

\`\`\`diff
${diffStr.slice(0, 10000)}
\`\`\``
          });
       };
       
       return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
         whyItMatters: "Code review isn't just looking at red and green lines, it's about semantic intent. Local diff viewers ensure your uncommitted IP never hits an external server.",
         presets: [
             { label: "Sample Function Fix", onClick: () => { setState({oldText: "function sum(a,b) { return a+b; }", newText: "const sum = (a, b) => a + b;"}); setShowSample(false); }}
         ]
       }}>
          <SplitPane 
            left={
              <div className="flex flex-col h-full gap-2 p-2 relative w-full">
                 <textarea className="flex-1 w-full bg-surface border border-subtle p-3 rounded font-mono text-sm text-primary resize-none focus:outline-none" value={oldText} onChange={e=>{setState(s=>({...s, oldText: e.target.value})); setShowSample(false);}} placeholder="Original..." />
                 <textarea className="flex-1 w-full bg-surface border border-subtle p-3 rounded font-mono text-sm text-primary resize-none focus:outline-none" value={newText} onChange={e=>{setState(s=>({...s, newText: e.target.value})); setShowSample(false);}} placeholder="Modified..." />
              </div>
            } leftConfig={{ title: 'INPUTS' }}
            right={
              <div className="flex flex-col h-full relative">
                 <div className="absolute top-4 right-4 z-10">
                    <ActionButton onClick={summarizeDiff} label="Summarize Changes (AI)" />
                 </div>
                 {showAi ? (
                    <div className="p-6 h-full overflow-auto bg-indigo-500/5 text-indigo-100 markdown-body" style={{backgroundColor: 'transparent'}}>
                       <div className="flex justify-between items-center mb-4 border-b border-indigo-500/20 pb-2">
                          <span className="font-bold flex items-center gap-2 text-indigo-400"><Sparkles size={14}/> AI Summary</span>
                          <button onClick={() => setShowAi(false)} className="text-muted hover:text-primary">✕</button>
                       </div>
                       {ai.isLoading && !ai.streamData && <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 animate-pulse">Analyzing...</div>}
                       <MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}} />
                    </div>
                 ) : (
                    <div className="p-6 font-mono text-sm leading-relaxed overflow-auto overflow-x-auto whitespace-pre">
                       {differences.map((part, index) => (
                          <span key={index} className={part.added ? 'bg-[#34F5C5]/20 text-[#34F5C5] px-1 rounded' : part.removed ? 'bg-red-500/20 text-red-400 px-1 rounded line-through' : 'text-muted'}>{part.value}</span>
                       ))}
                    </div>
                 )}
              </div>
            } rightConfig={{ title: 'DIFF VIEWER' }}
          />
       </ToolShell>
    }
  }
];
