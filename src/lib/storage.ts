import { z } from 'zod';

const PREFIX = 'cyberscryb:v1:';

export const storage = {
  get<T>(key: string, schema: z.ZodType<T>, fallback: T): T {
    try {
      const item = localStorage.getItem(PREFIX + key);
      if (!item) return fallback;
      const parsed = JSON.parse(item);
      const result = schema.safeParse(parsed);
      return result.success ? result.data : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key);
  },
  clearAll(): void {
    Object.keys(localStorage).forEach(k => {
      if (k.startsWith(PREFIX)) localStorage.removeItem(k);
    });
  }
};
