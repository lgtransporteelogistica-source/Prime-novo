import React, { useEffect, useRef } from 'react';
import { User, UserRole } from '../types';
import { pushDriverLocation } from '../supabase/driverLocation';

const INTERVAL_MS = 15000;

interface DriverLocationSenderProps {
  user: User;
}

export const DriverLocationSender: React.FC<DriverLocationSenderProps> = ({ user }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (user.perfil !== UserRole.MOTORISTA) return;

    const send = () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          pushDriverLocation(
            user.id,
            user.nome,
            pos.coords.latitude,
            pos.coords.longitude,
            pos.coords.accuracy != null ? pos.coords.accuracy : undefined
          );
        },
        (err) => {
          console.warn('[DriverLocation] Erro ao obter localização:', err.message);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
      );
    };

    send();
    intervalRef.current = setInterval(send, INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user.id, user.nome, user.perfil]);

  return null;
};
