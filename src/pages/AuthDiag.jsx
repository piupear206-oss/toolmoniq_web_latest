// src/pages/AuthDiag.jsx
import React from 'react'
export default function AuthDiag(){
  return (
    <div style={{minHeight:'100vh',display:'grid',placeItems:'center',background:'#0b1220'}}>
      <div style={{padding:24,border:'1px solid #334155',borderRadius:12,background:'#111827'}}>
        <h1 style={{margin:0,color:'#22d3ee'}}>Auth route OK</h1>
        <p style={{marginTop:8,color:'#94a3b8'}}>Nếu bạn nhìn thấy khối này, Router + assets đang hoạt động.</p>
      </div>
    </div>
  )
}
