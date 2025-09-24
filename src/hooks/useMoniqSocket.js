// src/hooks/useMoniqSocket.js
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const WS_URL = import.meta.env.VITE_MONIQ_WS_URL || "wss://moniq3.com/socket.io/";

async function fetchToken() {
  const r = await fetch("/api/moniq-token");
  if (!r.ok) throw new Error("Get token failed");
  return r.json(); // { token, expiresAt }
}

export function useMoniqSocket() {
  const socketRef = useRef(null);
  const refreshTimer = useRef(null);

  const [status, setStatus] = useState("idle");      // idle|connecting|connected|error
  const [lastError, setLastError] = useState(null);

  const connectWithToken = async () => {
    setStatus("connecting");
    setLastError(null);

    const { token, expiresAt } = await fetchToken();

    if (socketRef.current?.connected) socketRef.current.disconnect();

    const s = io(WS_URL, {
      transports: ["websocket"],
      query: { token },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000,
    });
    socketRef.current = s;

    s.on("connect", () => {
      setStatus("connected");
      if (expiresAt) {
        const ms = Math.max(5_000, expiresAt - Date.now() - 30_000);
        clearTimeout(refreshTimer.current);
        refreshTimer.current = setTimeout(async () => {
          try {
            await connectWithToken();
          } catch (e) {
            setStatus("error"); setLastError(String(e));
          }
        }, ms);
      }
    });

    s.on("connect_error", (err) => {
      setStatus("error");
      setLastError(err?.message || "connect_error");
      if (/token|auth/i.test(err?.message || "")) {
        setTimeout(() => connectWithToken(), 1500);
      }
    });

    s.on("disconnect", (reason) => {
      if (/io server disconnect/i.test(reason) || /token|auth/i.test(reason)) {
        connectWithToken().catch((e)=>{ setStatus("error"); setLastError(String(e)); });
      }
    });
  };

  useEffect(() => {
    connectWithToken().catch((e)=>{ setStatus("error"); setLastError(String(e)); });
    const onFocus = () => {
      if (!socketRef.current?.connected) {
        connectWithToken().catch(()=>{});
      }
    };
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      clearTimeout(refreshTimer.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  return { socket: socketRef.current, status, lastError };
}
