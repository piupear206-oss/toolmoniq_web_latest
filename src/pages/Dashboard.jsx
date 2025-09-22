// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const nav = useNavigate();
  return (
    <main style={styles.screen}>
      <Header onLogout={()=>nav('/auth')} />
      <div style={styles.container}>
        <section style={styles.chartCol}>
          <div style={styles.cardHeader}>Biểu đồ nến (Moniq)</div>
          <iframe
            title="Moniq Candle Chart"
            src={import.meta.env.VITE_MONIQ_CHART_URL}
            style={styles.iframe}
            referrerPolicy="no-referrer"
          />
          <div style={styles.footerLine}>
            © TOOLMONIQ — for educational use only. • Nguồn: <b>TOOLMONIQ-ByLiamNguyen</b>
          </div>
        </section>

        <section style={styles.sideCol}>
          <PredictionPanel />
        </section>
      </div>
    </main>
  );
}

function Header({onLogout}){
  return (
    <div style={styles.header}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span>
      </div>
      <button onClick={onLogout} style={styles.btnDanger}>Đăng xuất</button>
    </div>
  );
}

function PredictionPanel(){
  const [locked, setLocked] = React.useState(null);     // 'BUY' | 'SELL' | null
  const [stats, setStats]   = React.useState(()=>{
    try { return JSON.parse(localStorage.getItem('moniq_stats')) || {correct:0,total:0}; }
    catch { return {correct:0,total:0}; }
  });
  const [countdown, setCountdown] = React.useState('—s');

  // Đồng bộ với giây UTC để gần với tick 60s của Moniq
  React.useEffect(()=>{
    let raf;
    const loop = ()=>{
      const now = new Date();
      let sec = now.getUTCSeconds();
      if (sec === 0) sec = 60;
      const remain = 60 - sec;
      setCountdown(remain + 's');

      // Khóa dự đoán khi nến mới vừa mở (giây 1)
      if (!locked && sec === 1) {
        // TODO: thay thuật toán thật – hiện tạm thời random để UI hoạt động
        setLocked(Math.random() > 0.5 ? 'BUY' : 'SELL');
      }

      // Khi nến chuẩn bị đóng (sec === 60), chấm điểm & reset
      if (locked && sec === 60) {
        const candleClosedUp = Math.random() > 0.5; // TODO: thay bằng thực tế (dựa vào socket Moniq)
        const correct = (locked === 'BUY' && candleClosedUp) || (locked === 'SELL' && !candleClosedUp);
        const next = { correct: stats.correct + (correct ? 1 : 0), total: stats.total + 1 };
        setStats(next);
        try { localStorage.setItem('moniq_stats', JSON.stringify(next)); } catch {}
        setLocked(null);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return ()=> cancelAnimationFrame(raf);
  }, [locked, stats]);

  const pct = stats.total > 0 ? ((stats.correct / stats.total) * 100).toFixed(1) : '—';

  return (
    <div style={styles.panel}>
      <div style={{marginBottom:10, color:'#e5e7eb'}}>Dự đoán cây nến kế tiếp</div>
      <div style={{
        marginTop:6, fontSize:28, fontWeight:700,
        color: locked === 'BUY' ? '#34d399' : locked === 'SELL' ? '#fb7185' : '#fbbf24'
      }}>
        {locked ?? 'Đang phân tích…'}
      </div>
      <div style={{marginTop:6, fontSize:12, color:'#94a3b8'}}>
        Đóng nến sau: <span style={{fontFamily:'ui-monospace,monospace'}}>{countdown}</span>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10, marginTop:16}}>
        <KPI label="Đã đúng" value={`${stats.correct}/${stats.total}`} />
        <KPI label="Tỷ lệ đúng" value={`${pct}%`} />
      </div>

      <div style={{fontSize:12, color:'#64748b', marginTop:16, lineHeight:1.5}}>
        <b>Lưu ý:</b> Phần dự đoán đang dùng mô phỏng để kiểm tra UI. Để kết nối dữ liệu thật của Moniq,
        bạn cần gắn socket và thuật toán chấm điểm thực tế (mình sẽ gửi pack riêng khi bạn xác nhận phần hiển thị OK).
      </div>
    </div>
  );
}

function KPI({label, value}){
  return (
    <div style={{background:'#0f172a', border:'1px solid #334155', borderRadius:12, padding:12}}>
      <div style={{fontSize:12, color:'#94a3b8'}}>{label}</div>
      <div style={{fontSize:18, color:'#e5e7eb'}}>{value}</div>
    </div>
  );
}

const styles = {
  screen: { minHeight:'100vh', background:'#0b1220', color:'#e5e7eb',
            fontFamily:'system-ui,Segoe UI,Roboto,Arial' },
  header: { maxWidth:1500, margin:'0 auto', padding:'16px 20px',
            display:'flex', justifyContent:'space-between', alignItems:'center' },
  btnDanger: { background:'#ef4444', color:'#fff', border:'none', borderRadius:10, padding:'8px 12px', cursor:'pointer' },
  container: { maxWidth:1500, margin:'0 auto', padding:'0 20px 24px',
               display:'grid', gridTemplateColumns:'3fr 1fr', gap:16 },
  chartCol: { background:'#111827', border:'1px solid #334155', borderRadius:16, overflow:'hidden' },
  sideCol: { background:'#111827', border:'1px solid #334155', borderRadius:16, padding:16, minHeight:200 },
  cardHeader: { padding:12, borderBottom:'1px solid #334155', color:'#cbd5e1' },
  iframe: { width:'100%', height:700, border:'0', display:'block', background:'#000' },
  footerLine: { padding:10, fontSize:12, color:'#94a3b8', borderTop:'1px solid #334155' },
  panel: { }
};
