export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface ToolMetadata {
  description: string;
  keywords: string[];
  os: string;
  category: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: string;
  icon: any; // React.ElementType
  keywords: string[];
  description: string;
  aiFeatures: string[];
  relatedTools: string[];
  component: React.LazyExoticComponent<React.FC<any>>;
}

export type ToolCategory = 'Crypto' | 'Encoding' | 'Security' | 'Dev' | 'Web' | 'Media' | 'Data' | 'Productivity' | 'Legal';
