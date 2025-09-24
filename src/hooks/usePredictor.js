// src/hooks/usePredictor.js
import { useEffect, useRef, useState } from 'react'
import io from 'socket.io-client'

function ema(arr, period){
  const k = 2/(period+1)
  let emaPrev = arr[0]
  for(let i=1;i<arr.length;i++) emaPrev = arr[i]*k + emaPrev*(1-k)
  return emaPrev
}

export default function usePredictor(){
  const [status, setStatus] = useState('connecting')
  const [timeSec, setTimeSec] = useState(null)
  const [decision, setDecision] = useState(null)
  const [locked, setLocked] = useState(false)
  const [score, setScore] = useState({ ok: 0, total: 0 })
  const closes = useRef([])

  useEffect(()=>{
    const WS_URL = import.meta.env.VITE_MONIQ_WS_URL
    const TOKEN = import.meta.env.VITE_MONIQ_TOKEN
    if(!WS_URL || !TOKEN){
      setStatus('error')
      console.warn('[Predictor] Missing ENV VITE_MONIQ_WS_URL or VITE_MONIQ_TOKEN')
      return
    }
    const url = WS_URL.replace(/\/$/, '') + '/?token=' + encodeURIComponent(TOKEN)
    const socket = io(url, { transports: ['websocket'] })

    socket.on('connect', ()=> setStatus('ready'))
    socket.on('connect_error', err => { setStatus('error'); console.error('WS error', err) })

    socket.on('BTCUSDT', (tick)=>{
      if(typeof tick?.close !== 'number') return
      closes.current.push(tick.close)
      if(closes.current.length > 240) closes.current.shift()
      if(!locked && closes.current.length >= 25){
        const arr = closes.current.slice(-60)
        const e5 = ema(arr, 5)
        const e20 = ema(arr, 20)
        const momentum = arr[arr.length-1] - arr[arr.length-5]
        const dir = (e5 > e20 && momentum > 0) ? 'BUY' : (e5 < e20 && momentum < 0) ? 'SELL' : null
        if(dir) setDecision(dir)
      }
    })

    socket.on('TIME', (sec)=>{
      const s = Number(sec)
      if(Number.isFinite(s)){
        setTimeSec(s)
        if(s === 0){ setLocked(false); setDecision(null) }
        if(s >= 55 && !locked && decision){ setLocked(true) }
      }
    })

    socket.on('LAST_RESULTS', (p)=>{
      const ok = Number(p?.ok ?? p?.correct ?? 0)
      const total = Number(p?.total ?? p?.count ?? 0)
      if(total >= 0) setScore({ ok, total })
    })

    return ()=> socket.close()
  }, [])

  const percent = score.total ? Math.round((score.ok/score.total)*1000)/10 : null
  return { status, timeSec, decision, locked, score, percent }
}
