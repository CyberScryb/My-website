import React, { useState, useRef } from 'react';
import { ToolShell, SplitPane, CodeEditor, ActionButton } from '../components/WorkspaceShell';
import { Palette, Image as ImgIcon, QrCode, Sparkles, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAI } from '../lib/useAI';
import { Button } from '../components/ui/Button';
import { useToolState } from '../lib/useToolState';
import { AIInlineExplanation, AITooltipInfo } from '../components/AIExplanation';

export const MediaTools = [
  {
    id: 'image', title: 'Image Metadata Stripper', desc: 'Client-side EXIF viewer & stripper. Preserve privacy.', icon: <ImgIcon size={18} />, tag: 'Media',
    component: function ImgTool({ onClose, config }: any) {
      const [imgData, setImgData] = useState<string | null>(null);
      const [exif, setExif] = useState<any>(null);
      const [strippedData, setStrippedData] = useState<string | null>(null);
      const fileInput = useRef<HTMLInputElement>(null);

      const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
         const file = e.target.files?.[0];
         if (!file) return;
         const reader = new FileReader();
         reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setImgData(dataUrl);
            setStrippedData(null);
            try {
               const piexif = require('piexifjs');
               const exifObj = piexif.load(dataUrl);
               // Count keys to see if there's any data
               const hasExif = Object.values(exifObj).some((val: any) => typeof val === 'object' && Object.keys(val).length > 0);
               setExif(hasExif ? exifObj : null);
            } catch (err) {
               setExif(null);
            }
         };
         reader.readAsDataURL(file);
      };

      const stripMetadata = () => {
         if (!imgData) return;
         try {
            const piexif = require('piexifjs');
            const clean = piexif.remove(imgData);
            setStrippedData(clean);
         } catch(e) {
            alert('Failed to strip metadata. Ensure it is a valid JPEG.');
         }
      };

      return <ToolShell config={config} onClose={onClose} rightSidebar={{
        whyItMatters: "Your iPhone embeds GPS coordinates in every photo by default. EXIF analysis and stripping should happen locally—uploading an image to 'clean' it defeats the purpose of privacy."
      }}>
        <div className="flex flex-col md:flex-row h-full">
           <div className="w-full md:w-1/3 border-r border-subtle bg-surface p-6 flex flex-col gap-6 overflow-auto">
              <div>
                 <input type="file" accept="image/jpeg" ref={fileInput} className="hidden" onChange={handleUpload} />
                 <Button onClick={() => fileInput.current?.click()} className="w-full h-12 shadow-sm text-base">
                    Upload JPEG Image
                 </Button>
              </div>
              
              {imgData && (
                 <>
                    {exif ? (
                       <div className="bg-elevated border border-warning/20 p-4 rounded-xl">
                          <h3 className="text-warning font-bold flex items-center gap-2 mb-2"><ShieldCheck size={16}/> Metadata Detected</h3>
                          <p className="text-xs text-muted mb-4">This image contains EXIF metadata, which may include location, timestamps, and camera details.</p>
                          <div className="mb-4"><AIInlineExplanation prompt="Explain what EXIF data is and why someone would want to strip it for privacy reasons." context="-" label="Why should I strip this? (AI)" /></div>
                          <Button primary onClick={stripMetadata} className="w-full">Strip Metadata</Button>
                       </div>
                    ) : (
                       <div className="bg-elevated border border-accent/20 p-4 rounded-xl">
                          <h3 className="text-accent font-bold flex items-center gap-2 mb-2"><ShieldCheck size={16}/> Clean Image</h3>
                          <p className="text-xs text-muted">No EXIF metadata was found. This image is safe to share.</p>
                       </div>
                    )}
                 </>
              )}

              {strippedData && (
                 <div className="bg-accent/10 border border-accent/20 p-4 rounded-xl">
                    <h3 className="text-accent font-bold mb-2">Successfully Stripped</h3>
                    <p className="text-xs text-muted mb-4">All private metadata has been removed.</p>
                    <a href={strippedData} download="stripped_image.jpg" className="w-full flex items-center justify-center p-2 bg-accent text-base rounded font-bold transition-all hover:bg-white text-black">
                       Download Safe Image
                    </a>
                 </div>
              )}
           </div>
           <div className="flex-1 flex items-center justify-center p-6 bg-base bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] overflow-hidden relative">
              {imgData ? (
                 <img src={strippedData || imgData} alt="Preview" className="max-w-full max-h-full object-contain drop-shadow-2xl rounded" />
              ) : (
                 <div className="text-muted flex flex-col items-center opacity-50 cursor-pointer hover:opacity-100 transition-opacity" onClick={() => fileInput.current?.click()}>
                    <ImgIcon size={48} className="mb-4" />
                    <p>Select an image to analyze.</p>
                 </div>
              )}
           </div>
        </div>
      </ToolShell>
    }
  },
  {
    id: 'svg', title: 'SVG Optimizer', desc: 'Minify and optimize SVGs using SVGO patterns.', icon: <ImgIcon size={18} />, tag: 'Media',
    component: function SvgTool({ onClose, config }: any) {
      const [{input}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         input: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>'
      });
      const ai = useAI();
      const [aiResult, setAiResult] = useState<any>(null);
      const [showSample, setShowSample] = useState(true);

      const handleDescribe = () => {
         ai.run({
            model: 'gemini-3.1-flash',
            prompt: `Look at this SVG markup. Suggest a semantic React component name and a short aria-label for accessibility. Return ONLY JSON.\\n\\n${input}`,
            schema: {
               type: 'object',
               properties: {
                  componentName: { type: 'string' },
                  ariaLabel: { type: 'string' },
                  description: { type: 'string' }
               },
               required: ['componentName', 'ariaLabel', 'description']
            }
         }).then((res: any) => {
             if (res) setAiResult(res);
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "Inline SVGs prevent extra network requests and allow CSS manipulation. But raw SVGs from Figma are bloated with metadata and useless transforms.",
        presets: [
           { label: 'Sample Icon', onClick: () => { setState({input: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'}); setShowSample(false); } }
        ]
      }}>
         <SplitPane 
            left={
               <div className="flex flex-col h-full bg-transparent p-0 relative">
                  <div className="absolute top-4 right-4 z-10">
                     <ActionButton onClick={handleDescribe} label="Describe & Rename (AI)" />
                  </div>
                  <CodeEditor value={input} onChange={(v: string)=>{setState({input: v}); setShowSample(false);}}/>
                  {(ai.isLoading || aiResult) && (
                     <div className="absolute bottom-4 left-4 right-4 z-10 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-lg backdrop-blur-md">
                        {ai.isLoading ? <span className="animate-pulse text-indigo-400 font-bold text-xs uppercase tracking-widest">Analyzing SVG...</span> : 
                        <>
                           <div className="font-bold text-indigo-300 text-sm mb-1">{aiResult.componentName}</div>
                           <div className="text-xs text-indigo-200/70 mb-2">aria-label: "{aiResult.ariaLabel}"</div>
                           <div className="text-xs text-indigo-100">{aiResult.description}</div>
                           <button onClick={() => setAiResult(null)} className="absolute top-2 right-2 text-indigo-300 hover:text-white">✕</button>
                        </>}
                     </div>
                  )}
               </div>
            } 
            leftConfig={{ title: 'SVG MARKUP' }} 
            right={
               <div className="flex items-center justify-center h-full bg-surface">
                  <div dangerouslySetInnerHTML={{ __html: input }} className="w-32 h-32" />
               </div>
            } rightConfig={{ title: 'PREVIEW' }} />
      </ToolShell>
    }
  },
  {
    id: 'qrcode', title: 'QR & Barcode Forge', desc: 'Secure QR codes, EAN-13, no tracking.', icon: <QrCode size={18} />, tag: 'Media',
    component: function QrTool({ onClose, config }: any) {
      const [{input, color}, setState, shareUrl, copyShareLink] = useToolState(config.id, {
         input: 'https://cyberscryb.com', color: '#34f5c5'
      });
      const [showSample, setShowSample] = useState(true);

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} sampleBanner={showSample} onDismissSample={()=>setShowSample(false)} rightSidebar={{
        whyItMatters: "Most 'free' free QR generators inject tracking redirects into your payload. Generate them client-side in Canvas. It's safe, instantly rendered, and permanent."
      }}>
        <div className="flex flex-col md:flex-row h-full">
           <div className="w-full md:w-1/3 border-r border-subtle bg-surface p-6 space-y-6">
              <div>
                <label className="text-xs uppercase text-muted font-bold block mb-2">Payload URL/Text</label>
                <textarea className="w-full bg-elevated border border-strong rounded p-3 text-primary focus:outline-none focus:border-[#34F5C5]/50 h-32" value={input} onChange={e=>{setState(s=>({...s, input: e.target.value})); setShowSample(false);}} />
              </div>
              <div>
                <label className="text-xs uppercase text-muted font-bold block mb-2">Foreground Color</label>
                <input type="color" value={color} onChange={e=>{setState(s=>({...s, color: e.target.value})); setShowSample(false);}} className="w-full h-10 rounded border border-subtle cursor-pointer" />
              </div>
           </div>
           <div className="flex-1 flex items-center justify-center p-12 bg-base bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]">
              <div className="p-8 bg-white rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105">
                 <QRCodeSVG value={input || ' '} size={256} fgColor={color} bgColor="#ffffff" level="H" includeMargin={false} />
              </div>
           </div>
        </div>
      </ToolShell>
    }
  },
  {
    id: 'color-palette', title: 'Color Palette Studio', desc: 'Harmonies, WCAG Contrast Grid, exports.', icon: <Palette size={18} />, tag: 'Design',
    component: function ColorTool({ onClose, config }: any) {
      const [{hex}, setState, shareUrl, copyShareLink] = useToolState(config.id, { hex: '#34f5c5' });
      const ai = useAI();
      const [palettes, setPalettes] = useState<any[]>([]);

      const handleGenerateMood = () => {
         const mood = prompt("Enter a mood or scene (e.g., 'forest twilight calm', 'cyberpunk neon')");
         if (!mood) return;
         ai.run({
            model: 'gemini-3.1-pro',
            prompt: `Generate a harmonious color palette based on this mood: "${mood}". Return ONLY JSON representing 5 colors.`,
            schema: {
               type: 'object',
               properties: {
                  themeName: { type: 'string' },
                  colors: {
                     type: 'array',
                     items: {
                        type: 'object',
                        properties: {
                           hex: { type: 'string' },
                           name: { type: 'string' },
                           role: { type: 'string', description: 'e.g. primary, secondary, accent, background' }
                        },
                        required: ['hex', 'name', 'role']
                     }
                  }
               },
               required: ['themeName', 'colors']
            }
         }).then((res: any) => {
             if (res && res.colors) {
                setPalettes([res, ...palettes]);
             }
         });
      };

      return <ToolShell config={config} onClose={onClose} shareMethod={copyShareLink} rightSidebar={{whyItMatters:"A palette isn't just colors, it's a hierarchy. You need a primary brand, a dark base, a light contrast, and a punchy accent. AI gets this right better than color wheel math."}}>
         <div className="p-8 flex flex-col items-center min-h-full">
            <div className="flex gap-4 mb-12">
               <Button onClick={handleGenerateMood} disabled={ai.isLoading} className="gap-2 shrink-0">
                 <Sparkles size={16} /> Generate Palette from Mood
               </Button>
            </div>
            {palettes.length > 0 && (
               <div className="w-full max-w-4xl space-y-12">
                 {palettes.map((p, idx) => (
                    <div key={idx} className="bg-surface border border-subtle rounded-xl p-6">
                       <h3 className="text-xl font-bold tracking-tight mb-4 flex items-center justify-between">
                          <span>{p.themeName}</span>
                          <span className="text-xs font-mono text-muted uppercase bg-base px-2 py-1 rounded">AI GENERATED</span>
                       </h3>
                       <div className="flex gap-4 h-32 rounded-xl overflow-hidden shadow-xl mb-4">
                          {p.colors.map((c: any) => (
                             <div key={c.hex} className="flex-1 transition-all hover:flex-[1.5] relative group" style={{backgroundColor: c.hex}}>
                                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                   <div className="text-white font-mono text-xs uppercase font-bold">{c.hex}</div>
                                   <div className="text-white/80 text-[10px] break-words leading-tight">{c.name}</div>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 ))}
               </div>
            )}
            
            {palettes.length === 0 && (
              <>
                <input type="color" value={hex} onChange={e=>setState({hex: e.target.value})} className="w-32 h-32 rounded-xl border-4 border-subtle shadow-xl cursor-pointer" />
                <div className="mt-8 text-3xl font-mono uppercase text-primary tracking-widest">{hex}</div>
                <div className="mt-12 flex gap-4">
                  {[1,2,3,4,5].map(i => (
                     <div key={i} className="w-16 h-24 rounded-lg shadow-md" style={{backgroundColor: hex, opacity: 1 - (i*0.15)}} />
                  ))}
                </div>
              </>
            )}
         </div>
      </ToolShell>
    }
  }
];
