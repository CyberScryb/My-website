import { useState, useRef, useCallback } from 'react';
import { ai, GenerateOptions } from './ai/gemini';
import { requireAIOptIn } from './aiOptIn';

export function useAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<any>(null);
  const [streamData, setStreamData] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async <T>(opts: GenerateOptions<T>) => {
    const approved = await requireAIOptIn();
    if (!approved) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setStreamData('');
    
    abortControllerRef.current = new AbortController();

    try {
      const generated = await ai.generate({
        ...opts,
        abortSignal: abortControllerRef.current.signal
      });
      setResult(generated);
      setIsLoading(false);
      return generated;
    } catch (e: any) {
      if (e.message !== 'Aborted') {
        setError(e);
      }
      setIsLoading(false);
      throw e;
    }
  }, []);

  const stream = useCallback(async (opts: GenerateOptions<any>) => {
    const approved = await requireAIOptIn();
    if (!approved) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setStreamData('');
    
    abortControllerRef.current = new AbortController();
    
    let completeText = '';

    try {
      await ai.generateStream({
        ...opts,
        abortSignal: abortControllerRef.current.signal
      }, (chunk) => {
        completeText += chunk;
        setStreamData(completeText);
      });
      setResult(completeText);
      setIsLoading(false);
      return completeText;
    } catch (e: any) {
      if (e.message !== 'Aborted') {
        setError(e);
      }
      setIsLoading(false);
      throw e;
    }
  }, []);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return { run, stream, cancel, isLoading, error, result, streamData };
}
