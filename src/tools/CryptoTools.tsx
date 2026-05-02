import React, { useState, useEffect } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { ShieldCheck, Hash, Fingerprint, Key, Lock } from 'lucide-react';
import CryptoJS from 'crypto-js';
import zxcvbn from 'zxcvbn';
import { Base64 } from 'js-base64';
import { useAI } from '../lib/useAI';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useToolState } from '../lib/useToolState';

export const CryptoTools = [
  {
    id: 'encryption', title: 'Encryption Lab', desc: 'Symmetric & Asymmetric lab. AES-GCM, ChaCha20, RSA generation.', icon: <Lock size={18} />, tag: 'Crypto',
    component: function EncTool({ onClose, config }: any) {
      const [{input, key, mode}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: 'Generic payload initialized.',
        key: 'secret-key',
        mode: 'enc' as 'enc' | 'dec'
      });
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      
      const process = () => {
         try {
           if (!input) return setOutput('');
           if (mode === 'enc') setOutput(CryptoJS.AES.encrypt(input, key).toString());
           else setOutput(CryptoJS.AES.decrypt(input, key).toString(CryptoJS.enc.Utf8) || 'Decryption failed. Invalid key or corrupted payload.');
         } catch(e:any) { setOutput('Error: ' + e.message); }
      };

      React.useEffect(process, [input, key, mode]);

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={() => setShowSample(false)} rightSidebar={{
        whyItMatters: "AES-GCM rules the world, but rolling your own crypto in JS is a known footgun. True end-to-end encryption means the key never touches the server. Use WebCrypto for performance, but CryptoJS is fine for exploring.",
        presets: [
          { label: 'Sample Payload', onClick: () => { setState({input: 'Confidential business data', key: 'super-secret', mode: 'enc'}); setShowSample(false); } }
        ],
        shortcuts: []
      }}>
        <SplitPane 
           leftConfig={{ 
              title: mode === 'enc' ? 'PLAINTEXT INPUT' : 'ENCRYPTED PAYLOAD',
              actions: (
                 <div className="flex bg-surface rounded-lg border border-subtle overflow-hidden">
                    <button className={`px-4 py-1 text-xs font-bold tracking-widest uppercase transition-colors ${mode==='enc' ? 'bg-[#34F5C5]/20 text-[#34F5C5]' : 'text-muted hover:text-primary'}`} onClick={() => { setState(s => ({...s, mode: 'enc'})); setShowSample(false); }}>Encrypt</button>
                    <button className={`px-4 py-1 text-xs font-bold tracking-widest uppercase transition-colors ${mode==='dec' ? 'bg-indigo-500/20 text-indigo-400' : 'text-muted hover:text-primary'}`} onClick={() => { setState(s => ({...s, mode: 'dec'})); setShowSample(false); }}>Decrypt</button>
                 </div>
              )
           }} 
           left={
              <div className="flex flex-col h-full bg-surface/30 p-2">
                 <div className="p-4 mb-2 shrink-0 space-y-2 border-b border-subtle/50 pb-6">
                    <label className="block text-xs font-bold text-muted uppercase tracking-widest font-mono">Encryption Key</label>
                    <div className="relative">
                       <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                       <input type="password" className="w-full bg-elevated border border-strong rounded-lg pl-10 pr-4 py-3 text-primary font-mono focus:border-[#34F5C5] focus:outline-none transition-colors" value={key} onChange={e => { setState(s => ({...s, key: e.target.value})); setShowSample(false); }} placeholder="Enter a secure key..." />
                    </div>
                 </div>
                 <CodeEditor value={input} onChange={(val: string) => { setState(s => ({...s, input: val})); setShowSample(false); }} placeholder={mode === 'enc' ? "Enter text to encrypt..." : "Paste generic AES encrypted payload..."} />
              </div>
           } 
           rightConfig={{ title: mode === 'enc' ? 'ENCRYPTED PAYLOAD (AES)' : 'DECRYPTED PLAINTEXT' }}
           right={<CodeEditor value={output} readOnly placeholder="Result will appear here automatically..." />}
        />
      </ToolShell>;
    }
  },
  {
    id: 'jwt', title: 'JWT Inspector', desc: 'Decode header, payload, and signature of JSON Web Tokens.', icon: <Key size={18} />, tag: 'Security',
    component: function JwtTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      });
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      const ai = useAI();

      React.useEffect(() => {
        if (!input.trim()) {
           setOutput('');
           return;
        }
        try {
          const parts = input.trim().split('.');
          if(parts.length < 2) { setOutput('Invalid JWT: A valid JWT consists of three parts separated by dots.'); return; }
          const header = JSON.stringify(JSON.parse(Base64.decode(parts[0])), null, 2);
          const payload = JSON.stringify(JSON.parse(Base64.decode(parts[1])), null, 2);
          setOutput(`== HEADER ==\n${header}\n\n== PAYLOAD ==\n${payload}`);
        } catch(e) { setOutput('Error decoding JWT structure.'); }
      }, [input]);

      const handleExplain = () => {
         if (!output || output.includes('Invalid') || output.includes('Error')) return;
         ai.stream({
            model: 'gemini-3.1-pro',
            prompt: `Explain this JWT payload and header in human terms. Look for red flags (expired, weak algorithms, missing claims). Return in markdown.\n\n${output}`
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "JWTs are just base64-encoded JSON. They are signed, not encrypted. Never put PII or secrets in a JWT payload. If you see 'alg: none' in the header, run.",
        presets: [
          { label: 'Sample HS256', onClick: () => { setState({input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}); setShowSample(false); } }
        ]
      }}>
        <SplitPane 
          left={<CodeEditor value={input} onChange={(v: string)=>{ setState({input: v}); setShowSample(false); }} placeholder="Paste JWT here (ey...)" />} 
          leftConfig={{ title: 'ENCODED TOKEN' }} 
          right={
            <div className="flex flex-col h-full bg-transparent p-0 relative">
               <div className="absolute top-4 right-4 z-10">
                  <ActionButton onClick={handleExplain} label="Explain Claims (AI)" />
               </div>
               {(!ai.isLoading && !ai.streamData) ? (
                 <CodeEditor value={output} readOnly />
               ) : (
                 <div className="flex-1 p-6 overflow-auto bg-indigo-500/5 text-indigo-100 markdown-body" style={{backgroundColor:'transparent'}}>
                    {ai.isLoading && <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-4 animate-pulse">Analyzing...</div>}
                    <MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}} />
                 </div>
               )}
            </div>
          } 
          rightConfig={{ title: 'DECODED' }}/>
      </ToolShell>;
    }
  },
  {
    id: 'uuid', title: 'ID Forge', desc: 'Generate UUIDv4, NanoID, ULID, custom alphabets.', icon: <Hash size={18} />, tag: 'Crypto',
    component: function UuidTool({ onClose, config }: any) {
      const [output, setOutput] = useState('');
      const gen = () => setOutput(Array.from({length: 10}).map(() => crypto.randomUUID()).join('\n'));
      return <ToolShell config={config} onClose={onClose} rightSidebar={{whyItMatters: "UUIDv4 is great until it destroys your database index locality. Default to UUIDs for distributed uniqueness, but consider ULIDs for sortable primary keys."}}>
        <div className="p-8">
           <ActionButton onClick={gen} label="Generate 10x UUIDv4" primary />
           <CodeEditor value={output} readOnly className="mt-4" />
        </div>
      </ToolShell>;
    }
  },
  {
    id: 'base64', title: 'Base64 Studio', desc: 'Auto-detect mode, URL-safe, chunks, Hex.', icon: <Hash size={18} />, tag: 'Encoding',
    component: function Base64Tool({ onClose, config }: any) {
      const [{input, mode}, setState, shareUrl, copyShareLink] = useToolState(config.id, {input: 'SGVsbG8gQ3liZXJTY3J5Yg==', mode: 'decode' as 'encode' | 'decode'});
      const [output, setOutput] = useState('');
      const [showSample, setShowSample] = useState(true);
      const process = () => {
        try {
           if (mode === 'encode') setOutput(Base64.encode(input));
           else setOutput(Base64.decode(input));
        } catch(e:any) { setOutput('Error: ' + e.message); }
      };
      
      React.useEffect(process, [input, mode]);

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{whyItMatters: "Base64 expands payloads by 33%. It's strictly for transport encoding binary over text protocols, not encryption or minification."}}>
        <SplitPane 
          left={<CodeEditor value={input} onChange={(v: string)=>{setState(s=>({...s, input: v})); setShowSample(false);}}/>} 
          leftConfig={{ actions: <><ActionButton onClick={()=>{setState(s=>({...s, mode: 'encode'})); setShowSample(false);}} primary={mode==='encode'} label="Encode"/><ActionButton onClick={()=>{setState(s=>({...s, mode: 'decode'})); setShowSample(false);}} primary={mode==='decode'} label="Decode"/></> }} 
          right={<CodeEditor value={output} readOnly/>} rightConfig={{}}/>
      </ToolShell>;
    }
  },
  {
    id: 'password', title: 'Password Checker', desc: 'Entropy analysis, crack time, generator.', icon: <ShieldCheck size={18} />, tag: 'Security',
    component: function PasswordTool({ onClose, config }: any) {
      const [input, setInput] = useState('');
      const score = input ? zxcvbn(input) : null;
      return <ToolShell config={config} onClose={onClose} rightSidebar={{whyItMatters: "Entropy rules everything. A 16-character phrase of dictionary words beats an 8-character random string, always."}}>
        <div className="p-8 max-w-xl mx-auto space-y-6 flex flex-col h-full justify-center w-full">
          <input type="text" value={input} onChange={e=>setInput(e.target.value)} className="w-full px-6 py-5 bg-surface border border-subtle rounded-xl text-primary text-2xl font-mono text-center focus:outline-none focus:border-[#34F5C5]/50 shadow-inner" placeholder="Enter password to check..." />
          {score && <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 w-full">
             <div className="flex gap-2 h-3 w-full">
                 {[0,1,2,3,4].map((_, i) => (
                    <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i <= score.score ? (score.score<2?'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]':score.score<4?'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]':'bg-[#34F5C5] shadow-[0_0_10px_rgba(52,245,197,0.5)]') : 'bg-elevated'}`}/>
                 ))}
             </div>
             <div className="text-center font-mono">
               <div className="text-sm text-muted uppercase tracking-widest mb-1">Estimated Crack Time</div>
               <div className="text-3xl text-primary font-bold">{score.crack_times_display.offline_fast_hashing_1e10_per_second}</div>
             </div>
             {score.feedback.warning && <p className="text-red-400 text-center font-bold text-sm bg-red-400/10 py-2 rounded border border-red-500/20">{score.feedback.warning}</p>}
             {score.feedback.suggestions.length > 0 && (
                <ul className="text-xs text-muted list-disc list-inside bg-surface p-4 rounded-lg border border-subtle">
                   {score.feedback.suggestions.map((s,i) => <li key={i}>{s}</li>)}
                </ul>
             )}
          </div>}
        </div>
      </ToolShell>;
    }
  },
  {
    id: 'hash', title: 'Hash Forge', desc: 'MD5, SHA, BLAKE3 generation & comparisons.', icon: <Fingerprint size={18} />, tag: 'Crypto',
    component: function HashTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {input: 'hello world'});
      const ai = useAI();
      const [activeAlgo, setActiveAlgo] = useState<string | null>(null);
      const [showSample, setShowSample] = useState(true);

      const explainAlgo = (algo: string) => {
         setActiveAlgo(algo);
         ai.stream({
            model: 'gemini-3.1-pro',
            prompt: `Explain the cryptographic hash algorithm ${algo}. Cover its primary use cases, collision resistance vulnerabilities, performance notes, and if it's safe for modern usage. Return in Markdown. Keep it brief and punchy.`
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{whyItMatters: "Stop using MD5 for anything except casual checksums. SHA-256 is the absolute baseline. If you're hashing passwords, none of these work—you need bcrypt or Argon2."}}>
         <div className="flex w-full h-full">
            <div className="flex-1 p-8 overflow-auto grid gap-4 grid-cols-1 md:grid-cols-2 content-start">
               <div className="col-span-full mb-4">
                  <textarea className="w-full bg-surface border border-subtle p-4 rounded-lg font-mono text-sm text-primary resize-none h-32 focus:outline-none focus:border-[#34F5C5]" value={input} onChange={e=>{setState({input: e.target.value}); setShowSample(false);}} placeholder="Input string to hash..."/>
               </div>
               {['MD5','SHA1','SHA256','SHA512', 'SHA3'].map(algo => (
                  <div key={algo} className="p-4 bg-surface rounded-lg border border-subtle relative group overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#34F5C5] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-xs text-[#34F5C5] font-mono tracking-widest font-bold uppercase">{algo}</span>
                       <button onClick={() => explainAlgo(algo)} className="text-xs text-muted hover:text-indigo-400 font-mono tracking-widest uppercase pb-0.5 border-b border-transparent hover:border-indigo-400 transition-colors">
                          AI Explain
                       </button>
                    </div>
                    <div className="font-mono text-xs break-all text-primary/80 selection:bg-[#34F5C5]/30">
                       {input ? (CryptoJS as any)[algo](input).toString() : <span className="opacity-30">Enter text to hash...</span>}
                    </div>
                  </div>
               ))}
            </div>
            
            {activeAlgo && (
               <div className="w-[300px] lg:w-[400px] border-l border-subtle bg-surface p-6 overflow-auto flex flex-col shrink-0">
                  <div className="flex justify-between items-center border-b border-subtle pb-4 mb-4">
                     <span className="font-bold text-sm tracking-widest uppercase text-indigo-400">AI: {activeAlgo}</span>
                     <button onClick={() => setActiveAlgo(null)} className="text-muted hover:text-primary">✕</button>
                  </div>
                  {ai.isLoading && !ai.streamData ? (
                     <div className="text-indigo-400 text-xs animate-pulse font-mono tracking-widest uppercase">Loading analysis...</div>
                  ) : (
                     <div className="markdown-body text-sm bg-transparent" style={{backgroundColor: 'transparent'}}><MarkdownPreview source={ai.streamData || ''} style={{backgroundColor:'transparent', color:'inherit'}}/></div>
                  )}
               </div>
            )}
         </div>
      </ToolShell>
    }
  }
];
