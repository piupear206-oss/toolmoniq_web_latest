import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
function Diagnostics(){ return <div className="err">App route OK — nếu bạn thấy trang này, router vẫn chạy. Đi tới <a href="/auth">/auth</a>.</div> }
export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Diagnostics/>} />
        <Route path="/auth" element={<div className="err">Auth route OK — render trang AuthPage.jsx của bạn tại đây.</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
