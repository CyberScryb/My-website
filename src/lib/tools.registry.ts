import { lazy } from 'react';
import type { Tool } from '../types';
import { Hash, ShieldCheck, Fingerprint, Lock, Key, FileJson, Clock, Code2, QrCode, Palette, Image as ImgIcon, Code, Search, Globe, Server, FileText, Type } from 'lucide-react';

export const TOOLS: Tool[] = [
  // CRYPTO
  {
    id: 'base64', slug: 'base64', name: 'Base64 Studio', tagline: 'Auto-detect mode, URL-safe, chunks, Hex.',
    category: 'Encoding', icon: Hash, keywords: ['base64', 'encode', 'decode', 'hex'],
    description: 'Quickly encode or decode Base64 strings. Client-side processing ensures your data never leaves your browser.',
    aiFeatures: [], relatedTools: ['jwt-inspector', 'encryption-lab'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'base64')!.component as any })))
  },
  {
    id: 'password', slug: 'password', name: 'Password Checker', tagline: 'Entropy analysis, crack time, generator.',
    category: 'Security', icon: ShieldCheck, keywords: ['password', 'entropy', 'zxcvbn', 'crack time'],
    description: 'Analyze password strength using Dropboxs zxcvbn library. Estimates crack times and provides actionable feedback.',
    aiFeatures: [], relatedTools: ['hash-forge', 'encryption-lab'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'password')!.component as any })))
  },
  {
    id: 'hash', slug: 'hash', name: 'Hash Forge', tagline: 'MD5, SHA, BLAKE3 generation & comparisons.',
    category: 'Crypto', icon: Fingerprint, keywords: ['hash', 'md5', 'sha1', 'sha256', 'sha512', 'sha3'],
    description: 'Generate cryptographic hashes instantly. Compare different algorithms side-by-side.',
    aiFeatures: ['Explain hash usage'], relatedTools: ['password-checker', 'uuid-forge'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'hash')!.component as any })))
  },
  {
    id: 'encryption', slug: 'encryption', name: 'Encryption Lab', tagline: 'Symmetric & Asymmetric lab. AES-GCM, ChaCha20, RSA generation.',
    category: 'Crypto', icon: Lock, keywords: ['aes', 'encrypt', 'decrypt', 'symmetric'],
    description: 'Encrypt and decrypt text securely using AES. Keys are never sent to a server.',
    aiFeatures: [], relatedTools: ['base64-studio', 'hash-forge'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'encryption')!.component as any })))
  },
  {
    id: 'jwt', slug: 'jwt', name: 'JWT Inspector', tagline: 'Decode header, payload, and signature of JSON Web Tokens.',
    category: 'Security', icon: Key, keywords: ['jwt', 'json web token', 'decode'],
    description: 'Inspect JSON Web Tokens easily. Decodes headers and payloads and highlights anomalies.',
    aiFeatures: ['Explain claims'], relatedTools: ['base64-studio'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'jwt')!.component as any })))
  },
  {
    id: 'uuid', slug: 'uuid', name: 'ID Forge', tagline: 'Generate UUIDv4, NanoID, ULID, custom alphabets.',
    category: 'Crypto', icon: Hash, keywords: ['uuid', 'guid', 'nanoid', 'generate'],
    description: 'Generate bulk UUIDv4 strings instantly using the Crypto API.',
    aiFeatures: [], relatedTools: ['hash-forge'],
    component: lazy(() => import('../tools/CryptoTools').then(m => ({ default: m.CryptoTools.find(t => t.id === 'uuid')!.component as any })))
  },
  
  // DATA
  {
    id: 'json-visualizer', slug: 'json', name: 'JSON Visualizer', tagline: 'Interactive graph visualization of nested JSON structures.',
    category: 'Data', icon: FileJson, keywords: ['json', 'graph', 'format', 'visualize'],
    description: 'Format and visualize complex JSON nested objects and arrays.',
    aiFeatures: ['Describe this JSON', 'Generate sample JSON'], relatedTools: ['json-csv-studio'],
    component: lazy(() => import('../tools/DataTools').then(m => ({ default: m.DataTools.find(t => t.id === 'json-visualizer')!.component as any })))
  },
  {
    id: 'timestamp', slug: 'timestamp', name: 'Timestamp Studio', tagline: 'Epoch conversions, ISO8601 formatting, math.',
    category: 'Data', icon: Clock, keywords: ['time', 'epoch', 'iso8601', 'date'],
    description: 'Quickly convert between epoch timestamps and ISO 8601 formats.',
    aiFeatures: [], relatedTools: ['cron-builder'],
    component: lazy(() => import('../tools/DataTools').then(m => ({ default: m.DataTools.find(t => t.id === 'timestamp')!.component as any })))
  },
  {
    id: 'json-csv', slug: 'json-csv', name: 'JSON ↔ CSV Studio', tagline: 'Round-trip JSON, CSV, YAML. Includes schema validation.',
    category: 'Data', icon: FileJson, keywords: ['json', 'csv', 'yaml', 'convert'],
    description: 'Convert arrays of JSON objects into CSV files or YAML effortlessly.',
    aiFeatures: [], relatedTools: ['json-visualizer'],
    component: lazy(() => import('../tools/DataTools').then(m => ({ default: m.DataTools.find(t => t.id === 'json-csv')!.component as any })))
  },
  {
    id: 'diff-viewer', slug: 'diff', name: 'Diff Viewer', tagline: 'Side-by-side or inline semantic diff viewer.',
    category: 'Dev', icon: Code2, keywords: ['diff', 'compare', 'text'],
    description: 'Compare two blocks of text or code and see semantic differences inline.',
    aiFeatures: ['Summarize changes'], relatedTools: ['json-visualizer'],
    component: lazy(() => import('../tools/DataTools').then(m => ({ default: m.DataTools.find(t => t.id === 'diff-viewer')!.component as any })))
  },

  // DEV
  {
    id: 'cron', slug: 'cron', name: 'Cron Builder', tagline: 'Visual builder for cron expressions with human translation.',
    category: 'Dev', icon: Clock, keywords: ['cron', 'schedule', 'time'],
    description: 'Easily construct cron expressions and see their parsed meanings.',
    aiFeatures: ['Explain this cron'], relatedTools: ['timestamp-studio'],
    component: lazy(() => import('../tools/DevTools').then(m => ({ default: m.DevTools.find(t => t.id === 'cron')!.component as any })))
  },
  {
    id: 'markdown', slug: 'markdown', name: 'Markdown Lab', tagline: 'Live preview, syntax highlighting, GFM.',
    category: 'Dev', icon: Code, keywords: ['markdown', 'preview', 'gfm'],
    description: 'Write Markdown with real-time GitHub Flavored Markdown previews.',
    aiFeatures: [], relatedTools: ['seo-meta-studio'],
    component: lazy(() => import('../tools/DevTools').then(m => ({ default: m.DevTools.find(t => t.id === 'markdown')!.component as any })))
  },
  {
    id: 'regex-playground', slug: 'regex', name: 'Regex Playground Pro', tagline: 'Multi-flavor, named groups, replace.',
    category: 'Dev', icon: Type, keywords: ['regex', 'regular expression', 'match'],
    description: 'Test and debug your regular expressions against sample text.',
    aiFeatures: ['Explain this regex', 'Generate from description'], relatedTools: ['text-toolkit'],
    component: lazy(() => import('../tools/DevTools').then(m => ({ default: m.DevTools.find(t => t.id === 'regex-playground')!.component as any })))
  },

  // WEB
  {
    id: 'curl-code', slug: 'curl', name: 'cURL ↔ Code', tagline: 'Convert cURL commands to fetch, axios, Python, Go, Rust.',
    category: 'Dev', icon: Code2, keywords: ['curl', 'fetch', 'api', 'requests'],
    description: 'Convert messy cURL commands directly into usable API fetch calls in multiple languages.',
    aiFeatures: ['Explain this request'], relatedTools: ['http-status-lab'],
    component: lazy(() => import('../tools/WebTools').then(m => ({ default: m.WebTools.find(t => t.id === 'curl-code')!.component as any })))
  },
  {
    id: 'gig', slug: 'gig', name: 'Gig Auto-Pilot', tagline: 'Automate freelance tasks & client proposals.',
    category: 'Productivity', icon: Globe, keywords: ['gig', 'proposal', 'freelance'],
    description: 'Generate high-quality client proposals based on job descriptions.',
    aiFeatures: ['Generate proposals with variants'], relatedTools: ['lorem-ipsum'],
    component: lazy(() => import('../tools/WebTools').then(m => ({ default: m.WebTools.find(t => t.id === 'gig')!.component as any })))
  },
  {
    id: 'privacy', slug: 'legal', name: 'Legal Boilerplate Studio', tagline: 'Generate Privacy Policies & ToS locally.',
    category: 'Legal', icon: Globe, keywords: ['privacy policy', 'tos', 'terms', 'legal'],
    description: 'Generate custom Terms of Service and Privacy Policies for your side projects.',
    aiFeatures: ['Tailor for my app'], relatedTools: ['seo-meta-studio'],
    component: lazy(() => import('../tools/WebTools').then(m => ({ default: m.WebTools.find(t => t.id === 'privacy')!.component as any })))
  },
  {
    id: 'seo-meta', slug: 'seo', name: 'SEO & Meta Studio', tagline: 'Craft OpenGraph, robots.txt, sitemap, JSON-LD.',
    category: 'Web', icon: Search, keywords: ['seo', 'meta', 'opengraph', 'tags'],
    description: 'Preview and generate optimal SEO meta tags and OpenGraph configurations.',
    aiFeatures: ['Generate meta from URL/topic'], relatedTools: ['markdown-lab'],
    component: lazy(() => import('../tools/WebTools').then(m => ({ default: m.WebTools.find(t => t.id === 'seo-meta')!.component as any })))
  },
  {
    id: 'http-status', slug: 'http', name: 'HTTP Status Lab', tagline: 'Codes, CORS preflight, Headers analyzer.',
    category: 'Web', icon: Server, keywords: ['http', 'status', 'cors', 'headers'],
    description: 'Quickly look up HTTP Status codes and their meanings.',
    aiFeatures: ['Decode this response'], relatedTools: ['curl-to-code'],
    component: lazy(() => import('../tools/WebTools').then(m => ({ default: m.WebTools.find(t => t.id === 'http-status')!.component as any })))
  },

  // MEDIA
  {
    id: 'image', slug: 'exif', name: 'Image Metadata Stripper', tagline: 'Client-side EXIF viewer & stripper. Preserve privacy.',
    category: 'Media', icon: ImgIcon, keywords: ['image', 'crop', 'resize', 'convert'],
    description: 'Perform quick image adjustments locally without uploading files to a server.',
    aiFeatures: ['Generate alt text'], relatedTools: ['color-palette'],
    component: lazy(() => import('../tools/MediaTools').then(m => ({ default: m.MediaTools.find(t => t.id === 'image')!.component as any })))
  },
  {
    id: 'svg', slug: 'svg', name: 'SVG Optimizer', tagline: 'Minify and optimize SVGs using SVGO patterns.',
    category: 'Media', icon: ImgIcon, keywords: ['svg', 'vector', 'minify', 'optimize'],
    description: 'Compress and clean SVG markup.',
    aiFeatures: ['Describe and rename'], relatedTools: ['image-studio'],
    component: lazy(() => import('../tools/MediaTools').then(m => ({ default: m.MediaTools.find(t => t.id === 'svg')!.component as any })))
  },
  {
    id: 'qrcode', slug: 'qr', name: 'QR & Barcode Forge', tagline: 'Secure QR codes, EAN-13, no tracking.',
    category: 'Media', icon: QrCode, keywords: ['qr code', 'barcode', 'generate'],
    description: 'Generate track-free, high-resolution QR codes offline.',
    aiFeatures: [], relatedTools: ['color-palette'],
    component: lazy(() => import('../tools/MediaTools').then(m => ({ default: m.MediaTools.find(t => t.id === 'qrcode')!.component as any })))
  },
  {
    id: 'color-palette', slug: 'color', name: 'Color Palette Studio', tagline: 'Harmonies, WCAG Contrast Grid, exports.',
    category: 'Media', icon: Palette, keywords: ['color', 'hex', 'rgb', 'palette'],
    description: 'Explore color harmonies and generate accessibility-friendly palettes.',
    aiFeatures: ['Generate palette from mood'], relatedTools: ['svg-optimizer'],
    component: lazy(() => import('../tools/MediaTools').then(m => ({ default: m.MediaTools.find(t => t.id === 'color-palette')!.component as any })))
  },

  // TEXT
  {
    id: 'anti-ai', slug: 'humanize', name: 'Anti-AI Humanizer', tagline: 'Evade detectors by normalizing phrasing and entropy. Compares diff.',
    category: 'Text', icon: Type, keywords: ['anti ai', 'humanize', 'rewrite'],
    description: 'Rewrite AI-generated text to sound more natural and evade basic detectors.',
    aiFeatures: ['Humanize with Pro'], relatedTools: ['text-toolkit'],
    component: lazy(() => import('../tools/TextTools').then(m => ({ default: m.TextTools.find(t => t.id === 'anti-ai')!.component as any })))
  },
  {
    id: 'lorem', slug: 'lorem', name: 'Lorem Ipsum++', tagline: 'Standard, hipster, corporate, hacker jargon profiles.',
    category: 'Text', icon: FileText, keywords: ['lorem ipsum', 'placeholder', 'dummy text'],
    description: 'Generate varied placeholder text with different thematic dictionaries.',
    aiFeatures: ['Themed lorem'], relatedTools: ['text-toolkit'],
    component: lazy(() => import('../tools/TextTools').then(m => ({ default: m.TextTools.find(t => t.id === 'lorem')!.component as any })))
  },
  {
    id: 'text-toolkit', slug: 'text', name: 'Text Toolkit', tagline: 'Case converter, slugify, sort, dedupe, count.',
    category: 'Text', icon: Type, keywords: ['text', 'slugify', 'case', 'sort', 'dedupe'],
    description: 'Perform common string manipulation operations on text blocks.',
    aiFeatures: ['Suggest transformations'], relatedTools: ['regex-playground-pro'],
    component: lazy(() => import('../tools/TextTools').then(m => ({ default: m.TextTools.find(t => t.id === 'text-toolkit')!.component as any })))
  }
];
