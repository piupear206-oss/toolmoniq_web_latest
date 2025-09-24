import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

function showFatal(err){
  const el = document.getElementById('root')
  if(!el) return
  el.innerHTML = `
    <div class="err">
      <div style="font-weight:700;margin-bottom:6px">App crash (runtime)</div>
      <div>Hãy mở DevTools → Console để xem chi tiết. Tạm thời hiển thị lỗi tại đây:</div>
      <pre>${(err && (err.stack || err.message || String(err))) || 'Unknown error'}</pre>
    </div>
  `
}

window.addEventListener('error', e => showFatal(e.error || e.message))
window.addEventListener('unhandledrejection', e => showFatal(e.reason || 'Unhandled rejection'))

try{
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}catch(e){
  showFatal(e)
}
