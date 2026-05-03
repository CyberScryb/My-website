import React, { useState } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { Search, Globe, Code2, Server, Sparkles } from 'lucide-react';
import { useAI } from '../lib/useAI';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { useToolState } from '../lib/useToolState';
import { AIInlineExplanation, AITooltipInfo } from '../components/AIExplanation';

export const WebTools = [
  {
    id: 'curl-code', title: 'cURL ↔ Code', desc: 'Convert cURL commands to fetch, axios, Python, Go, Rust.', icon: <Code2 size={18} />, tag: 'Dev',
    component: function CurlTool({ onClose, config }: any) {
      const [{input, lang}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
        input: 'curl https://api.example.com -H "Authorization: Bearer my-token" -d \'{"key":"value"}\'',
        lang: 'Fetch'
      });
      const [output, setOutput] = useState(`fetch('https://api.example.com', {\n  method: 'POST',\n  headers: {\n    'Authorization': 'Bearer my-token'\n  },\n  body: '{"key":"value"}'\n});`);
      const [showSample, setShowSample] = useState(true);
      const ai = useAI();

      const convert = () => {
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Convert this cURL command to ${lang}:\n\n${input}\n\nReturn ONLY the valid code block, no extra markdown text.`,
            schema: null
         }).then((res: any) => {
            let clean = typeof res === 'string' ? res : JSON.stringify(res);
            clean = clean.replace(/^```[\w]*\n/, '').replace(/```$/, '').trim();
            setOutput(clean);
            setShowSample(false);
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{whyItMatters: "Most API docs only provide cURL examples. AI makes syntax translation flawless without needing specific parsing libraries for every target language."}}>
         <SplitPane 
            leftConfig={{ title: 'CURL COMMAND' }}
            left={<div className="h-full relative"><CodeEditor value={input} onChange={(v:string)=>{setState(s=>({...s, input: v}));setShowSample(false);}} placeholder="Paste cURL here..."/><div className="absolute bottom-4 left-4 right-4 z-10 p-2 bg-base rounded-md border border-subtle shadow overflow-y-auto max-h-[150px]"><AIInlineExplanation prompt="Explain what this curl command does, the method, headers, and the body in a human readable way." context={input} label="Explain this cURL (AI)" /></div></div>} 
            rightConfig={{ 
               title: `CODE (${lang.toUpperCase()})`,
               actions: (
                 <>
                   <select className="bg-elevated border border-strong rounded px-2 py-1 text-xs text-primary focus:outline-none font-sans font-medium" onChange={e => {setState(s=>({...s, lang: e.target.value})); setShowSample(false);}} value={lang}>
                     <option value="Fetch">Fetch (JS)</option>
                     <option value="Axios">Axios (JS)</option>
                     <option value="Python (Requests)">Python</option>
                     <option value="Go">Go</option>
                     <option value="Rust (Reqwest)">Rust</option>
                   </select>
                   <ActionButton onClick={convert} primary label={ai.isLoading ? "Converting..." : "Convert"} />
                 </>
               )
            }}
            right={<CodeEditor value={output} readOnly/>} 
         />
      </ToolShell>
    }
  },
  {
    id: 'gig', title: 'Gig Auto-Pilot', desc: 'Automate freelance tasks & client proposals.', icon: <Globe size={18} />, tag: 'Productivity',
    component: function GigTool({ onClose, config }: any) {
      const [input, setInput] = useState('Looking for a React developer to build a dashboard.');
      const [output, setOutput] = useState('');
      const ai = useAI();

      const generate = () => {
         ai.stream({
            model: 'gemini-3.1-pro',
            prompt: `Write a professional, compelling freelance proposal for the following job description:\n\n${input}\n\nHighlight expertise, propose a brief timeline, and ask an engaging question to end the proposal. Make it confident but not overly arrogant. Format as markdown.`
         });
      };

      return <ToolShell config={config} onClose={onClose}>
         <SplitPane 
            leftConfig={{ title: 'JOB DESCRIPTION' }}
            left={<CodeEditor value={input} onChange={setInput} placeholder="Paste job description here..."/>} 
            rightConfig={{
               title: 'PROPOSAL',
               actions: <ActionButton onClick={generate} primary label={ai.isLoading ? "Generating..." : "Generate Proposal"} />
            }}
            right={
               <div className="h-full overflow-auto p-4 bg-surface/50 markdown-body">
                  {output && !ai.isLoading && !ai.streamData && <MarkdownPreview source={output} style={{backgroundColor:'transparent', color:'inherit'}} />}
                  {ai.isLoading && !ai.streamData && <span className="opacity-50">Drafting proposal...</span>}
                  {ai.streamData && <MarkdownPreview source={ai.streamData} style={{backgroundColor:'transparent', color:'inherit'}} />}
               </div>
            }
         />
      </ToolShell>
    }
  },
  {
    id: 'privacy', title: 'Legal Boilerplate Studio', desc: 'Generate Privacy Policies & ToS locally.', icon: <Globe size={18} />, tag: 'Legal',
    component: function PrivacyTool({ onClose, config }: any) {
      const [{company, website, email, type}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         company: 'Acme Corp', website: 'https://acme.com', email: 'hello@acme.com', type: 'Privacy Policy'
      });
      const ai = useAI();
      const [output, setOutput] = useState('');

      const generate = () => {
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Generate a standard, boilerplate ${type} for a company named "${company}".\nWebsite URL: ${website}\nContact Email: ${email}.\n\nPlease format it clearly in Markdown. While this is not legal advice, it should cover standard modern web application clauses (data collection, cookies, third-party services, user rights, etc. for privacy policy; limitations of liability, terms for ToS).`
         }).then(res => {
            if (typeof res === 'string') setOutput(res);
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} rightSidebar={{whyItMatters: "Most online generators harvest your company intel to sell to marketing lists. LLMs know standard web legalese natively."}}>
         <SplitPane 
            leftConfig={{ title: 'COMPANY DETAILS' }}
            left={
               <div className="p-6 space-y-4 text-sm bg-surface/30 h-full overflow-auto flex flex-col">
                 <div>
                    <label className="block text-muted mb-1 text-xs uppercase tracking-widest font-bold">Document Type</label>
                    <select className="w-full bg-elevated border-strong border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all" value={type} onChange={e=>setState(s=>({...s, type: e.target.value}))}>
                       <option value="Privacy Policy">Privacy Policy</option>
                       <option value="Terms of Service">Terms of Service</option>
                       <option value="Cookie Policy">Cookie Policy</option>
                       <option value="EULA">End User License Agreement (EULA)</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-muted mb-1 text-xs uppercase tracking-widest font-bold">Company Name</label>
                    <input className="w-full bg-elevated border-strong border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all" value={company} onChange={e=>setState(s=>({...s, company: e.target.value}))} />
                 </div>
                 <div>
                    <label className="block text-muted mb-1 text-xs uppercase tracking-widest font-bold">Website URL</label>
                    <input className="w-full bg-elevated border-strong border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all" value={website} onChange={e=>setState(s=>({...s, website: e.target.value}))} />
                 </div>
                 <div>
                    <label className="block text-muted mb-1 text-xs uppercase tracking-widest font-bold">Contact Email</label>
                    <input className="w-full bg-elevated border-strong border rounded-lg p-3 text-primary focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all" value={email} onChange={e=>setState(s=>({...s, email: e.target.value}))} />
                 </div>
                 <div className="pt-4 mt-auto">
                    <Button onClick={generate} disabled={ai.isLoading} className="w-full h-12 text-base shadow-sm">
                       {ai.isLoading ? "Drafting Document..." : "Generate Document"}
                    </Button>
                 </div>
               </div>
            } 
            rightConfig={{ 
               title: 'GENERATED DOCUMENT',
               actions: (
                  output ? <ActionButton onClick={() => navigator.clipboard.writeText(output)} primary label="Copy to Clipboard" /> : null
               )
            }} 
            right={
               <div className="h-full overflow-auto p-6 bg-base markdown-body">
                  {!output && !ai.isLoading && (
                    <div className="text-muted flex flex-col gap-2 items-center justify-center h-full text-center">
                      <Globe className="w-12 h-12 opacity-20 mb-2" />
                      <p>Generate boilerplates tailored to your startup.</p>
                      <p className="text-xs max-w-xs">Disclaimer: This tool generates templates and does not constitute formal legal counsel.</p>
                    </div>
                  )}
                  {ai.isLoading && <div className="opacity-50 animate-pulse mt-4">Drafting legal clauses...</div>}
                  {output && !ai.isLoading && <MarkdownPreview source={output} style={{backgroundColor:'transparent', color:'inherit'}} />}
               </div>
            }
         />
      </ToolShell>
    }
  },
  {
    id: 'seo-meta', title: 'SEO & Meta Studio', desc: 'Craft OpenGraph, robots.txt, sitemap, JSON-LD.', icon: <Search size={18} />, tag: 'Web',
    component: function SeoTool({ onClose, config }: any) {
      const [{title, desc, keywords, url}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         title: 'My Awesome Page', desc: 'A comprehensive guide to building awesomeness.', keywords: '', url: 'https://example.com'
      });
      const ai = useAI();

      const generate = () => {
         const topic = prompt("Enter a topic or URL for AI to suggest SEO Meta info:");
         if (!topic) return;
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Generate optimized SEO metadata for a page about "${topic}". Return a JSON object with strictly these string keys: title, description, keywords. Keep title under 60 chars and description under 155 chars.`,
            schema: { type: "object", properties: { title: {type: "string"}, description: {type:"string"}, keywords: {type:"string"} }, required: ["title", "description", "keywords"] }
         }).then((res:any) => {
            if (res) {
               setState(s=>({...s, title: res.title || s.title, desc: res.description || s.desc, keywords: res.keywords || s.keywords}));
            }
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink}>
         <SplitPane 
            leftConfig={{ 
               title: 'PAGE DETAILS',
               actions: <ActionButton onClick={generate} label="Auto-Fill (AI)" />
            }}
            left={
              <div className="p-6 space-y-4 text-sm h-full overflow-auto bg-surface/30">
                 <div>
                    <label className="flex justify-between text-muted mb-1">
                       <AITooltipInfo prompt="Why is the SEO Meta title important and how long should it be?" value={title}><span>Title <Sparkles size={10} className="inline ml-1 text-indigo-400 opacity-50" /></span></AITooltipInfo>
                       <span className={title.length > 60 ? "text-red-400" : ""}>{title.length}/60</span>
                    </label>
                    <input className="w-full bg-surface border border-subtle rounded p-2 text-primary focus:border-[#34F5C5] focus:outline-none transition-colors" value={title} onChange={e=>setState(s=>({...s, title: e.target.value}))} />
                 </div>
                 <div>
                    <label className="flex justify-between text-muted mb-1">
                       <AITooltipInfo prompt="Why is the SEO Description important and how long should it be?" value={desc}><span>Description <Sparkles size={10} className="inline ml-1 text-indigo-400 opacity-50" /></span></AITooltipInfo>
                       <span className={desc.length > 155 ? "text-red-400" : ""}>{desc.length}/155</span>
                    </label>
                    <textarea className="w-full h-24 bg-surface border border-subtle rounded p-2 text-primary resize-none focus:border-[#34F5C5] focus:outline-none transition-colors" value={desc} onChange={e=>setState(s=>({...s, desc: e.target.value}))} />
                 </div>
                 <div>
                    <label className="block text-muted mb-1">URL / Canonical</label>
                    <input className="w-full bg-surface border border-subtle rounded p-2 text-primary focus:border-[#34F5C5] focus:outline-none transition-colors" value={url} onChange={e=>setState(s=>({...s, url: e.target.value}))} />
                 </div>
                 <div>
                    <label className="block text-muted mb-1">Keywords (Comma separated)</label>
                    <input className="w-full bg-surface border border-subtle rounded p-2 text-primary focus:border-[#34F5C5] focus:outline-none transition-colors" value={keywords} onChange={e=>setState(s=>({...s, keywords: e.target.value}))} />
                 </div>
              </div>
            } 
            rightConfig={{ title: 'HTML OUTPUT' }}
            right={<CodeEditor readOnly value={`<!-- Primary Meta Tags -->\n<title>${title}</title>\n<meta name="title" content="${title}">\n<meta name="description" content="${desc}">\n${keywords ? `<meta name="keywords" content="${keywords}">\n` : ''}\n<!-- Open Graph / Facebook -->\n<meta property="og:type" content="website">\n<meta property="og:url" content="${url}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${desc}">\n\n<!-- Twitter -->\n<meta property="twitter:card" content="summary_large_image">\n<meta property="twitter:url" content="${url}">\n<meta property="twitter:title" content="${title}">\n<meta property="twitter:description" content="${desc}">`} />} 
         />
      </ToolShell>
    }
  },
  {
    id: 'http-status', title: 'HTTP Status Lab', desc: 'Codes, CORS preflight, Headers analyzer.', icon: <Server size={18} />, tag: 'Network',
    component: function HttpTool({ onClose, config }: any) {
       const [code, setCode] = useState('418');
       const ai = useAI();

       const analyze = () => {
          if (!code) return;
          ai.stream({
             model: 'gemini-3.1-pro',
             prompt: `Provide a quick, highly technical explanation of the HTTP Status Code "${code}". Include common causes and how to resolve it if it's an error. Format as Markdown.`
          });
       };

       const codes: Record<string, string> = { "200": "OK", "404": "Not Found", "418": "I'm a teapot", "500": "Internal Server Error", "401": "Unauthorized", "403": "Forbidden", "502": "Bad Gateway", "503": "Service Unavailable", "301": "Moved Permanently", "302": "Found" };
       return <ToolShell config={config} onClose={onClose}>
          <div className="flex w-full h-full">
             <div className="w-1/3 border-r border-subtle p-8 bg-surface/30 flex flex-col justify-center items-center h-full">
                <input type="text" className="w-full max-w-sm bg-surface border-subtle mb-4 p-4 rounded text-5xl font-mono text-primary text-center block focus:border-[#34F5C5] focus:outline-none transition-colors border" value={code} onChange={e => setCode(e.target.value)} placeholder="e.g. 404" />
                <div className="text-center text-xl text-emerald-400 font-bold mb-8 h-8">{codes[code] || "Unknown Code"}</div>
                <Button variant="default" onClick={analyze} disabled={ai.isLoading} className="w-full">
                   <Sparkles className="mr-2" size={16}/> {ai.isLoading ? 'Analyzing...' : 'Deep Dive (AI)'}
                </Button>
             </div>
             <div className="w-2/3 p-8 overflow-auto markdown-body bg-base">
                {!ai.streamData && !ai.isLoading && <div className="text-muted h-full flex items-center justify-center">Enter a code and click Deep Dive.</div>}
                {ai.isLoading && !ai.streamData && <div className="opacity-50 animate-pulse">Consulting the RFCs...</div>}
                {ai.streamData && <MarkdownPreview source={ai.streamData} style={{backgroundColor:'transparent', color:'inherit'}} />}
             </div>
          </div>
       </ToolShell>
    }
  }
];
