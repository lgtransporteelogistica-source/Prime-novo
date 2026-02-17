/**
 * Envio e leitura de localização em tempo real dos motoristas.
 * Requer tabela driver_locations no Supabase (migration 00004).
 */

import { supabase } from '../supabase';
import type { DriverLocation } from '../types';

const TABLE = 'driver_locations';

export async function pushDriverLocation(
  userId: string,
  userName: string | undefined,
  lat: number,
  lng: number,
  accuracy?: number
): Promise<void> {
  if (!supabase) return;
  await supabase.from(TABLE).upsert(
    {
      user_id: userId,
      lat,
      lng,
      accuracy: accuracy != null ? accuracy : null,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id' }
  );
}

export async function fetchDriverLocations(): Promise<DriverLocation[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) return [];
  return (data || []).map((row: { user_id: string; lat: number; lng: number; accuracy?: number; updated_at: string }) => ({
    userId: row.user_id,
    lat: row.lat,
    lng: row.lng,
    accuracy: row.accuracy,
    updatedAt: row.updated_at
  }));
}

export function subscribeDriverLocations(
  client: ReturnType<typeof import('../supabase').supabase>,
  onPayload: (locations: DriverLocation[]) => void
): () => void {
  if (!client) return () => {};
  const fetch = () => fetchDriverLocations().then(onPayload);
  fetch();
  const channel = client
    .channel('driver_locations_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: TABLE }, fetch)
    .subscribe();
  return () => {
    channel.unsubscribe();
  };
}
