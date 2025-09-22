// src/pages/AuthPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthPage(){
  const nav = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function demoLogin(e){
    e.preventDefault();
    nav('/dashboard'); // demo: chuyển sang trang dashboard
  }

  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#0b1220',color:'#e5e7eb',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <form onSubmit={demoLogin} style={{width:360,background:'#111827',border:'1px solid #334155',borderRadius:14,padding:18}}>
        <h2 style={{margin:'4px 0 10px',fontSize:20}}><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></h2>
        <div style={{fontSize:12,opacity:.7,marginBottom:12}}>Đăng nhập (demo hiển thị)</div>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email"
               style={{width:'100%',padding:'9px 10px',borderRadius:10,background:'#0f172a',border:'1px solid #334155',color:'#e5e7eb',marginBottom:10}}/>
        <input value={password} type="password" onChange={e=>setPassword(e.target.value)} placeholder="Mật khẩu"
               style={{width:'100%',padding:'9px 10px',borderRadius:10,background:'#0f172a',border:'1px solid #334155',color:'#e5e7eb',marginBottom:12}}/>
        <button type="submit" style={{width:'100%',padding:'9px 10px',borderRadius:10,background:'#6366f1',border:'none',color:'#fff'}}>Vào trang chính (demo)</button>
        <div style={{fontSize:11,opacity:.6,marginTop:10,textAlign:'center'}}>Nguồn: <b>TOOLMONIQ-ByLiamNguyen</b></div>
      </form>
    </div>
  );
}
