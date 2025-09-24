// src/pages/AuthPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * FRONTEND-ONLY DEMO AUTH
 * - Login, Register, Forgot password (OTP via "fake email" flow)
 * - OTP is generated and stored in localStorage with 10-min TTL and logged to console.
 *   => Thay thế bằng tích hợp email thực (EmailJS/Resend/SendGrid) ở production.
 */

const ADMIN_EMAIL = 'zeussnguyen9@gmail.com'

const LS_USERS = 'tmq_users'               // { [email]: { password, role } }
const LS_OTP = 'tmq_otp'                   // { code, email, expireAt }
const LS_SESSION = 'tmq_session'           // { email, role }

function loadUsers(){
  try{ return JSON.parse(localStorage.getItem(LS_USERS)) || {} }catch{ return {} }
}
function saveUsers(u){ localStorage.setItem(LS_USERS, JSON.stringify(u)) }

function setSession(email, role){ localStorage.setItem(LS_SESSION, JSON.stringify({email, role})) }
function clearSession(){ localStorage.removeItem(LS_SESSION) }

function setOtp(email, code, ttlMs=10*60*1000){
  const payload = { email, code, expireAt: Date.now()+ttlMs }
  localStorage.setItem(LS_OTP, JSON.stringify(payload))
  return payload
}
function getOtp(){ try{ return JSON.parse(localStorage.getItem(LS_OTP)) }catch{ return null } }
function clearOtp(){ localStorage.removeItem(LS_OTP) }

function gen6(){
  return Math.floor(100000 + Math.random()*900000).toString()
}

