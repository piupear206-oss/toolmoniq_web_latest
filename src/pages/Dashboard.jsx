
import React from 'react';
import Logo from '../components/Logo.jsx';

const MONIQ_CHART_URL = import.meta.env.VITE_MONIQ_CHART_URL;

// ====== CONFIG ======
// Mặc định 60s/nến. Có thể override bằng VITE_MONIQ_INTERVAL_SEC nếu Moniq dùng TF khác.
const TF_SEC = Number(import.meta.env.VITE_MONIQ_INTERVAL_SEC || 60);

// Lấy giờ server Binance để tránh lệch clock máy người dùng (~50-500ms hoặc hơn)
async function getServerDriftMs() {
  try {
    const r = await fetch('https://fapi.binance.com/fapi/v1/time', { cache: 'no-store' });
    const { serverTime } = await r.json();
    return serverTime - Date.now();
  } catch {
    return 0;
  }
}
const sleep = (ms) => new Promise(res => setTimeout(res, ms));

export default function Dashboard() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Logo />
        <div className="text-xs text-neutral-400">Admin</div>
      </div>

      <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <section className="md:col-span-3 rounded-2xl border border-white/10 bg-neutral-900/40 overflow-hidden">
          <div className="p-4 text-neutral-300">Biểu đồ nến (Moniq)</div>
          <iframe
            title="Moniq Candle Chart"
            src={MONIQ_CHART_URL}
            className="w-full h-[640px] bg-black"
            referrerPolicy="no-referrer"
          />
          <div className="p-3 text-[11px] text-neutral-500">© TOOLMONIQ — for educational use only.</div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <SignalBox />
        </section>
      </div>
    </main>
  );
}

function SignalBox() {
  const [locked, setLocked] = React.useState(null); // 'BUY' | 'SELL' | null
  const [stats, setStats] = React.useState(()=> loadStats());
  const [countdown, setCountdown] = React.useState('—s');

  // lưu open/close của nến đang chạy để chấm điểm khi nến đóng
  const curRef = React.useRef({ open: 0, close: 0, id: null });
  const driftRef = React.useRef(0);

  React.useEffect(()=>{
    let alive = true;
    (async () => {
      driftRef.current = await getServerDriftMs(); // đồng bộ time
      const TF_MS = TF_SEC * 1000;

      const nowMs = () => Date.now() + driftRef.current;
      const curId = () => Math.floor(nowMs() / TF_MS);
      const nextBoundaryMs = () => (curId()+1) * TF_MS;

      // đồng bộ tới biên nến kế tiếp để prediction khớp biểu đồ
      const alignAndLoop = async () => {
        while (alive) {
          // 1) nếu chưa có dự đoán cho nến hiện tại -> sinh dự đoán (cố định đến khi đóng nến)
          if (!locked) {
            const p = await getMoniqPrediction();
            setLocked(p);
          }
          // 2) countdown tới thời điểm đóng nến
          const waitMs = Math.max(50, nextBoundaryMs() - nowMs());
          setCountdown((waitMs/1000).toFixed(0) + 's');
          await sleep(Math.min(waitMs, 1000)); // cập nhật countdown mỗi <=1s

          // 3) nếu đến biên -> chấm điểm nến vừa đóng, reset và lặp
          if (nextBoundaryMs() - nowMs() <= 200) {
            // cập nhật close mới nhất của nến vừa đóng
            const last = await getMoniqCandleState();
            curRef.current = { open: last.open, close: last.close, id: curId() };
            if (locked) {
              const up = curRef.current.close >= curRef.current.open;
              const correct = (up && locked==='BUY') || (!up && locked==='SELL');
              const ns = { correct: stats.correct + (correct?1:0), total: stats.total + 1 };
              setStats(ns); saveStats(ns);
            }
            setLocked(null); // chuẩn bị dự đoán cho nến mới
          }
        }
      };
      alignAndLoop();
    })();
    return ()=>{ alive = false; };
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
        <div className="mt-2 text-xs text-neutral-500">
          *Dự đoán luôn được “khóa” cho tới khi nến hiện tại đóng, thời gian đồng bộ theo server Binance.
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Kpi label="Đã đúng" value={`${stats.correct}/${stats.total}`} />
        <Kpi label="Tỷ lệ đúng" value={`${pct}%`} />
      </div>
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

// ===== Local stats =====
function loadStats(){
  try { return JSON.parse(localStorage.getItem('moniq_stats')) || {correct:0,total:0}; }
  catch { return {correct:0,total:0}; }
}
function saveStats(s){
  try { localStorage.setItem('moniq_stats', JSON.stringify(s)); } catch {}
}

// ===== MOCK APIs — thay bằng feed Moniq =====
// Ở đây chỉ dùng để demo OHLC hiện tại; khi nối WS/REST thật, trả về OHLC của nến đang chạy.
let _t0 = Date.now();
function mockCandle(){
  const elapsed = (Date.now() - _t0)/1000;
  const tf = TF_SEC;
  const slot = Math.floor(elapsed/tf);
  const within = elapsed - slot*tf;
  const open = 100 + slot;
  const close = open + Math.sin((within/tf)*Math.PI*2)*0.5;
  return {open, close, id:slot};
}
export async function getMoniqCandleState(){ return mockCandle(); }
export async function getMoniqPrediction(){ return Math.random()>0.5 ? 'BUY' : 'SELL'; }
