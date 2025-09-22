
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { getSession, clearSession } from '../lib/session';

export default function Dashboard(){
  const nav = useNavigate();
  const [session, setSession] = React.useState(getSession());

  React.useEffect(()=>{
    if (!session) nav('/auth');
  }, [session]);

  if (!session) return null;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1500px] px-5 py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3 text-sm">
          <span className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-300">
            {session.role || 'Member'}
          </span>
          <button
            className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
            onClick={()=>{ clearSession(); nav('/auth'); }}>
            Đăng xuất
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-5 grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Chart rộng hơn: chiếm 3 cột */}
        <section className="xl:col-span-3 rounded-2xl border border-white/10 bg-neutral-900/40 overflow-hidden">
          <div className="p-4 text-neutral-300">Biểu đồ nến (Moniq)</div>
          <iframe
            title="Moniq Candle Chart"
            src={import.meta.env.VITE_MONIQ_CHART_URL}
            className="w-full h-[760px] bg-black"
            referrerPolicy="no-referrer"
          />
          <div className="p-3 text-[11px] text-neutral-500">
            © TOOLMONIQ — for educational use only. • Nguồn trang: <b>TOOLMONIQ-ByLiamNguyen</b>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5">
          <PredictionPanel />
        </section>
      </div>
    </main>
  );
}

function PredictionPanel(){
  const [locked, setLocked] = React.useState(null);
  const [stats, setStats] = React.useState(()=> {
    try { return JSON.parse(localStorage.getItem('moniq_stats')) || {correct:0,total:0}; } catch { return {correct:0,total:0}; }
  });
  const [countdown, setCountdown] = React.useState('—s');

  React.useEffect(()=>{
    const tick = ()=>{
      const sec = new Date().getUTCSeconds() || 60;
      const remain = 60 - sec;
      setCountdown(remain + 's');
      if (!locked && sec===1) setLocked(Math.random()>0.5?'BUY':'SELL');
      if (sec===60 && locked) {
        const up = Math.random()>0.5;
        const correct = (up && locked==='BUY') || (!up && locked==='SELL');
        const ns = { correct: stats.correct + (correct?1:0), total: stats.total + 1 };
        setStats(ns);
        try { localStorage.setItem('moniq_stats', JSON.stringify(ns)); } catch {}
        setLocked(null);
      }
      requestAnimationFrame(tick);
    };
    const id = requestAnimationFrame(tick);
    return ()=> cancelAnimationFrame(id);
  }, [locked, stats]);

  const pct = stats.total>0 ? ((stats.correct/stats.total)*100).toFixed(1) : '—';

  return (
    <div>
      <div className="mb-4">
        <div className="text-neutral-300">Dự đoán cây nến kế tiếp</div>
        <div className={`mt-2 text-3xl font-semibold ${locked==='BUY'?'text-emerald-400': locked==='SELL'?'text-rose-400':'text-amber-400'}`}>
          {locked ?? 'Đang phân tích…'}
        </div>
        <div className="mt-1 text-xs text-neutral-400">Đóng nến sau: <span className="font-mono">{countdown}</span></div>
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
