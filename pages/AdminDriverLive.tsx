import React, { useState, useEffect } from 'react';
import { User, UserRole, DriverLocation } from '../types';
import { Card } from '../components/UI';
import { fetchDriverLocations, subscribeDriverLocations } from '../supabase/driverLocation';
import { supabase } from '../supabase';

interface AdminDriverLiveProps {
  users: User[];
  onBack: () => void;
}

export const AdminDriverLive: React.FC<AdminDriverLiveProps> = ({ users, onBack }) => {
  const [locations, setLocations] = useState<DriverLocation[]>([]);

  useEffect(() => {
    if (!supabase) return;
    const unsub = subscribeDriverLocations(supabase, (list) => {
      setLocations(list);
    });
    return unsub;
  }, []);

  const motoristas = users.filter((u) => u.perfil === UserRole.MOTORISTA);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black uppercase">Localização motoristas</h2>
        <button onClick={onBack} className="text-slate-500 hover:text-slate-200 text-sm">
          Voltar
        </button>
      </div>

      <Card className="space-y-4">
        <p className="text-slate-400 text-sm">
          Motoristas com o app aberto enviam a posição a cada 15 segundos. Atualização em tempo real.
        </p>
        <ul className="space-y-2">
          {locations.length === 0 && (
            <li className="text-slate-500 text-sm">Nenhum motorista com localização no momento.</li>
          )}
          {locations.map((loc) => {
            const u = motoristas.find((m) => m.id === loc.userId);
            return (
              <li key={loc.userId} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                <span className="font-medium text-slate-200">{u?.nome ?? loc.userId}</span>
                <span className="text-xs text-slate-500 font-mono">
                  {loc.lat.toFixed(5)}, {loc.lng.toFixed(5)}
                </span>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default AdminDriverLive;
