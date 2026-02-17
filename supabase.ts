/**
 * Cliente Supabase.
 * Se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estiverem definidos em .env.local,
 * conecta à base online. Caso contrário, retorna null (app usa localStorage).
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_URL;
const key = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && key ? createClient(url, key) : null;

export const isSupabaseOnline = (): boolean => !!supabase;

// Stub para compatibilidade com código que chama supabase.from() sem checar null
export const mapFromDb = (item: any) => item;
export const mapToDb = (item: any) => item;
