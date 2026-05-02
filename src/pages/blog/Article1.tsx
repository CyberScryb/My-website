import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';

export const Article1 = () => {
   const [rawText, setRawText] = useState('secret_password_123');

   return (
      <article className="py-12 md:py-24 px-6 max-w-4xl mx-auto">
         <Helmet>
            <title>Security Theater: Why Base64 Encoding is Not Encryption | CyberScryb Blog</title>
            <meta name="description" content="Explain the difference between encoding, hashing, and encryption." />
         </Helmet>
         
         <div className="mb-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase mb-8">
               <ArrowLeft size={16} /> Back to Blog
            </Link>
            <div className="flex items-center gap-2 text-xs font-mono text-muted mb-6 uppercase tracking-widest">
               <Calendar size={14} className="text-[#34F5C5]"/> Published Oct 28, 2024 &bull; 8 min read
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-tight">
               Security Theater: Why Base64 Encoding is Not Encryption (And Other Sins)
            </h1>
            <p className="text-xl text-muted leading-relaxed max-w-3xl">
               Encoding, hashing, and encrypting are entirely different concepts. Let's stop treating them as interchangeable.
            </p>
         </div>

         <div className="prose prose-invert prose-lg max-w-3xl mx-auto markdown-body bg-transparent">
            <p>
               Every security audit begins the same way: You sit down, open the network tab, and watch the payloads fly by. And there it is. The cardinal sin of junior engineering.
            </p>
            <p className="font-mono text-sm bg-surface p-4 rounded text-accent">{"Authorization: Basic dXNlcjpwYXNzd29yZA=="}</p>
            <p>
               You ask the developer about it. "Oh," they say, waving a hand dismissively. "Don't worry, it's encrypted."
            </p>
            <p>
               Your eye twitches. You take a deep breath. <em>Base64 is not encryption.</em>
            </p>

            <h2>1. Encoding: Changing the Format</h2>
            <p>
               Encoding is just translating data into a different format for transport. Base64 exists strictly because the early internet was built on 7-bit ASCII systems that mangled binary data. By representing binary as 64 safe alphanumeric characters, we ensured emails and payloads survived transit.
            </p>
            <p>
               There is no secret key. There is no math designed to stop reversal. <code>atob()</code> is universally available in every browser on Earth. If you "protect" a payload with Base64, you have done nothing but obfuscate it from someone who lacks the technical competence to press F12.
            </p>

            <div className="my-12 p-8 bg-surface border border-subtle rounded-2xl shadow-xl not-prose">
               <h3 className="text-xl font-bold mb-4 tracking-tight flex items-center gap-2 text-primary"><Lock className="text-accent"/> Encoding vs Hashing</h3>
               <p className="text-muted text-sm mb-6">Type a string below to see the difference between reversible Base64 and irreversible SHA-256.</p>
               <input 
                  type="text" 
                  value={rawText} 
                  onChange={e => setRawText(e.target.value)} 
                  className="w-full bg-elevated border border-strong rounded-lg p-3 text-primary focus:border-accent focus:outline-none mb-6 font-mono"
               />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <h4 className="text-xs uppercase tracking-widest text-[#34F5C5] font-bold font-mono mb-2">Base64 (Reversible)</h4>
                     <div className="bg-base min-h-[40px] px-3 py-2 rounded border border-subtle font-mono text-sm break-all text-muted">
                        {btoa(rawText)}
                     </div>
                  </div>
                  <div>
                     <h4 className="text-xs uppercase tracking-widest text-indigo-400 font-bold font-mono mb-2">SHA-256 (Irreversible)</h4>
                     <div className="bg-base min-h-[40px] px-3 py-2 rounded border border-subtle font-mono text-sm break-all text-muted">
                        {CryptoJS.SHA256(rawText).toString()}
                     </div>
                  </div>
               </div>
            </div>

            <h2>2. Hashing: The One-Way Street</h2>
            <p>
               Hashing takes an input of any size and produces a fixed-width output. The core premise is irreversibility. You cannot take a SHA-256 hash and derive the original text. You can only hash a known attempt and compare the two hashes.
            </p>
            <p>
               You hash passwords. You hash API keys before storing them. You do not encode them, and (unless you have a wildly specific requirement) you do not encrypt them.
            </p>

            <h2>3. Encryption: Scrambling with a Key</h2>
            <p>
               Encryption transforms data using an algorithm and a secret key. Without the key, the ciphertext is statistically indistinguishable from random noise. With the key, it is perfectly reversible.
            </p>
            <p>
               You encrypt database columns. You encrypt session cookies. 
            </p>

            <hr/>
            <p>
               The next time you see someone refer to Base64 as "encryption", send them this article.
            </p>
         </div>
      </article>
   );
};
