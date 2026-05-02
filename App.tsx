import React, { Suspense, useState, useEffect, lazy } from 'react';
import { BrowserRouter, Routes, Route, Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Terminal, Search, Github, Settings, SearchCode } from 'lucide-react';
import { TOOLS } from './src/lib/tools.registry';
import { EXAMPLES, ToolExample } from './src/lib/examples.data';
import { ErrorBoundary } from 'react-error-boundary';
import { CommandPalette } from './src/components/CommandPalette';

// Home Page
const Home = lazy(() => import('./src/pages/Home'));
const Blog = lazy(() => import('./src/pages/Blog'));
const BlogPost = lazy(() => import('./src/pages/BlogPost'));
const Changelog = lazy(() => import('./src/pages/Changelog').then(module => ({ default: module.Changelog })));
const Manifesto = lazy(() => import('./src/pages/Manifesto').then(module => ({ default: module.Manifesto })));

const PageSkeleton = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
     <div className="w-8 h-8 border-4 border-[#34F5C5]/20 border-t-[#34F5C5] rounded-full animate-spin"></div>
  </div>
);

const Header = ({ onSearchClick }: { onSearchClick: () => void }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-subtle bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 text-primary font-bold tracking-tight text-lg group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded">
          <Terminal size={24} className="text-accent group-hover:drop-shadow-[0_0_8px_rgba(52,245,197,0.8)] transition-all" />
          <span className="group-hover:text-accent transition-colors relative">
            CyberScryb
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <button onClick={onSearchClick} className="flex items-center gap-2 hover:text-primary transition-colors hover:bg-surface px-3 py-1.5 rounded-lg border border-transparent hover:border-subtle focus-ring">
            <Search size={16} /> <span className="font-mono text-[10px] uppercase font-bold tracking-widest opacity-80 bg-elevated border border-strong rounded px-1">Cmd+K</span>
          </button>
          <Link to="/" className="hover:text-accent transition-colors hidden sm:block focus-ring rounded">Tools</Link>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-subtle text-[10px] uppercase tracking-widest font-mono text-[#00D17A]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-[pulse_2s_ease-in-out_infinite]"></span> Local
          </div>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="w-full border-t border-subtle bg-base pt-16 pb-8 px-6 text-sm">
    <div className="mx-auto w-full max-w-7xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <div>
          <h4 className="font-bold text-primary mb-4 font-mono uppercase tracking-widest text-xs">Tools</h4>
          <ul className="space-y-3 text-muted">
            <li><Link to="/tools/jwt" className="hover:text-accent transition-colors">JWT Inspector</Link></li>
            <li><Link to="/tools/regex" className="hover:text-accent transition-colors">Regex Engine</Link></li>
            <li><Link to="/tools/diff" className="hover:text-accent transition-colors">Diff Viewer</Link></li>
            <li><Link to="/tools/json" className="hover:text-accent transition-colors">JSON Formatter</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4 font-mono uppercase tracking-widest text-xs">Resources</h4>
          <ul className="space-y-3 text-muted">
            <li><Link to="/blog" className="hover:text-accent transition-colors">Engineering Blog</Link></li>
            <li><a href="#" className="hover:text-accent transition-colors">Documentation</a></li>
            <li><a href="#" className="hover:text-accent transition-colors">Open Source</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4 font-mono uppercase tracking-widest text-xs">Company-ish</h4>
          <ul className="space-y-3 text-muted">
            <li><Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            <li><Link to="/manifesto" className="hover:text-accent transition-colors">Manifesto</Link></li>
            <li><Link to="/changelog" className="hover:text-accent transition-colors">Changelog</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-primary mb-4 font-mono uppercase tracking-widest text-xs">Connect</h4>
          <ul className="space-y-3 text-muted flex gap-4">
            <li><a href="#" className="hover:text-accent transition-colors p-2 bg-surface rounded-full block border border-subtle"><Github size={20}/></a></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted font-mono gap-4 border-t border-subtle pt-8">
         <div className="flex items-center gap-3">
            <span>&copy; {new Date().getFullYear()} CyberScryb.</span>
            <span className="hidden md:inline px-2 py-1 bg-surface border border-subtle rounded-md">Crafted with WebCrypto and stubbornness.</span>
         </div>
         <div className="flex items-center gap-4">
            <span className="opacity-50">Build: 9f8a2b1</span>
            <div className="flex items-center gap-2 text-[#00D17A]">
              <span className="w-2 h-2 rounded-full bg-accent"></span> All systems local.
            </div>
         </div>
      </div>
    </div>
  </footer>
);

const NotFound = () => (
  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center font-mono">
    <div className="max-w-md w-full bg-surface border border-subtle rounded-lg p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-base/80 z-10 custom-scanlines pointer-events-none mix-blend-overlay"></div>
      <div className="flex flex-col gap-2 text-left relative z-20">
        <div className="text-accent mb-4">$ cd /pages/not-found</div>
        <div className="text-danger mb-2 cursor-blink">bash: cd: /pages/not-found: No such file or directory</div>
        <div className="mb-6 opacity-60">The route you requested could not be resolved.</div>
        <Link to="/" className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-base rounded font-bold uppercase tracking-widest w-fit hover:bg-white transition-colors">Return to Root</Link>
      </div>
    </div>
  </div>
);

const SimpleTextPage = ({ title, content }: { title: string, content: React.ReactNode }) => (
  <div className="max-w-3xl mx-auto py-24 px-6">
    <Helmet><title>{title} | CyberScryb</title></Helmet>
    <h1 className="text-4xl font-bold mb-8 text-primary tracking-tight">{title}</h1>
    <div className="prose prose-invert prose-lg text-muted">{content}</div>
  </div>
);

const Layout = () => {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen font-sans bg-base text-primary flex flex-col selection:bg-accent/30 selection:text-white">
      <Header onSearchClick={() => setCmdOpen(true)}/>
      <CommandPalette isOpen={cmdOpen} onClose={() => setCmdOpen(false)} />
      <main className="flex-1 flex flex-col relative w-full overflow-x-hidden">
        <ErrorBoundary fallback={<div className="p-12 text-danger font-mono border border-danger/30 m-6 rounded bg-danger/5">Exception thrown during render.</div>}>
           <Suspense fallback={<PageSkeleton />}>
             <Outlet />
           </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

const ToolRouteWrapper = ({ tool }: { tool: any }) => {
  const Component = tool.component;
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <Helmet>
        <title>{tool.name} | CyberScryb</title>
        <meta name="description" content={tool.description} />
      </Helmet>
      <Suspense fallback={<PageSkeleton/>}>
         <Component config={tool} onClose={() => navigate('/')} />
      </Suspense>
    </div>
  );
};

const ExampleRouteWrapper = ({ example, tool }: { example: ToolExample, tool: any }) => {
  const Component = tool.component;
  const navigate = useNavigate();
  
  // Inject state before render
  if (typeof window !== 'undefined') {
     (window as any).__CYBER_EXAMPLE_STATE = example.state;
  }

  const faqSchema = {
     "@context": "https://schema.org",
     "@type": "FAQPage",
     "mainEntity": example.faq.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
           "@type": "Answer",
           "text": q.answer
        }
     }))
  };

  return (
    <div className="flex flex-col min-h-screen bg-base pb-24">
       <Helmet>
         <title>{example.title}</title>
         <meta name="description" content={example.metaDescription} />
         <link rel="canonical" href={`https://cyberscryb.com/tools/${tool.slug}/examples/${example.exampleSlug}`} />
         <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
       </Helmet>

       <div className="max-w-7xl mx-auto w-full px-6 py-12">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-6">{example.h1}</h1>
          <p className="text-xl text-muted leading-relaxed max-w-3xl mb-12">{example.paragraph}</p>
          
          <div className="h-[700px] border border-subtle rounded-2xl overflow-hidden shadow-2xl relative bg-base">
             <Suspense fallback={<PageSkeleton/>}>
                <Component config={tool} onClose={() => navigate('/')} />
             </Suspense>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2 space-y-8">
                <h3 className="text-xl font-bold text-white border-b border-subtle pb-4">Frequently Asked Questions</h3>
                <div className="space-y-6">
                   {example.faq.map((q, i) => (
                      <div key={i}>
                         <h4 className="font-bold text-accent mb-2">{q.question}</h4>
                         <p className="text-muted leading-relaxed">{q.answer}</p>
                      </div>
                   ))}
                </div>
             </div>
             
             <div>
                <h3 className="text-[10px] font-mono text-muted uppercase tracking-widest font-bold mb-4">Related Patterns</h3>
                <div className="flex flex-col gap-2">
                   {example.relatedLinks.map((link, i) => (
                      <Link key={i} to={link.url} className="px-4 py-3 bg-surface hover:bg-elevated border border-transparent hover:border-subtle rounded-lg text-primary transition-colors text-sm">
                         {link.title}
                      </Link>
                   ))}
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

const oldSlugMap: Record<string, string> = {
  'base64-studio': 'base64',
  'password-checker': 'password',
  'hash-forge': 'hash',
  'encryption-lab': 'encryption',
  'jwt-inspector': 'jwt',
  'uuid-forge': 'uuid',
  'json-visualizer': 'json',
  'timestamp-studio': 'timestamp',
  'json-csv-studio': 'json-csv',
  'diff-viewer': 'diff',
  'cron-builder': 'cron',
  'markdown-lab': 'markdown',
  'regex-playground-pro': 'regex',
  'curl-to-code': 'curl',
  'gig-auto-pilot': 'gig',
  'legal-boilerplate-studio': 'legal',
  'seo-meta-studio': 'seo',
  'http-status-lab': 'http',
  'image-studio': 'exif',
  'svg-optimizer': 'svg',
  'qr-barcode-forge': 'qr',
  'color-palette-studio': 'color',
  'anti-ai-humanizer': 'humanize',
  'lorem-ipsum-plus': 'lorem',
  'text-toolkit': 'text',
};

const LegacySlugRedirect = () => {
    const location = useLocation();
    const pathParts = location.pathname.split('/');
    
    // Check if it's an old /tools/old-slug... route
    const toolsIndex = pathParts.indexOf('tools');
    if (toolsIndex !== -1 && pathParts.length > toolsIndex + 1) {
        const potentialOldSlug = pathParts[toolsIndex + 1];
        if (oldSlugMap[potentialOldSlug]) {
            pathParts[toolsIndex + 1] = oldSlugMap[potentialOldSlug];
            return <Navigate to={pathParts.join('/') + location.search + location.hash} replace />;
        }
    }
    
    // Check if it's the really old /t/slug route
    const tIndex = pathParts.indexOf('t');
    if (tIndex !== -1 && pathParts.length > tIndex + 1) {
        const potentialSlug = pathParts[tIndex + 1];
        const newSlug = oldSlugMap[potentialSlug] || potentialSlug;
        pathParts[tIndex] = 'tools';
        pathParts[tIndex + 1] = newSlug;
        return <Navigate to={pathParts.join('/') + location.search + location.hash} replace />;
    }

    return <NotFound />;
};

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="blog" element={<Blog />} />
            <Route path="changelog" element={<Changelog />} />
            <Route path="manifesto" element={<Manifesto />} />
            <Route path="blog/:id" element={<BlogPost />} />
            <Route path="privacy" element={<SimpleTextPage title="Privacy Policy" content={<><p>We don't collect your data. Everything runs locally in your browser. Period.</p><p>If you use a tool that connects to an external API (which you must opt-in to), data is sent directly from your client to that API.</p></>} />} />
            <Route path="terms" element={<SimpleTextPage title="Terms of Service" content={<><p>Use these tools at your own risk. We provide them "as is" without warranty.</p></>} />} />
            {TOOLS.map(tool => (
                <Route key={tool.slug} path={"tools/" + tool.slug} element={<ToolRouteWrapper tool={tool} />} />
            ))}
            {EXAMPLES.map(ex => {
                const tool = TOOLS.find(t => t.slug === ex.toolSlug);
                if (!tool) return null;
                return (
                   <Route key={`${ex.toolSlug}-${ex.exampleSlug}`} path={`tools/${ex.toolSlug}/examples/${ex.exampleSlug}`} element={<ExampleRouteWrapper example={ex} tool={tool} />} />
                );
            })}
            <Route path="*" element={<LegacySlugRedirect />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