export default function AuthPage(){
  const nav = useNavigate()
  const [tab, setTab] = React.useState('login')

  // login fields
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPw, setLoginPw] = React.useState('')
  const [remember, setRemember] = React.useState(true)

  // register fields
  const [regEmail, setRegEmail] = React.useState('')
  const [regPw, setRegPw] = React.useState('')
  const [regPw2, setRegPw2] = React.useState('')

  // forgot/otp/reset fields
  const [fpEmail, setFpEmail] = React.useState('')
  const [otp, setOtpCode] = React.useState('')
  const [newPw, setNewPw] = React.useState('')
  const [step, setStep] = React.useState('request') // request -> verify -> reset

  const [msg, setMsg] = React.useState('')

  React.useEffect(()=>{
    // If there is a session and remember=true, redirect to dashboard
    try{
      const s = JSON.parse(localStorage.getItem(LS_SESSION))
      if(s?.email) nav('/dashboard')
    }catch{}
  },[])

  function handleLogin(e){
    e.preventDefault()
    setMsg('')
    const users = loadUsers()
    const user = users[loginEmail?.toLowerCase()?.trim()]
    if(!user){ setMsg('Tài khoản không tồn tại.'); return }
    if(user.password !== loginPw){ setMsg('Mật khẩu không đúng.'); return }
    const role = user.role || (loginEmail.toLowerCase()===ADMIN_EMAIL ? 'admin':'member')
    setSession(loginEmail, role)
    if(!remember){
      // xóa session khi đóng tab: sử dụng beforeunload để clear
      window.addEventListener('beforeunload', clearSession, { once:true })
    }
    nav('/dashboard')
  }

  function handleRegister(e){
    e.preventDefault()
    setMsg('')
    if(!regEmail || !regPw){ setMsg('Vui lòng nhập email và mật khẩu.');return }
    if(regPw !== regPw2){ setMsg('Xác nhận mật khẩu không khớp.'); return }
    const users = loadUsers()
    const key = regEmail.toLowerCase().trim()
    if(users[key]){ setMsg('Email đã tồn tại.'); return }
    users[key] = {
      password: regPw,
      role: key===ADMIN_EMAIL ? 'admin' : 'member'
    }
    saveUsers(users)
    setMsg('Đăng ký thành công. Vui lòng đăng nhập.')
    setTab('login')
    setLoginEmail(regEmail)
  }

  function handleSendOtp(e){
    e.preventDefault()
    setMsg('')
    const key = fpEmail.toLowerCase().trim()
    const users = loadUsers()
    if(!users[key]){ setMsg('Email chưa đăng ký.'); return }
    const code = gen6()
    const payload = setOtp(key, code)
    // "Gửi email": demo → log ra console
    console.log('[TOOLMONIQ OTP gửi tới email]', key, 'Mã OTP:', code, 'Hết hạn:', new Date(payload.expireAt).toLocaleString())
    alert('Đã gửi OTP (demo: kiểm tra Console để xem mã).')
    setStep('verify')
  }

  function handleVerifyOtp(e){
    e.preventDefault()
    setMsg('')
    const payload = getOtp()
    if(!payload){ setMsg('Chưa yêu cầu OTP.'); return }
    if(Date.now() > payload.expireAt){ setMsg('OTP đã hết hạn.'); return }
    if(payload.email !== fpEmail.toLowerCase().trim()){ setMsg('Email không khớp yêu cầu OTP.'); return }
    if((otp||'').trim() !== payload.code){ setMsg('OTP không đúng.'); return }
    setStep('reset')
  }

  function handleResetPw(e){
    e.preventDefault()
    setMsg('')
    const key = fpEmail.toLowerCase().trim()
    const users = loadUsers()
    if(!users[key]){ setMsg('Email chưa đăng ký.'); return }
    if(!newPw || newPw.length<4){ setMsg('Mật khẩu mới tối thiểu 4 ký tự.'); return }
    users[key].password = newPw
    saveUsers(users)
    clearOtp()
    setMsg('Cập nhật mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới.')
    setTab('login')
    setLoginEmail(fpEmail)
  }

  return (
    <div style={styles.screen}>
      <BG/>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.logo}><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></div>

          <div style={styles.tabs}>
            <button style={{...styles.tab, ...(tab==='login'?styles.active:{})}} onClick={()=>setTab('login')}>Đăng nhập</button>
            <button style={{...styles.tab, ...(tab==='register'?styles.active:{})}} onClick={()=>setTab('register')}>Đăng ký</button>
            <button style={{...styles.tab, ...(tab==='forgot'?styles.active:{})}} onClick={()=>{setTab('forgot'); setStep('request')}}>Quên mật khẩu</button>
          </div>

          {tab==='login' && (
            <form onSubmit={handleLogin} style={{display:'grid',gap:8}}>
              <input placeholder="Email" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} style={styles.input}/>
              <input placeholder="Mật khẩu" type="password" value={loginPw} onChange={e=>setLoginPw(e.target.value)} style={styles.input}/>
              <label style={{display:'flex',alignItems:'center',gap:8,fontSize:12,opacity:.85}}>
                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/>
                Ghi nhớ đăng nhập (khóa phiên khi đóng tab nếu tắt)
              </label>
              <button type="submit" style={styles.cta}>Đăng nhập</button>
            </form>
          )}

          {tab==='register' && (
            <form onSubmit={handleRegister} style={{display:'grid',gap:8}}>
              <input placeholder="Email" value={regEmail} onChange={e=>setRegEmail(e.target.value)} style={styles.input}/>
              <input placeholder="Mật khẩu" type="password" value={regPw} onChange={e=>setRegPw(e.target.value)} style={styles.input}/>
              <input placeholder="Xác nhận mật khẩu" type="password" value={regPw2} onChange={e=>setRegPw2(e.target.value)} style={styles.input}/>
              <button type="submit" style={styles.cta}>Đăng ký</button>
              <div style={{fontSize:12,opacity:.7}}>Role: <b>{regEmail?.toLowerCase()===ADMIN_EMAIL?'Admin':'Member'}</b> (tự gán dựa trên email)</div>
            </form>
          )}

          {tab==='forgot' && (
            <>
              {step==='request' && (
                <form onSubmit={handleSendOtp} style={{display:'grid',gap:8}}>
                  <input placeholder="Nhập email đã đăng ký" value={fpEmail} onChange={e=>setFpEmail(e.target.value)} style={styles.input}/>
                  <button type="submit" style={styles.cta}>Gửi OTP</button>
                </form>
              )}
              {step==='verify' && (
                <form onSubmit={handleVerifyOtp} style={{display:'grid',gap:8}}>
                  <div style={{fontSize:12,opacity:.7}}>OTP đã gửi tới email (demo: xem Console)</div>
                  <input placeholder="Nhập mã OTP 6 số" value={otp} onChange={e=>setOtpCode(e.target.value)} style={styles.input}/>
                  <button type="submit" style={styles.cta}>Xác minh OTP</button>
                </form>
              )}
              {step==='reset' && (
                <form onSubmit={handleResetPw} style={{display:'grid',gap:8}}>
                  <input placeholder="Mật khẩu mới" type="password" value={newPw} onChange={e=>setNewPw(e.target.value)} style={styles.input}/>
                  <button type="submit" style={styles.cta}>Cập nhật mật khẩu</button>
                </form>
              )}
            </>
          )}

          <div style={{minHeight:18,color:'#fca5a5',fontSize:12,marginTop:6}}>{msg}</div>
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
  card:{width:'min(100%,420px)',background:'#111827',border:'1px solid #334155',borderRadius:14,boxShadow:'0 10px 30px rgba(0,0,0,.35)',padding:16},
  logo:{display:'flex',gap:6,marginBottom:10,alignItems:'baseline'},
  tabs:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:6,marginBottom:10},
  tab:{padding:'8px 10px',borderRadius:10,border:'1px solid #334155',background:'#0f172a',color:'#cbd5e1',cursor:'pointer',fontSize:13},
  active:{background:'#6366f1',color:'#fff',border:'1px solid #6366f1'},
  input:{width:'100%',padding:'10px',borderRadius:10,background:'#0f172a',border:'1px solid #334155',color:'#e5e7eb',outline:'none',fontSize:14,boxSizing:'border-box'},
  cta:{width:'100%',padding:'10px',borderRadius:10,background:'#6366f1',border:'none',color:'#fff',cursor:'pointer',fontWeight:600,fontSize:14}
}
