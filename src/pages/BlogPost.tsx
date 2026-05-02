import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar } from 'lucide-react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { POSTS } from '../lib/blog.data';
import { Article1 } from './blog/Article1';
import { Article2 } from './blog/Article2';

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const post = POSTS.find(p => p.slug === id);

  if (!post) {
    return (
      <div className="py-24 px-6 max-w-3xl mx-auto text-center">
         <h1 className="text-4xl font-bold mb-4 tracking-tight">Post Not Found</h1>
         <p className="text-muted text-lg mb-8">The article you are looking for doesn't exist.</p>
         <Link to="/blog" className="text-[#34F5C5] hover:underline font-bold">Return to Blog</Link>
      </div>
    );
  }
  
  if (post.slug === 'security-theater') return <Article1 />;
  if (post.slug === 'leaving-the-cloud') return <Article2 />;

  return (
    <article className="py-12 md:py-24 px-6 max-w-4xl mx-auto">
       <Helmet>
         <title>{post.title} | CyberScryb Blog</title>
         <meta name="description" content={post.snippet} />
         <meta property="og:title" content={post.title} />
         <meta property="og:description" content={post.snippet} />
         <meta property="og:image" content={post.image} />
       </Helmet>
       <div className="mb-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors text-sm font-bold tracking-widest uppercase mb-8">
             <ArrowLeft size={16} /> Back to Blog
          </Link>
          <div className="flex items-center gap-2 text-xs font-mono text-muted mb-6 uppercase tracking-widest">
             <Calendar size={14} className="text-[#34F5C5]"/> Published {post.date} &bull; 5 min read
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary mb-6 leading-tight">
             {post.title}
          </h1>
          <p className="text-xl text-muted leading-relaxed max-w-3xl">
             {post.snippet}
          </p>
       </div>
       
       <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-subtle mb-16 cursor-pointer group" onClick={(e) => {
          const el = e.currentTarget;
          el.style.transform = 'scale(0.98)';
          setTimeout(() => el.style.transform = 'scale(1)', 150);
       }} style={{ transition: 'transform 150ms ease-out' }}>
          <img src={post.image} alt={post.title} className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal hover:scale-105 transition-all duration-700 group-hover:drop-shadow-[0_0_15px_rgba(52,245,197,0.3)]" />
       </div>

       <div className="prose prose-invert prose-lg max-w-3xl mx-auto markdown-body bg-transparent">
          <MarkdownPreview source={post.content} style={{backgroundColor: 'transparent', color: 'inherit'}} />
       </div>
       
       <div className="mt-24 pt-12 border-t border-subtle max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 bg-surface/50 p-8 rounded-3xl border border-white/5">
             <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#34F5C5] to-indigo-500 shrink-0 p-1">
                <div className="w-full h-full rounded-full bg-base overflow-hidden">
                   <img src="https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&q=80&w=200" alt="Author" className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
             </div>
             <div>
                <h3 className="text-xl font-bold mb-2">Written by CyberScryb Engineering</h3>
                <p className="text-muted leading-relaxed">We build privacy-first, purely client-side developer tools. No servers, no tracking, just fast software.</p>
             </div>
          </div>
       </div>
    </article>
  )
}
