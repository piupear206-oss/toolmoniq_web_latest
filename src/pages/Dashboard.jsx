import React from 'react'

export default function Dashboard(){
  return (
    <div style={{minHeight:'100vh',background:'#0b1220',color:'#e5e7eb',display:'grid',placeItems:'center',fontFamily:'system-ui,Segoe UI,Roboto,Arial'}}>
      <div style={{background:'#111827',border:'1px solid #334155',borderRadius:12,padding:16,maxWidth:920,width:'92%'}}>
        <div style={{display:'flex',alignItems:'baseline',gap:6,marginBottom:8}}>
          <b style={{color:'#fff'}}>TOOL</b><span style={{color:'#a78bfa'}}>MONIQ</span>
          <span style={{marginLeft:'auto'}}>
            <button onClick={()=>{ localStorage.removeItem('tmq_session'); location.href='/auth' }} style={{background:'#ef4444',border:'none',color:'#fff',padding:'8px 12px',borderRadius:8,cursor:'pointer'}}>Đăng xuất</button>
          </span>
        </div>
        <div style={{border:'1px dashed #334155',borderRadius:10,padding:14,textAlign:'center',opacity:.9}}>
          Nhúng biểu đồ Moniq bằng ENV <code>VITE_MONIQ_CHART_URL</code> sau.<br/>
          (Tạm thời là shell để đảm bảo routing hoạt động.)
        </div>
      </div>
    </div>
  )
}
