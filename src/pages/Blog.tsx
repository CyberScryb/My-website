import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/ui/Button';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { POSTS } from '../lib/blog.data';

export default function Blog() {
  return (
    <div className="py-24 px-6 max-w-3xl mx-auto">
       <Helmet>
         <title>Engineering Blog | CyberScryb</title>
         <meta name="description" content="Technical deep dives on building local-first, privacy-respecting client-side tools." />
         <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "CyberScryb Engineering Blog",
              "url": "https://cyberscryb.com/blog",
              "description": "Technical deep dives on building local-first tools."
            }
          `}
         </script>
       </Helmet>
       <h1 className="text-4xl font-bold mb-4 tracking-tight">Engineering Blog</h1>
       <p className="text-muted text-lg mb-12">Building high-performance, privacy-first web tools.</p>
       
       <div className="space-y-12">
          {POSTS.map((p, i) => (
             <Link to={`/blog/${p.slug}`} key={i} className="block group border border-subtle hover:border-[#34F5C5]/30 bg-elevated hover:bg-surface p-6 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden relative shadow-sm hover:shadow-md">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                   <div className="w-full md:w-1/3 shrink-0 rounded-xl overflow-hidden shadow border border-white/5 relative aspect-video md:aspect-square">
                     <img src={p.image} alt={p.title} className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500 group-hover:scale-105" />
                   </div>
                   <div className="flex flex-col h-full justify-between w-full">
                     <div>
                       <div className="flex items-center gap-2 text-xs font-mono text-muted mb-3 uppercase tracking-widest">
                          <Calendar size={14} className="text-[#34F5C5]"/> {p.date}
                       </div>
                       <h2 className="text-2xl font-bold mb-3 group-hover:text-[#34F5C5] transition-colors">{p.title}</h2>
                       <p className="text-muted leading-relaxed mb-6">{p.snippet}</p>
                     </div>
                     <div className="text-sm font-bold text-indigo-400 flex items-center gap-2 mt-auto">
                        Read Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                     </div>
                   </div>
                </div>
             </Link>
          ))}
       </div>
    </div>
  )
}
