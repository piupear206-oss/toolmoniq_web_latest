import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function AuthPage(){
  const nav = useNavigate()
  const [tab, setTab] = React.useState('login')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [msg, setMsg] = React.useState('')

  const onLogin = e => { e.preventDefault(); nav('/dashboard') }

  return (
    <div style={styles.screen}>
      <BG/>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.logo}><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></div>
          <div style={styles.tabs}>
            <button style={{...styles.tab, ...(tab==='login'?styles.active:{})}} onClick={()=>setTab('login')}>Đăng nhập</button>
            <button style={{...styles.tab, ...(tab==='register'?styles.active:{})}} onClick={()=>setTab('register')}>Đăng ký</button>
            <button style={{...styles.tab, ...(tab==='forgot'?styles.active:{})}} onClick={()=>setTab('forgot')}>Quên mật khẩu</button>
          </div>

          {tab==='login' && (
            <form onSubmit={onLogin} style={{display:'grid',gap:8}}>
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} style={styles.input}/>
              <input placeholder="Mật khẩu" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={styles.input}/>
              <button type="submit" style={styles.cta}>Đăng nhập</button>
            </form>
          )}

          {tab==='register' && (
            <div style={{opacity:.8,fontSize:13,marginTop:8}}>Demo UI: chuyển sang tab Đăng nhập để vào trang chính.</div>
          )}

          {tab==='forgot' && (
            <div style={{opacity:.8,fontSize:13,marginTop:8}}>Demo UI: sẽ thêm OTP email ở bản kế tiếp.</div>
          )}

          <div style={{minHeight:16,color:'#fca5a5',fontSize:12,marginTop:6}}>{msg}</div>
          <div style={{fontSize:11,opacity:.7,marginTop:8,textAlign:'center'}}>Nguồn: <b>TOOLMONIQ-ByLiamNguyen</b></div>
        </div>
      </div>
      <style>{`
        .g1{position:absolute;inset:0;filter:blur(60px);opacity:.45;pointer-events:none;
          background:radial-gradient(500px 240px at 20% 20%,rgba(139,92,246,.6),transparent 60%),
                     radial-gradient(460px 280px at 80% 70%,rgba(34,197,94,.5),transparent 60%),
                     radial-gradient(420px 200px at 50% 10%,rgba(56,189,248,.5),transparent 60%);}
        .grid{position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;pointer-events:none;}
      `}</style>
    </div>
  )
}

function BG(){
  return (<>
    <div className="g1"></div>
    <svg className="grid" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs><pattern id="p" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M10 0 L0 0 0 10" fill="none" stroke="rgba(148,163,184,.2)" strokeWidth=".5"/></pattern>
      </defs><rect width="100" height="100" fill="url(#p)"/>
    </svg>
  </>)
}

const styles = {
  screen:{minHeight:'100vh',background:'#0b1220',color:'#e5e7eb',fontFamily:'system-ui,Segoe UI,Roboto,Arial',position:'relative'},
  wrap:{minHeight:'100vh',display:'grid',placeItems:'center',padding:'12px'},
  card:{width:'min(100%,380px)',background:'#111827',border:'1px solid #334155',borderRadius:14,boxShadow:'0 10px 30px rgba(0,0,0,.35)',padding:16},
  logo:{display:'flex',gap:6,marginBottom:10,alignItems:'baseline'},
  tabs:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:10},
  tab:{padding:'8px 10px',borderRadius:10,border:'1px solid #334155',background:'#0f172a',color:'#cbd5e1',cursor:'pointer',fontSize:13},
  active:{background:'#6366f1',color:'#fff',border:'1px solid #6366f1'},
  input:{width:'100%',padding:'10px',borderRadius:10,background:'#0f172a',border:'1px solid #334155',color:'#e5e7eb',outline:'none',fontSize:14,boxSizing:'border-box'},
  cta:{width:'100%',padding:'10px',borderRadius:10,background:'#6366f1',border:'none',color:'#fff',cursor:'pointer',fontWeight:600,fontSize:14}
}
