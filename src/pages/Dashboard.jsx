// src/pages/Dashboard.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, clearSession } from '../lib/session'
import usePredictor from '../hooks/usePredictor'

const CHART_URL = import.meta.env.VITE_MONIQ_CHART_URL || ''

export default function Dashboard(){
  const nav = useNavigate()
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(()=>{
    const s = getSession()
    if(!s?.email){ nav('/auth', { replace: true }); return }
    setMounted(true)
  },[])
  const onLogout = () => { clearSession(); nav('/auth', { replace:true }) }

  const { status, timeSec, decision, locked, score, percent } = usePredictor()

  return (
    <Screen>
      <div style={styles.layout}>
        <div style={styles.left}>
          <Header onLogout={onLogout}/>
          {CHART_URL
            ? <div style={styles.chartWrap}><iframe src={CHART_URL} title="Moniq chart" style={styles.iframe}/></div>
            : <Notice>Thiếu ENV <code>VITE_MONIQ_CHART_URL</code></Notice>}
        </div>
        <div style={styles.right}>
          <div style={styles.panel}>
            <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:6}}>
              <b style={{color:'#fff'}}>Dự đoán cây nến kế tiếp</b>
              <span style={{marginLeft:'auto',fontSize:12,opacity:.75}}>
                {status==='ready' ? `Đồng bộ: ${timeSec ?? '—'}s` : status==='connecting' ? 'Đang kết nối WS…' : 'WS lỗi (thiếu ENV?)'}
              </span>
            </div>
            <div id="ai-result" style={{
              fontSize:30,fontWeight:800,minHeight:44,
              color: decision==='BUY' ? '#34d399' : decision==='SELL' ? '#f87171' : '#22d3ee'
            }}>
              {decision || 'Đang phân tích…'}{locked && decision ? ' (cố định)' : ''}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:12}}>
              <Stat label="Đã đúng" value={score.total ? `${score.ok}/${score.total}` : '— / —'} />
              <Stat label="Tỷ lệ đúng" value={percent!=null ? `${percent}%` : '—%'} />
            </div>
            <div style={{marginTop:12,fontSize:12,opacity:.75}}>
              * Thuật toán demo: EMA(5) vs EMA(20) + momentum 5s. Có thể thay bằng logic server-side/WS.
            </div>
          </div>
        </div>
      </div>
    </Screen>
  )
}

function Header({ onLogout }){
  return (
    <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:10}}>
      <b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span>
      <span style={{marginLeft:'auto'}}>
        <button onClick={onLogout} style={styles.logout}>Đăng xuất</button>
      </span>
    </div>
  )
}

function Screen({children}){
  return (
    <div style={styles.screen}>
      <div className="g1"></div>
      <div style={styles.container}>{children}</div>
      <style>{`.g1{position:absolute;inset:0;filter:blur(70px);opacity:.35;pointer-events:none;
        background:radial-gradient(520px 240px at 20% 20%,rgba(139,92,246,.6),transparent 60%),
                 radial-gradient(480px 280px at 85% 70%,rgba(34,197,94,.45),transparent 60%),
                 radial-gradient(460px 200px at 50% 10%,rgba(56,189,248,.45),transparent 60%);}`}</style>
    </div>
  )
}

function Notice({children}){
  return <div style={{border:'1px dashed #334155',borderRadius:10,padding:14,textAlign:'center',opacity:.9}}>{children}</div>
}
function Stat({label, value}){
  return (
    <div style={{background:'#0f172a',border:'1px solid #334155',borderRadius:12,padding:'10px 12px'}}>
      <div style={{opacity:.8,fontSize:12}}>{label}</div>
      <div style={{fontSize:18,fontWeight:700}}>{value}</div>
    </div>
  )
}

const styles = {
  screen:{minHeight:'100vh',background:'#0b1220',color:'#e5e7eb',fontFamily:'system-ui,Segoe UI,Roboto,Arial',position:'relative'},
  container:{minHeight:'100vh',display:'grid',placeItems:'center',padding:'12px'},
  layout:{display:'grid',gridTemplateColumns:'minmax(0,1fr) 360px',gap:14,background:'#111827',border:'1px solid #334155',borderRadius:12,padding:16,width:'min(1200px,95vw)'},
  left:{ display:'flex', flexDirection:'column', minWidth:0 },
  right:{},
  chartWrap:{position:'relative',width:'100%',aspectRatio:'16/9',background:'#0f172a',border:'1px solid #334155',borderRadius:12,overflow:'hidden'},
  iframe:{ position:'absolute', inset:0, width:'100%', height:'100%', border:'0' },
  panel:{background:'#0f172a',border:'1px solid #334155',borderRadius:12,padding:12,position:'sticky',top:8},
  logout:{background:'#ef4444',border:'none',color:'#fff',padding:'8px 12px',borderRadius:8,cursor:'pointer'}
}
