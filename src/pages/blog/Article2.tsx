import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Article2 = () => {
   const [testStr, setTestStr] = useState('My number is 555-1234');
   const [regex, setRegex] = useState('\\d+');
   
   let matches: string[] = [];
   try {
      const re = new RegExp(regex, 'g');
      matches = testStr.match(re) || [];
   } catch(e) {}

   return (
      <article className="py-12 md:py-24 px-6 max-w-4xl mx-auto">
         <Helmet>
            <title>Leaving the Cloud: Local Dev Tools | CyberScryb Blog</title>
            <meta name="description" content="Leaving the Cloud: How I Re-Built a Full Suite of Dev Tools in Local Memory" />
         </Helmet>
         
         <div className="mb-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase mb-8">
               <ArrowLeft size={16} /> Back to Blog
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-muted mb-6 uppercase tracking-widest">
               <Calendar size={14} className="text-[#34F5C5]"/> Published Oct 29, 2024 &bull; 10 min read
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-tight">
               Leaving the Cloud: How I Re-Built a Full Suite of Dev Tools in Local Memory
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-3xl">
               Why does an internet connection have to be a prerequisite for doing your job? It doesn't.
            </p>
         </div>

         <div className="prose prose-invert prose-lg max-w-3xl mx-auto markdown-body bg-transparent">
            <p>
               Every developer has done this at least once: You need to parse a JWT, format a 5MB JSON payload, or build a complex regex pattern. You immediately Google for a tool, click the first link, paste your production-sensitive data into a textarea, and let it rip.
            </p>
            <p>
               Congratulations. You have just surrendered your data to some anonymous backend on the internet.
            </p>

            <h2>The Realization</h2>
            <p>
               I realized my reliance on cloud-based utilities was not just a privacy nightmare—it was technically absurd. Why should my incredibly powerful local machine send a payload over a 4G connection, to a node server somewhere in Virginia, just to parse a string natively on that server's V8 engine instead of my own?
            </p>

            <div className="my-12 p-8 bg-surface border border-subtle rounded-2xl shadow-xl not-prose">
               <h3 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2 text-primary"><Terminal className="text-accent"/> Live Local Execution Demo</h3>
               <p className="text-muted text-sm mb-6">This regex parser executes entirely in your browser using the local JavaScript Regex engine. No network tab requests.</p>
               <div className="flex gap-4 flex-col lg:flex-row">
                  <div className="flex-1 space-y-4">
                     <input 
                        type="text" 
                        value={regex} 
                        onChange={e => setRegex(e.target.value)} 
                        className="w-full bg-elevated border border-strong rounded-lg p-3 text-accent focus:border-accent focus:outline-none font-mono"
                        placeholder="Regex pattern"
                     />
                     <textarea 
                        value={testStr} 
                        onChange={e => setTestStr(e.target.value)} 
                        className="w-full h-32 bg-elevated border border-strong rounded-lg p-3 text-primary focus:border-accent focus:outline-none font-mono resize-none"
                        placeholder="Test string"
                     />
                  </div>
                  <div className="w-full lg:w-1/3 bg-base border border-subtle rounded-lg p-4">
                     <h4 className="text-xs uppercase tracking-widest text-[#34F5C5] font-bold font-mono mb-2">Matches ({matches.length})</h4>
                     <ul className="space-y-1">
                        {matches.map((m, i) => <li key={i} className="text-sm font-mono text-primary bg-surface px-2 py-1 rounded">{m}</li>)}
                     </ul>
                  </div>
               </div>
            </div>

            <h2>Web Crypto and Hash State</h2>
            <p>
               Once you commit to client-side-only, state management becomes your hardest problem. To solve link shearing, I utilized the URL Hash, compressed heavily with LZ-string. The URL is essentially the database. It is un-censorable, un-killable, and completely private.
            </p>

            <h2>Conclusion</h2>
            <p>
               You are a capable engineer with hardware capable of running massive models, rendering millions of triangles at 144Hz, and compiling rust in sub-seconds. Stop giving up your compute power out of convenience. Trust the client. Build on the client.
            </p>
         </div>
      </article>
   );
};
