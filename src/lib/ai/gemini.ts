import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

export const gemini = new GoogleGenAI({ 
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || "mock-key",
  // In a real app we'd use process.env.GEMINI_API_KEY on the server
});

export interface GenerateOptions<T> {
  prompt: string;
  model: 'gemini-3.1-flash' | 'gemini-3.1-pro';
  schema?: any; // GoogleGenAI schema or null
  abortSignal?: AbortSignal;
}

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const ai = {
  async generateStream(opts: GenerateOptions<any>, onChunk: (text: string) => void) {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      // Mock for AI Studio preview if no key
      onChunk("...");
      onChunk("\\n\\n[Mock AI Response: Please configure VITE_GEMINI_API_KEY in .env]");
      return;
    }
    try {
      const responseStream = await gemini.models.generateContentStream({
        model: opts.model,
        contents: opts.prompt,
        config: {
          responseMimeType: opts.schema ? "application/json" : "text/plain",
          responseSchema: opts.schema,
          // signal: opts.abortSignal // Add abort mapping if supported by SDK natively, GenAI SDK v0.1 does not take signal directly in config usually, let's omit for simplicity or implement custom fetch.
        }
      });
      
      for await (const chunk of responseStream) {
        if (opts.abortSignal?.aborted) throw new Error('Aborted');
        onChunk(chunk.text || '');
      }
    } catch (e: any) {
      if (e.message === 'Aborted') throw e;
      console.error("AI Error:", e);
      throw e;
    }
  },
  
  async generate<T>(opts: GenerateOptions<T>): Promise<T | string> {
    const cacheKey = await sha256(opts.model + opts.prompt + (opts.schema ? JSON.stringify(opts.schema) : ''));
    const cached = sessionStorage.getItem("ai:" + cacheKey);
    if (cached) return opts.schema ? JSON.parse(cached) : cached;

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      return opts.schema ? {} as T : "[Mock AI Response: Please configure VITE_GEMINI_API_KEY in .env]";
    }

    const response = await gemini.models.generateContent({
      model: opts.model,
      contents: opts.prompt,
      config: {
        responseMimeType: opts.schema ? "application/json" : "text/plain",
        responseSchema: opts.schema,
      }
    });

    const result = response.text || '';
    sessionStorage.setItem("ai:" + cacheKey, opts.schema ? result : result);
    return opts.schema ? JSON.parse(result) as T : result;
  }
};
