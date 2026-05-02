import { useState, useEffect } from 'react';
import LZString from 'lz-string';

export function useToolState<T>(toolId: string, initialState: T): [T, (state: T | ((val: T) => T)) => void, string, () => void] {
  const [state, setState] = useState<T>(() => {
    // 0. Check for injected example state
    if ((window as any).__CYBER_EXAMPLE_STATE) {
       const override = (window as any).__CYBER_EXAMPLE_STATE;
       delete (window as any).__CYBER_EXAMPLE_STATE;
       return override as T;
    }
    // 1. Check URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(hash);
        if (decompressed) {
          return JSON.parse(decompressed) as T;
        }
      } catch (e) {
        console.warn('Failed to parse URL hash', e);
      }
    }
    // 2. Check localStorage
    const local = localStorage.getItem(`cyberscryb_tool_${toolId}`);
    if (local) {
      try {
        return JSON.parse(local) as T;
      } catch (e) {
        console.warn('Failed to parse localStorage', e);
      }
    }
    return initialState;
  });

  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    // Sync state changes to localStorage and update share link
    localStorage.setItem(`cyberscryb_tool_${toolId}`, JSON.stringify(state));
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    const url = new URL(window.location.href);
    url.hash = compressed;
    setShareUrl(url.toString());
    
    // We intentionally do NOT update the window location hash on every keystroke
    // because it fills up history and can be slow. The share URL is generated for explicit copying.
  }, [state, toolId]);

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
  };

  return [state, setState, shareUrl, copyShareLink];
}
