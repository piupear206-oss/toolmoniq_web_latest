import React from 'react'
export default function Dashboard(){
  return (
    <div style={{minHeight:'100vh',background:'#0b1220',color:'#e5e7eb',display:'grid',placeItems:'center',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <div style={{width:900,maxWidth:'90%',background:'#111827',border:'1px solid #334155',borderRadius:16,padding:16}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div><b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span></div>
          <a href="/auth" style={{background:'#ef4444',color:'#fff',textDecoration:'none',padding:'8px 12px',borderRadius:10}}>Đăng xuất</a>
        </div>
        <div style={{height:540,background:'#0f172a',border:'1px solid #334155',borderRadius:12,display:'grid',placeItems:'center'}}>
          <div style={{opacity:.7}}>Nhúng iframe biểu đồ bằng ENV <code>VITE_MONIQ_CHART_URL</code> sau</div>
        </div>
      </div>
    </div>
  )
}
