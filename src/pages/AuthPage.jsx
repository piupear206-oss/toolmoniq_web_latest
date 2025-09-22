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

  const onLogin = (e)=>{
    e.preventDefault();
    setMsg('Đăng nhập (demo): sẽ điều hướng vào trang chính.');
    nav('/dashboard');
  };
  const onRegister = (e)=>{
    e.preventDefault();
    setMsg('Đăng ký (demo): hãy chuyển sang tab Đăng nhập để vào trang.');
    setTab('login');
  };
  const onSendOtp = ()=>{
    setMsg('Đã gửi OTP (demo).');
  };
  const onResetPwd = (e)=>{
    e.preventDefault();
    setMsg('Cập nhật mật khẩu (demo): hãy đăng nhập với mật khẩu mới.');
    setTab('login');
  };

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#0b1220',color:'#e5e7eb',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <div style={{width:380,background:'#111827',border:'1px solid #334155',borderRadius:14,padding:18}}>
        <h2 style={{margin:'4px 0 14px',fontSize:22}}><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></h2>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12}}>
          <button onClick={()=>setTab('login')}  style={btn(tab==='login')}>Đăng nhập</button>
          <button onClick={()=>setTab('register')} style={btn(tab==='register')}>Đăng ký</button>
          <button onClick={()=>setTab('forgot')} style={btn(tab==='forgot')}>Quên mật khẩu</button>
        </div>

        {tab==='login' && (
          <form onSubmit={onLogin}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
              style={inp}/>
            <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu"
              style={inp}/>
            <button type="submit" style={cta}>Đăng nhập</button>
          </form>
        )}

        {tab==='register' && (
          <form onSubmit={onRegister}>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
              style={inp}/>
            <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu (≥6 ký tự)"
              style={inp}/>
            <button type="submit" style={cta}>Đăng ký</button>
          </form>
        )}

        {tab==='forgot' && (
          <form onSubmit={onResetPwd}>
            <input value={otpEmail} onChange={e=>setOtpEmail(e.target.value)} placeholder="Email cần khôi phục"
              style={inp}/>
            <div style={{display:'flex',gap:8,marginBottom:10}}>
              <button type="button" onClick={onSendOtp} style={{...cta,flex:1}}>Gửi OTP</button>
            </div>
            <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Mã OTP" style={inp}/>
            <input value={newPwd} type="password" onChange={e=>setNewPwd(e.target.value)} placeholder="Mật khẩu mới (≥6 ký tự)"
              style={inp}/>
            <button type="submit" style={cta}>Cập nhật mật khẩu</button>
          </form>
        )}

        <div style={{minHeight:18,marginTop:8,fontSize:12,color:'#fca5a5'}}>{msg}</div>
        <div style={{fontSize:11,opacity:.6,marginTop:10,textAlign:'center'}}>Nguồn: <b>TOOLMONIQ-ByLiamNguyen</b></div>
      </div>
    </div>
  );
}

const inp = {
  width:'100%',padding:'10px 12px',borderRadius:10,
  background:'#0f172a',border:'1px solid #334155',color:'#e5e7eb',
  marginBottom:10
};
const cta = {
  width:'100%',padding:'10px 12px',borderRadius:10,
  background:'#6366f1',border:'none',color:'#fff',cursor:'pointer'
};
function btn(active){
  return {
    padding:'8px 12px',borderRadius:10,cursor:'pointer',
    background: active ? '#6366f1' : '#0f172a',
    color: active ? '#fff' : '#cbd5e1',
    border:'1px solid #334155'
  };
}
