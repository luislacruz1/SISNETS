import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

/**
 * HOOK DE TIEMPO REAL RESILIENTE (Patrón Singleton de SIMEC / SignalR)
 * 
 * Replica la arquitectura de useSignalR del proyecto MantenimientoEquipos:
 * 1. Conexión global única para evitar múltiples sockets abiertos
 * 2. Reconexión y reintentos automáticos
 * 3. Doble garantía: Replicación instantánea (<1s) + Polling de respaldo (25s)
 * 4. Suscripción unificada a tablas y eventos
 */

let globalChannel = null;
let isSubscribing = false;
const eventListeners = {
  directorio: new Set(),
  usuarios: new Set(),
  all: new Set()
};

const notifyListeners = (eventType, payload) => {
  if (eventListeners[eventType]) {
    eventListeners[eventType].forEach((cb) => {
      try { cb(payload); } catch (e) { console.error('Error en listener realtime:', e); }
    });
  }
  eventListeners.all.forEach((cb) => {
    try { cb({ eventType, payload }); } catch (e) { console.error('Error en listener realtime:', e); }
  });
};

const getOrCreateChannel = () => {
  if (!globalChannel) {
    try {
      globalChannel = supabase
        .channel('sisnets_global_realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'directorio_colegas' },
          (payload) => {
            console.log('[Realtime] Directorio actualizado en vivo:', payload.eventType);
            notifyListeners('directorio', payload);
            window.dispatchEvent(new CustomEvent('sisnets_directorio_updated', { detail: payload }));
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'usuarios' },
          (payload) => {
            console.log('[Realtime] Usuarios actualizados en vivo:', payload.eventType);
            notifyListeners('usuarios', payload);
            window.dispatchEvent(new CustomEvent('sisnets_users_updated', { detail: payload }));
          }
        );
    } catch (err) {
      console.warn('Error inicializando canal Realtime:', err);
    }
  }
  return globalChannel;
};

export const useRealtimeSync = (onUpdate) => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastSync, setLastSync] = useState(() => new Date());
  const callbackRef = useRef(onUpdate);

  useEffect(() => {
    callbackRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    let isMounted = true;
    const channel = getOrCreateChannel();

    // Registrar callback local si fue provisto
    const localHandler = (data) => {
      if (isMounted) {
        setLastSync(new Date());
        if (callbackRef.current) {
          callbackRef.current(data);
        }
      }
    };

    eventListeners.all.add(localHandler);

    // Iniciar suscripción si no está activa
    if (channel && channel.state !== 'joined' && !isSubscribing) {
      isSubscribing = true;
      channel.subscribe((status, err) => {
        isSubscribing = false;
        if (!isMounted) return;

        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] Conectado globalmente a Supabase Realtime');
          setIsConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.warn('[Realtime] Canal cerrado o error, reintentando...', err);
          setIsConnected(false);
        }
      });
    } else if (channel && channel.state === 'joined') {
      setIsConnected(true);
    }

    // Auto-refresh de respaldo cada 25 segundos (Idéntico a SIMEC Dashboard)
    const fallbackInterval = setInterval(() => {
      if (isMounted && callbackRef.current) {
        callbackRef.current({ eventType: 'POLLING_FALLBACK', table: 'both' });
        setLastSync(new Date());
      }
    }, 25000);

    return () => {
      isMounted = false;
      eventListeners.all.delete(localHandler);
      clearInterval(fallbackInterval);
    };
  }, []);

  return {
    isConnected,
    lastSync,
    subscribeDirectorio: (cb) => {
      eventListeners.directorio.add(cb);
      return () => eventListeners.directorio.delete(cb);
    },
    subscribeUsuarios: (cb) => {
      eventListeners.usuarios.add(cb);
      return () => eventListeners.usuarios.delete(cb);
    }
  };
};

export default useRealtimeSync;
