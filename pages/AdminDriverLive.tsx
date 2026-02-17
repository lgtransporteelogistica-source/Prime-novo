import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, DriverLocation } from '../types';
import { Card } from '../components/UI';
import { supabase } from '../supabase';
import { fetchDriverLocations, subscribeDriverLocations } from '../supabase/driverLocation';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Corrige ícone do marcador no Vite/build
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

/** Ajusta o zoom do mapa para mostrar todos os marcadores. */
function FitBounds({ locations }: { locations: { lat: number; lng: number }[] }) {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 14);
      return;
    }
    const bounds = L.latLngBounds(locations.map((l) => [l.lat, l.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, locations]);
  return null;
}

interface AdminDriverLiveProps {
  users: User[];
  onBack: () => void;
}

export const AdminDriverLive: React.FC<AdminDriverLiveProps> = ({ users, onBack }) => {
  const [locations, setLocations] = useState<DriverLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Configure o Supabase para monitoramento em tempo real.');
      setLoading(false);
      return;
    }
    setLoading(false);
    const unsubscribe = subscribeDriverLocations(supabase, (list) => {
      setLocations(list);
    });
    return unsubscribe;
  }, []);

  const motoristasMap = useMemo(
    () => new Map(users.filter((u) => u.perfil === UserRole.MOTORISTA).map((u) => [u.id, u])),
    [users]
  );
  const list = useMemo(
    () =>
      locations
        .map((loc) => ({
          ...loc,
          userName: motoristasMap.get(loc.userId)?.nome ?? 'Motorista',
        }))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),
    [locations, motoristasMap]
  );

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMin = Math.floor((now.getTime() - d.getTime()) / 60000);
    if (diffMin < 1) return 'Agora';
    if (diffMin < 60) return `${diffMin} min atrás`;
    return d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const openInMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  };

  const centerBrazil: [number, number] = [-15.78, -47.92];
  const hasLocations = list.length > 0;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Localização dos motoristas</h2>
          <p className="text-slate-500 text-sm mt-1">Todos no mapa em tempo real. Atualiza automaticamente.</p>
        </div>
        <button
          onClick={onBack}
          className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl font-bold border border-slate-700 text-xs text-white shrink-0"
        >
          Voltar
        </button>
      </div>

      {error && (
        <Card className="border-amber-900/40 bg-amber-950/20">
          <p className="text-amber-200 text-sm">{error}</p>
        </Card>
      )}

      {!supabase && (
        <Card className="border-slate-800">
          <p className="text-slate-400 text-sm">
            Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no .env para ativar o monitoramento.
          </p>
        </Card>
      )}

      {supabase && (
        <>
          {/* Mapa com todos os motoristas */}
          <Card className="border-slate-800 overflow-hidden p-0">
            <div className="h-[400px] w-full rounded-2xl overflow-hidden">
              <MapContainer
                center={hasLocations ? [list[0].lat, list[0].lng] : centerBrazil}
                zoom={hasLocations ? 12 : 4}
                className="h-full w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds locations={list.map((l) => ({ lat: l.lat, lng: l.lng }))} />
                {list.map((loc) => (
                  <Marker
                    key={loc.userId}
                    position={[loc.lat, loc.lng]}
                    icon={icon}
                  >
                    <Popup>
                      <div className="text-sm font-bold text-slate-800">{loc.userName}</div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {formatTime(loc.updatedAt)}
                      </div>
                      <button
                        type="button"
                        onClick={() => openInMaps(loc.lat, loc.lng)}
                        className="mt-2 text-xs text-blue-600 font-bold hover:underline"
                      >
                        Abrir no Google Maps →
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            {!loading && list.length === 0 && (
              <div className="p-4 text-center text-slate-500 text-sm border-t border-slate-800">
                Nenhum motorista enviou localização ainda. Peça para abrirem o app no celular e permitirem acesso à localização.
              </div>
            )}
          </Card>

          {/* Lista (mantida para acesso rápido) */}
          {list.length > 0 && (
            <Card className="border-slate-800">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="text-emerald-500" size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest text-white">
                  Motoristas no mapa ({list.length})
                </h3>
              </div>
              <ul className="space-y-3">
                {list.map((loc) => (
                  <li
                    key={loc.userId}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 px-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="font-bold text-white">{loc.userName}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                        {formatTime(loc.updatedAt)} · {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openInMaps(loc.lat, loc.lng)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider"
                    >
                      <MapPin size={14} />
                      Ver no mapa
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDriverLive;
