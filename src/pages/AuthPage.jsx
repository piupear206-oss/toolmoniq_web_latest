
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { setSession, getSession, CREDS_KEY } from '../lib/session';

const ADMIN_PHONE = '0944301226';
const ADMIN_NAME = 'Liam Nguyen';

export default function AuthPage() {
  const nav = useNavigate();
  const [tab, setTab] = React.useState('login');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [msg, setMsg] = React.useState('');

  React.useEffect(()=>{
    const s = getSession();
    if (s) nav('/');
    try {
      const saved = JSON.parse(localStorage.getItem(CREDS_KEY) || 'null');
      if (saved) {
        setPhone(saved.phone || '');
        setEmail(saved.email || '');
        setPassword(saved.password || '');
      }
    } catch {}
  }, []);

  const auth = getAuth();
  const db = getFirestore();

  function toE164(v){
    const digits = (v||'').replace(/\D/g,'');
    if (digits.startsWith('0')) return '+84' + digits.slice(1);
    if (digits.startsWith('84')) return '+' + digits;
    if (digits.startsWith('+')) return digits;
    return '+84' + digits;
  }

  const handleLogin = async () => {
    setMsg('');
    try {
      const e164 = toE164(phone);
      const ref = doc(db, 'phone_map', e164);
      const snap = await getDoc(ref);
      if (!snap.exists()) { setMsg('Số điện thoại chưa đăng ký.'); return; }
      const { email } = snap.data();
      await signInWithEmailAndPassword(auth, email, password);
      const role = (phone === ADMIN_PHONE || (auth.currentUser?.displayName||'')===ADMIN_NAME) ? 'Admin':'Member';
      const session = { uid: auth.currentUser.uid, phone, email, role, loginAt: Date.now() };
      setSession(session);
      if (remember) localStorage.setItem(CREDS_KEY, JSON.stringify({ phone, email, password }));
      else localStorage.removeItem(CREDS_KEY);
      try { localStorage.removeItem('moniq_stats'); } catch {}
      nav('/');
    } catch (e) {
      setMsg('Đăng nhập thất bại: ' + (e?.message || e));
    }
  };

  const handleRegister = async () => {
    setMsg('');
    try {
      if (!email) { setMsg('Vui lòng nhập Email khôi phục để đăng ký.'); return; }
      await createUserWithEmailAndPassword(auth, email, password);
      const e164 = toE164(phone);
      await setDoc(doc(db,'phone_map', e164), {
        phone: e164, email, uid: auth.currentUser.uid, at: Date.now()
      });
      setMsg('Đăng ký thành công. Bạn có thể đăng nhập.');
      setTab('login');
    } catch (e) {
      setMsg('Đăng ký thất bại: ' + (e?.message || e));
    }
  };

  const handleReset = async () => {
    setMsg('');
    try {
      const e164 = toE164(phone);
      const ref = doc(db, 'phone_map', e164);
      const snap = await getDoc(ref);
      if (!snap.exists()) { setMsg('SĐT chưa đăng ký.'); return; }
      const { email } = snap.data();
      await sendPasswordResetEmail(auth, email);
      setMsg('Đã gửi email đặt lại mật khẩu tới: ' + email);
    } catch (e) {
      setMsg('Không thể gửi email reset: ' + (e?.message || e));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080e1a]">
      <div className="w-full max-w-md rounded-2xl bg-neutral-900/80 p-6 border border-white/10">
        <h1 className="text-center text-2xl font-semibold"><span className="text-white">TOOL</span><span className="text-indigo-400">MONIQ</span></h1>
        <p className="text-center text-xs text-neutral-400 mt-1">Đăng nhập để vào TOOLMONIQ</p>

        <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
          <button className={`rounded-lg py-2 ${tab==='login'?'bg-indigo-600 text-white':'bg-neutral-800 text-neutral-300'}`} onClick={()=>setTab('login')}>Đăng nhập</button>
          <button className={`rounded-lg py-2 ${tab==='register'?'bg-indigo-600 text-white':'bg-neutral-800 text-neutral-300'}`} onClick={()=>setTab('register')}>Đăng ký</button>
          <button className={`rounded-lg py-2 ${tab==='reset'?'bg-indigo-600 text-white':'bg-neutral-800 text-neutral-300'}`} onClick={()=>setTab('reset')}>Quên mật khẩu</button>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Số điện thoại" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
          {(tab!=='reset') && (
            <>
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email khôi phục (đăng ký)" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
              <label className="flex items-center gap-2 text-neutral-300">
                <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Lưu tài khoản/mật khẩu (trừ khi bạn tắt chọn)
              </label>
            </>
          )}
        </div>

        <button onClick={tab==='login'?handleLogin: tab==='register'?handleRegister:handleReset}
                className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2">
          {tab==='login'?'Gửi OTP & Đăng nhập (email/pwd)': tab==='register'?'Đăng ký':'Gửi email đặt lại mật khẩu'}
        </button>

        <div className="mt-3 text-xs text-rose-400 min-h-[18px]">{msg}</div>
        <div className="mt-2 text-[10px] text-neutral-500 text-center">Nguồn trang: <b>TOOLMONIQ-ByLiamNguyen</b></div>
      </div>
    </div>
  );
}
