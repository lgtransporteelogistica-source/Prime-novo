/**
 * Cliente Supabase.
 * Se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estiverem definidos em .env.local,
 * conecta à base online. Caso contrário, retorna null (app usa localStorage).
 * Usa fetch com retry e timeout maior para rede móvel.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const REQUEST_TIMEOUT_MS = 25000;
const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [1500, 3000];

/** Fetch que dá timeout e repete até 3x (útil no celular). */
async function fetchWithRetryAndTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let lastError: Error | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(input, {
        ...init,
        signal: init?.signal ?? controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok || attempt === MAX_RETRIES - 1) return res;
      lastError = new Error(`HTTP ${res.status}`);
    } catch (e) {
      clearTimeout(timeoutId);
      lastError = e instanceof Error ? e : new Error(String(e));
    }
    if (attempt < MAX_RETRIES - 1) {
      await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt] ?? 3000));
    }
  }
  throw lastError ?? new Error('fetch failed');
}

const url = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL;
const key = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        global: { fetch: fetchWithRetryAndTimeout as typeof fetch },
      })
    : null;

export const isSupabaseOnline = (): boolean => !!supabase;

// Stub para compatibilidade com código que chama supabase.from() sem checar null
export const mapFromDb = (item: any) => item;
export const mapToDb = (item: any) => item;
