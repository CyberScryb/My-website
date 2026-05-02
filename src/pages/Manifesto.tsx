import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Cpu, Database, Command } from 'lucide-react';

export const Manifesto = () => {
   return (
      <>
         <Helmet>
            <title>The Anti-Cloud Manifesto | CyberScryb</title>
            <meta name="description" content="A philosophical argument for local-first computing, data privacy, and why pasting JWTs into random websites is a terrible idea." />
         </Helmet>

         <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-24">
            <div className="mb-16">
               <div className="w-16 h-16 bg-accent/10 border border-accent/20 flex items-center justify-center rounded-2xl mb-8">
                  <ShieldCheck size={32} className="text-accent" />
               </div>
               <h1 className="text-5xl font-bold tracking-tight text-white mb-6">The Anti-Cloud Manifesto</h1>
               <p className="text-xl text-muted leading-relaxed font-serif">Why pasting your production secrets into ad-supported web tools is professional negligence.</p>
            </div>

            <article className="prose prose-invert prose-lg prose-p:font-serif prose-headings:font-sans max-w-none prose-a:text-accent">
               <p>
                  Every day, millions of developers commit a cardinal sin: they copy their production JSON Web Tokens, their live database connection strings, and their unencrypted JSON payloads, and they paste them into random websites they found on page 1 of Google.
               </p>
               <p>
                  Why? Because building software is hard, and formatting JSON in a terminal is annoying.
               </p>

               <div className="my-12 p-8 bg-surface border-l-4 border-accent rounded-r-xl shadow-lg">
                  <h3 className="text-white mt-0 mb-4 tracking-tight">The "Free" Tool Trap</h3>
                  <p className="mb-0 text-muted">
                     There is no such thing as a free cloud tool. If a tool requires a server to format your JSON, generate your QR code, or parse your JWT, then that server is receiving your payload. If it's receiving your payload, it is logging it. If it is logging it, it is subject to a breach.
                  </p>
               </div>

               <h2 className="text-white">The Web is Powerful Enough</h2>
               <p>
                  We have been conditioned to believe that heavy lifting requires a backend. This is a lie perpetuated by companies selling serverless compute. Your browser has a V8 engine capable of compiling WebAssembly, running hardware-accelerated graphics, and executing single-threaded synchronous operations at millions of iterations per second.
               </p>
               <p>
                  There is zero technical justification for sending a Base64 string to a Node.js server just to decode it.
               </p>

               <h2 className="text-white">Our Promise</h2>
               <ul className="list-none pl-0 space-y-6 my-12">
                  <li className="flex gap-4">
                     <Cpu className="text-accent shrink-0 mt-1" />
                     <div>
                        <strong className="block text-white mb-1">Local-First Architecture</strong>
                        <span className="text-muted">Every tool on CyberScryb runs entirely in your browser's memory. When you close the tab, your data ceases to exist.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Database className="text-accent shrink-0 mt-1" />
                     <div>
                        <strong className="block text-white mb-1">Zero Telemetry</strong>
                        <span className="text-muted">We don't track your IPs, we don't log your queries, and we don't run analytics on your tool usage. We don't want to know.</span>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <Command className="text-accent shrink-0 mt-1" />
                     <div>
                        <strong className="block text-white mb-1">State in the URL</strong>
                        <span className="text-muted">If you need to save a configuration or share a preset, we serialize the state, compress it, and stick it in the URL Hash. No databases. No accounts.</span>
                     </div>
                  </li>
               </ul>

               <h2 className="text-white">Reclaim Your Environment</h2>
               <p>
                  It's time to stop trusting the cloud with your scratchpad. CyberScryb is built on the belief that developer tools should be instantaneous, uncompromisingly secure, and delightfully cynical.
               </p>
               <p>
                  Welcome to the Anti-Cloud.
               </p>
            </article>
         </div>
      </>
   )
}
