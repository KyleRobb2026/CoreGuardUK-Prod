import { useState, useEffect, useRef, useCallback } from 'react';

const WS_BASE = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/^https/, 'wss').replace(/^http/, 'ws')
  : '';

export function useRealtimeAlerts(orgId) {
  const [alerts, setAlerts] = useState([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);
  const retryCount = useRef(0);

  const connect = useCallback(() => {
    if (!orgId || !WS_BASE) return;
    const url = `${WS_BASE}/api/ws/${orgId}`;
    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        retryCount.current = 0;
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current);
          reconnectTimer.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'ping' || data.type === 'connected') return;
          if (data.type === 'alert' || data.type === 'check_call_missed') {
            setAlerts(prev => [
              { id: Date.now(), ...data },
              ...prev.slice(0, 19),
            ]);
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onerror = () => {
        setConnected(false);
      };

      ws.onclose = () => {
        setConnected(false);
        const delay = Math.min(5000 * Math.pow(1.5, retryCount.current), 30000);
        retryCount.current += 1;
        reconnectTimer.current = setTimeout(connect, delay);
      };
    } catch (e) {
      // ignore connection errors
    }
  }, [orgId]);

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  }, []);

  const clearAll = useCallback(() => setAlerts([]), []);

  return { alerts, connected, dismissAlert, clearAll };
}
