// src/hooks/useMoniqStream.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

/**
 * Modes:
 *  - socketio (default): use VITE_MONIQ_WS_URL (e.g., wss://moniq3.com/socket.io/)
 *  - raw: use VITE_MONIQ_RAW_WS_URL (e.g., wss://moniq3.com/user/ws/ws)
 */
const MODE = (import.meta.env.VITE_MONIQ_MODE || "socketio").toLowerCase();
const IO_URL = import.meta.env.VITE_MONIQ_WS_URL || "wss://moniq3.com/socket.io/";
const RAW_URL = import.meta.env.VITE_MONIQ_RAW_WS_URL || "wss://moniq3.com/user/ws/ws";

async function fetchToken() {
  const r = await fetch("/api/moniq-token");
  if (!r.ok) throw new Error("Get token failed");
  return r.json(); // { token, expiresAt }
}

export function useMoniqStream() {
  const ioRef = useRef(null);
  const rawRef = useRef(null);
  const refreshTimer = useRef(null);

  const [status, setStatus] = useState("idle");
  const [lastError, setLastError] = useState(null);

  const connectSocketIO = async () => {
    setStatus("connecting"); setLastError(null);
    const { token, expiresAt } = await fetchToken();

    if (ioRef.current?.connected) ioRef.current.disconnect();
    const s = io(IO_URL, {
      transports: ["websocket"],
      query: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
    ioRef.current = s;

    s.on("connect", () => {
      setStatus("connected");
      if (expiresAt) {
        const ms = Math.max(5_000, expiresAt - Date.now() - 30_000);
        clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(() => connectSocketIO().catch(e => { setStatus("error"); setLastError(String(e)); }), ms);
      }
    });
    s.on("connect_error", (err) => {
      setStatus("error"); setLastError(err?.message || "connect_error");
      if (/token|auth/i.test(err?.message || "")) {
        setTimeout(() => connectSocketIO(), 1500);
      }
    });
    s.on("disconnect", (reason) => {
      if (/io server disconnect/i.test(reason) || /token|auth/i.test(reason)) {
        connectSocketIO().catch(e => { setStatus("error"); setLastError(String(e)); });
      } else {
        setStatus("disconnected");
      }
    });
  };

  const connectRaw = async () => {
    setStatus("connecting"); setLastError(null);
    const { token, expiresAt } = await fetchToken();

    const url = new URL(RAW_URL);
    url.searchParams.set("token", token);

    if (rawRef.current && rawRef.current.readyState === WebSocket.OPEN) {
      rawRef.current.close(1000, "reconnect");
    }
    const ws = new WebSocket(url.toString());
    rawRef.current = ws;

    ws.addEventListener("open", () => {
      setStatus("connected");
      if (expiresAt) {
        const ms = Math.max(5_000, expiresAt - Date.now() - 30_000);
        clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(() => connectRaw().catch(e => { setStatus("error"); setLastError(String(e)); }), ms);
      }
    });
    ws.addEventListener("error", (e) => {
      setStatus("error"); setLastError(e?.message || "ws_error");
    });
    ws.addEventListener("close", (e) => {
      if (e.code === 1006 || e.code === 4001 /* token */) {
        connectRaw().catch(err => { setStatus("error"); setLastError(String(err)); });
      } else {
        setStatus("disconnected");
      }
    });
  };

  const connect = () => MODE === "raw" ? connectRaw() : connectSocketIO();

  useEffect(() => {
    connect().catch(e => { setStatus("error"); setLastError(String(e)); });
    const onFocus = () => {
      const alive =
        MODE === "raw"
          ? rawRef.current && rawRef.current.readyState === WebSocket.OPEN
          : ioRef.current && ioRef.current.connected;
      if (!alive) connect().catch(()=>{});
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearTimeout(refreshTimer.current);
      if (ioRef.current) ioRef.current.disconnect();
      if (rawRef.current) rawRef.current.close(1000, "cleanup");
    };
  }, []);

  return {
    mode: MODE,
    socket: ioRef.current,
    ws: rawRef.current,
    status,
    lastError,
  };
}
