import React from 'react';
import Logo from '../components/Logo.jsx';

const MONIQ_CHART_URL = import.meta.env.VITE_MONIQ_CHART_URL;

export default function Dashboard() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-5 py-4 flex items-center justify-between">
        <Logo />
        <div className="text-xs text-neutral-400">Admin</div>
      </div>

      <div className="mx-auto max-w-7xl px-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="md:col-span-2 rounded-2xl border border-white/10 bg-neutral-900/40 overflow-hidden">
          <div className="p-4 text-neutral-300">Biểu đồ nến (Moniq)</div>
          <iframe
            title="Moniq Candle Chart"
            src={MONIQ_CHART_URL}
            className="w-full h-[520px] bg-black"
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
  const [candle, setCandle] = React.useState({ open:0, close:0, isClosed:false, id:null });

  React.useEffect(()=>{
    const t = setInterval(async ()=>{
      const c = await getMoniqCandleState();
      setCandle(c);
      if (!locked) {
        const p = await getMoniqPrediction();
        setLocked(p);
      }
      if (c.isClosed && locked) {
        const up = c.close >= c.open;
        const correct = (up && locked==='BUY') || (!up && locked==='SELL');
        const ns = { correct: stats.correct + (correct?1:0), total: stats.total + 1 };
        setStats(ns); saveStats(ns);
        setLocked(null);
      }
    }, 2000);
    return ()=>clearInterval(t);
  }, [locked, stats]);

  const pct = stats.total>0 ? ((stats.correct/stats.total)*100).toFixed(1) : '—';

  return (
    <div>
      <div className="mb-4">
        <div className="text-neutral-300">Dự đoán cây nến kế tiếp</div>
        <div className={`mt-2 text-3xl font-semibold ${locked==='BUY'?'text-emerald-400':'text-rose-400'}`}>
          {locked ?? 'Đang phân tích…'}
        </div>
        <div className="mt-2 text-xs text-neutral-500">
          *Kết quả dự đoán sẽ được cố định cho đến khi cây nến hiện tại đóng.
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
let _t0 = Date.now();
function mockCandle(){
  const elapsed = (Date.now() - _t0)/1000;
  const slot = Math.floor(elapsed/10);
  const within = elapsed - slot*10;
  const open = 100 + slot;
  const close = open + (within<9 ? Math.sin(within)*0.5 : (Math.random()<0.5?-0.5:0.5));
  const isClosed = within>=9.5;
  return {open, close, isClosed, id:slot};
}
async function getMoniqCandleState(){ return mockCandle(); }
async function getMoniqPrediction(){ return Math.random()>0.5 ? 'BUY' : 'SELL'; }
