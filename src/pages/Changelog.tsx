import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Rss, GitCommit, GitPullRequest, Search, Zap, Code } from 'lucide-react';

const UPDATES = [
  {
    date: 'Oct 23, 2024',
    version: 'v4.1.2',
    icon: <Zap size={16} />,
    title: 'Client-Side Excellence and Hash Sync',
    desc: 'Broke the last few HTTP tethers. Tools now serialize state into LZ-compressed URL hashes. Because saving your configurations should not require an API request to a database I have to pay for, and you have to worry about.',
    type: 'Feature'
  },
  {
    date: 'Sep 15, 2024',
    version: 'v4.0.0',
    icon: <GitCommit size={16} />,
    title: 'The "Anti-Cloud" Masterclass Update',
    desc: 'Ripped out Firebase. Rewrote the entire suite to be 100% local. If you want to base64 encode your secrets, do it on your own CPU. Added the Regex Playground Pro because `regex101` has too many ads, and the JSON formatter now handles 5MB payloads without crying.',
    type: 'Major Release'
  },
  {
    date: 'Aug 02, 2024',
    version: 'v3.5.1',
    icon: <Code size={16} />,
    title: 'Diff Viewer AI Integration',
    desc: 'Wired up the Diff viewer to an LLM so it can actually tell you what changed instead of just highlighting lines. Yes, it took me a weekend. Yes, it is better than whatever PR action you have configured in GitHub right now.',
    type: 'Enhancement'
  },
  {
    date: 'July 14, 2024',
    version: 'v3.2.0',
    icon: <Search size={16} />,
    title: 'SEO Meta Studio Added',
    desc: 'You people kept asking how to write OpenGraph tags. Added a tool that spits out the exact HTML you need. Stop complaining about Twitter cards not loading.',
    type: 'New Tool'
  },
  {
    date: 'June 01, 2024',
    version: 'v3.0.0',
    icon: <GitPullRequest size={16} />,
    title: 'Genesis of CyberScryb 3.0',
    desc: 'Migrated from whatever garbage CSS framework I was using before to pure Tailwind and custom primitives. Typography is now actually legible. Dark mode is now the only mode. Light mode is a crutch for bad contrast ratios.',
    type: 'Major Release'
  }
];

export const Changelog = () => {
  return (
    <>
      <Helmet>
        <title>Changelog | CyberScryb</title>
        <meta name="description" content="Product updates, release notes, and cynical engineering rants from the creator of CyberScryb." />
      </Helmet>
      
      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-24">
         <div className="flex items-end justify-between mb-16 border-b border-subtle pb-8">
            <div>
               <h1 className="text-4xl font-bold tracking-tight mb-4">Changelog</h1>
               <p className="text-muted text-lg">Every commit, feature, and refactor. No marketing fluff.</p>
            </div>
            <a href="/rss.xml" target="_blank" className="flex items-center gap-2 text-accent hover:text-white transition-colors pb-1">
               <Rss size={16} />
               <span className="font-mono text-sm uppercase tracking-widest font-bold">RSS Feed</span>
            </a>
         </div>

         <div className="space-y-12 relative border-l border-strong ml-4 pl-8 md:ml-0 md:pl-0 md:border-l-0">
            {UPDATES.map((update, i) => (
               <div key={i} className="relative md:grid md:grid-cols-[160px_1fr] md:gap-8 group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[37px] md:relative md:left-0 md:flex md:justify-end mt-1.5 z-10 w-4 h-4 bg-base md:w-auto md:h-auto md:bg-transparent">
                     <div className="w-3 h-3 rounded-full bg-surface border border-accent shrink-0 md:hidden mt-0.5 shadow-[0_0_8px_rgba(52,245,197,0.4)]"></div>
                     <div className="hidden md:flex flex-col items-end">
                        <span className="font-mono text-sm text-muted block mb-1">{update.date}</span>
                        <span className="font-mono text-xs uppercase tracking-widest bg-surface border border-subtle px-2 py-0.5 rounded text-accent">{update.version}</span>
                     </div>
                  </div>

                  {/* Content Card */}
                  <div className="bg-surface border border-subtle rounded-xl p-6 shadow-sm hover:border-accent/40 transition-colors relative">
                      <div className="md:hidden flex items-center justify-between mb-4">
                        <span className="font-mono text-xs text-muted">{update.date}</span>
                        <span className="font-mono text-[10px] uppercase tracking-widest bg-base border border-subtle px-2 py-0.5 rounded text-accent">{update.version}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 mb-3">
                         <div className="p-1.5 bg-elevated rounded border border-strong text-primary">
                            {update.icon}
                         </div>
                         <h2 className="text-xl font-bold tracking-tight text-white">{update.title}</h2>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                         <span className="text-[10px] font-mono tracking-widest uppercase text-muted py-0.5 px-2 bg-base border border-strong rounded-full">{update.type}</span>
                      </div>

                      <p className="text-muted leading-relaxed font-serif text-[15px]">{update.desc}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </>
  )
}
