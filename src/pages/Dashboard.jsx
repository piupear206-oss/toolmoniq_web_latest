// src/pages/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard(){
  const nav = useNavigate();
  return (
    <main style={{minHeight:'100vh',background:'#0b1220',display:'grid',placeItems:'center',color:'#e5e7eb',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <div style={{width:960,background:'#111827',border:'1px solid #334155',borderRadius:16,padding:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2 style={{margin:0}}><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></h2>
          <button onClick={()=>nav('/auth')} style={{padding:'6px 10px',borderRadius:10,background:'#ef4444',border:'none',color:'#fff'}}>Đăng xuất (demo)</button>
        </div>
        <div style={{marginTop:12,padding:18,background:'#0f172a',border:'1px solid #334155',borderRadius:12}}>
          <div style={{fontSize:18,color:'#a78bfa'}}>Dashboard shell OK</div>
          <div style={{fontSize:13,opacity:.7,marginTop:6}}>Trang chính đang render bình thường. Hãy thay iframe biểu đồ & panel dự đoán vào đây.</div>
        </div>
      </div>
    </main>
  );
}
