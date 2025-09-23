// src/pages/AuthPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage(){
  const nav = useNavigate();
  const [tab, setTab] = React.useState('login'); // login | register | forgot
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [otpEmail, setOtpEmail] = React.useState('');
  const [otp, setOtp] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [msg, setMsg] = React.useState('');

  const onLogin = (e)=>{ e.preventDefault(); nav('/dashboard'); };
  const onRegister = (e)=>{ e.preventDefault(); setMsg('Đăng ký (demo) thành công. Hãy đăng nhập.'); setTab('login'); };
  const onSendOtp = ()=> setMsg('Đã gửi OTP (demo).');
  const onResetPwd = (e)=>{ e.preventDefault(); setMsg('Đã cập nhật mật khẩu (demo). Hãy đăng nhập.'); setTab('login'); };

  return (
    <div style={styles.screen}>
      <BackgroundFX />
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <div style={styles.inner}>
            <div style={styles.logoRow}>
              <span style={styles.logoBold}>TOOL</span>
              <span style={styles.logoLite}>MONIQ</span>
            </div>

            <div style={styles.tabs}>
              <button onClick={()=>setTab('login')}    style={{...styles.tabBtn, ...(tab==='login'?styles.tabActive:{} )}}>Đăng nhập</button>
              <button onClick={()=>setTab('register')} style={{...styles.tabBtn, ...(tab==='register'?styles.tabActive:{} )}}>Đăng ký</button>
              <button onClick={()=>setTab('forgot')}   style={{...styles.tabBtn, ...(tab==='forgot'?styles.tabActive:{} )}}>Quên mật khẩu</button>
            </div>

            {tab==='login' && (
              <form onSubmit={onLogin} style={styles.form}>
                <Input value={email} setValue={setEmail} placeholder="Email" />
                <Input value={password} setValue={setPassword} placeholder="Mật khẩu" type="password" />
                <button type="submit" style={styles.cta}>Đăng nhập</button>
              </form>
            )}

            {tab==='register' && (
              <form onSubmit={onRegister} style={styles.form}>
                <Input value={email} setValue={setEmail} placeholder="Email" />
                <Input value={password} setValue={setPassword} placeholder="Mật khẩu (≥6 ký tự)" type="password" />
                <button type="submit" style={styles.cta}>Đăng ký</button>
              </form>
            )}

            {tab==='forgot' && (
              <form onSubmit={onResetPwd} style={styles.form}>
                <Input value={otpEmail} setValue={setOtpEmail} placeholder="Email cần khôi phục" />
                <div style={{display:'flex',gap:10}}>
                  <button type="button" onClick={onSendOtp} style={{...styles.cta,flex:1}}>Gửi OTP</button>
                </div>
                <Input value={otp} setValue={setOtp} placeholder="Mã OTP" />
                <Input value={newPwd} setValue={setNewPwd} placeholder="Mật khẩu mới (≥6 ký tự)" type="password" />
                <button type="submit" style={styles.cta}>Cập nhật mật khẩu</button>
              </form>
            )}

            <div style={styles.msg}>{msg}</div>
            <div style={styles.footer}>Nguồn: <b>TOOLMONIQ-ByLiamNguyen</b></div>
          </div>
        </div>
      </div>
      <StyleTag />
    </div>
  );
}

function Input({value, setValue, placeholder, type='text'}){
  return (
    <input
      value={value}
      onChange={e=>setValue(e.target.value)}
      placeholder={placeholder}
      type={type}
      style={styles.input}
    />
  );
}

function BackgroundFX(){
  return (
    <>
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>
      <svg className="gridfx" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="tinyGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(148,163,184,.2)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#tinyGrid)" />
      </svg>
    </>
  )
}

function StyleTag(){
  return (
    <style>{`
      .glow { position:absolute; inset:0; filter:blur(60px); opacity:.45; pointer-events:none;
        background: radial-gradient(600px 250px at 20% 20%, rgba(139,92,246,.6), transparent 60%),
                    radial-gradient(500px 300px at 80% 70%, rgba(34,197,94,.5), transparent 60%),
                    radial-gradient(400px 200px at 50% 10%, rgba(56,189,248,.5), transparent 60%);
        animation: float 18s ease-in-out infinite; }
      .glow-2 { animation-duration:22s; transform:scale(1.05); }
      @keyframes float { 0%{transform:translateY(0) translateX(0) scale(1)} 50%{transform:translateY(-12px) translateX(6px) scale(1.02)} 100%{transform:translateY(0) translateX(0) scale(1)} }
      .gridfx { position:absolute; inset:0; opacity:.18; mix-blend-mode:overlay; pointer-events:none; }
    `}</style>
  );
}

const CARD_WIDTH = 440;
const styles = {
  screen: { minHeight:'100vh', background:'#0b1220', color:'#e5e7eb', position:'relative',
            fontFamily:'system-ui,Segoe UI,Roboto,Arial' },
  wrapper: { minHeight:'100vh', display:'grid', placeItems:'center', position:'relative', padding:'16px' },
  card: { width: 'min(100%, '+str(CARD_WIDTH)+'px)', background:'#111827', border:'1px solid #334155',
          borderRadius:16, boxShadow:'0 10px 30px rgba(0,0,0,.35)', overflow:'hidden' },
  inner: { padding:'20px', boxSizing:'border-box' },
  logoRow: { display:'flex', alignItems:'baseline', gap:6, marginBottom:14 },
  logoBold: { color:'#fff', fontWeight:800, fontSize:22, letterSpacing:.5 },
  logoLite: { color:'#a78bfa', fontWeight:700, fontSize:22 },
  tabs: { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, marginBottom:14 },
  tabBtn: { padding:'10px 12px', borderRadius:10, border:'1px solid #334155',
            background:'#0f172a', color:'#cbd5e1', cursor:'pointer', width:'100%' },
  tabActive: { background:'#6366f1', color:'#fff', border:'1px solid #6366f1' },
  form: { display:'grid', gap:10 },
  input: { width:'100%', padding:'12px', borderRadius:10, background:'#0f172a',
           border:'1px solid #334155', color:'#e5e7eb', outline:'none', fontSize:14,
           boxSizing:'border-box' },
  cta: { width:'100%', padding:'12px', borderRadius:10, background:'#6366f1', border:'none',
         color:'#fff', cursor:'pointer', fontWeight:600, marginTop:2, boxSizing:'border-box' },
  msg: { minHeight:18, marginTop:8, fontSize:12, color:'#fca5a5' },
  footer: { fontSize:11, opacity:.7, marginTop:10, textAlign:'center' }
};
