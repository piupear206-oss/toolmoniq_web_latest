
import React from 'react';
import Logo from '../components/Logo.jsx';

const WS_BASE = (import.meta.env.VITE_MONIQ_WS_URL || '').replace(/\/?$/, '/');
const WS_TOKEN = import.meta.env.VITE_MONIQ_WS_TOKEN || '';
const sleep = (ms) => new Promise(r=>setTimeout(r,ms));

function buildSIOUrl() {
  let u = WS_BASE + '?EIO=4&transport=websocket';
  if (WS_TOKEN) u = WS_BASE + `?token=${encodeURIComponent(WS_TOKEN)}&EIO=4&transport=websocket`;
  return u;
}
function parseSioEvent(d){
  if (typeof d !== 'string' || !d.startsWith('42')) return null;
  try { const [ev, payload] = JSON.parse(d.slice(2)); return {ev, payload}; }
  catch { return null; }
}

export default function Dashboard(){
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Logo />
        <div className="text-xs text-neutral-400">Admin</div>
      </div>

      <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <section className="md:col-span-3 rounded-2xl border border-white/10 bg-neutral-900/40 overflow-hidden">
          <div className="p-4 text-neutral-300">Biểu đồ nến (Moniq)</div>
          <iframe title="Moniq Candle Chart" src={import.meta.env.VITE_MONIQ_CHART_URL}
                  className="w-full h-[640px] bg-black" referrerPolicy="no-referrer"/>
          <div className="p-3 text-[11px] text-neutral-500">© TOOLMONIQ — for educational use only.</div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <SignalBox />
        </section>
      </div>
    </main>
  );
}

function SignalBox(){
  const [locked, setLocked] = React.useState(null);       // 'BUY' | 'SELL'
  const [stats, setStats] = React.useState(()=>loadStats());
  const [countdown, setCountdown] = React.useState('—s');
  const [dbg, setDbg] = React.useState('WS: connecting…');

  // Dựng OHLC theo id từ stream "BTCUSDT"
  const curIdRef = React.useRef(null);
  const ohlcRef = React.useRef({}); // id -> {o,h,l,c}
  const lastScoredIdRef = React.useRef(null);
  const prevTimeRef = React.useRef(null);

  React.useEffect(()=> {
    let ws;
    (async () => {
      const url = buildSIOUrl();
      ws = new WebSocket(url);
      ws.addEventListener('open', ()=> setDbg(d=>d+ '\\nWS open'));
      ws.addEventListener('close', ()=> setDbg(d=>d+ '\\nWS closed'));

      ws.addEventListener('message', ev => {
        const pkt = parseSioEvent(ev.data);
        if (!pkt) return;
        const { ev: event, payload } = pkt;

        // TIME event đếm 1..60 rồi quay về 1 (ảnh bạn chụp có TIME,60)
        if (event === 'TIME') {
          const t = Number(payload);
          if (Number.isFinite(t)) {
            const remain = Math.max(0, 60 - t);
            setCountdown(remain + 's');

            // Nếu TIME vừa chạm 60 → NẾN CŨ ĐÓNG. Chấm điểm ngay tại đây.
            if (t === 60 && prevTimeRef.current !== 60) {
              scoreCurrentAndReset();
            }
            // Nếu TIME quay về 1 → bắt đầu nến mới: khoá dự đoán nếu chưa có.
            if (t === 1 && prevTimeRef.current === 60 && !locked) {
              setLocked(Math.random()>0.5 ? 'BUY':'SELL'); // TODO: thay bằng model thật
            }

            prevTimeRef.current = t;
          }
          return;
        }

        // Kênh symbol: 'BTCUSDT' → có { id, close }
        if (/^[A-Z]+USDT$/.test(event) && payload && typeof payload === 'object') {
          const id = Number(payload.id);
          const px = Number(payload.close ?? payload.price ?? payload.c);
          if (!Number.isFinite(id) || !Number.isFinite(px)) return;

          // id thay đổi → nến đã sang id mới; mở record mới nếu chưa có
          if (curIdRef.current === null || id !== curIdRef.current) {
            curIdRef.current = id;
            if (!ohlcRef.current[id]) {
              ohlcRef.current[id] = { o: px, h: px, l: px, c: px };
            }
          } else {
            const k = ohlcRef.current[id] || (ohlcRef.current[id] = { o: px, h: px, l: px, c: px });
            if (px > k.h) k.h = px;
            if (px < k.l) k.l = px;
            k.c = px;
          }
          return;
        }

        // LAST_RESULTS: tham khảo
        if (event === 'LAST_RESULTS') {
          setDbg(d => d + '\\nLAST_RESULTS len=' + (payload?.length ?? 0));
          return;
        }
      });

      function scoreCurrentAndReset(){
        const id = curIdRef.current;
        if (id == null || id === lastScoredIdRef.current) return;
        const k = ohlcRef.current[id];
        if (!k || !locked) return;
        const up = k.c >= k.o;
        const correct = (up && locked==='BUY') || (!up && locked==='SELL');
        const ns = { correct: stats.correct + (correct?1:0), total: stats.total + 1 };
        setStats(ns); saveStats(ns);
        lastScoredIdRef.current = id;
        setLocked(null);
      }
    })();

    return ()=>{ try{ ws && ws.close(); }catch{} };
  }, [locked, stats]);

  const pct = stats.total>0 ? ((stats.correct/stats.total)*100).toFixed(1) : '—';

  return (
    <div>
      <div className="mb-4">
        <div className="text-neutral-300">Dự đoán cây nến kế tiếp</div>
        <div className={`mt-2 text-3xl font-semibold ${locked==='BUY'?'text-emerald-400':'text-rose-400'}`}>
          {locked ?? 'Đang phân tích…'}
        </div>
        <div className="mt-1 text-xs text-neutral-400">Đóng nến sau: <span className="font-mono">{countdown}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Đã đúng" value={`${stats.correct}/${stats.total}`} />
        <Kpi label="Tỷ lệ đúng" value={`${pct}%`} />
      </div>

      <pre className="mt-4 text-[10px] whitespace-pre-wrap text-neutral-400/70">{dbg}</pre>
    </div>
  );
}

function Kpi({label, value}) {
  return (
    <div className="rounded-xl bg-neutral-800/40 p-3">
      <div className="text-xs text-neutral-400">{label}</div>
      <div className="text-lg text-neutral-100">{value}</div>
    </div>
  );
}

function loadStats(){
  try { return JSON.parse(localStorage.getItem('moniq_stats')) || {correct:0,total:0}; }
  catch { return {correct:0,total:0}; }
}
function saveStats(s){
  try { localStorage.setItem('moniq_stats', JSON.stringify(s)); } catch {}
}
