// src/lib/session.js
const LS_SESSION = 'tmq_session'

export function getSession(){
  try{ return JSON.parse(localStorage.getItem(LS_SESSION)) || null }catch{ return null }
}
export function clearSession(){
  localStorage.removeItem(LS_SESSION)
}
