
// src/pages/AuthPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { setSession, getSession, CREDS_KEY } from '../lib/session';

const ADMIN_EMAIL = 'zeussnguyen9@gmail.com';

export default function AuthPage() {
  const nav = useNavigate();
  const [tab, setTab] = React.useState('login'); // login | register | otp
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [remember, setRemember] = React.useState(true);
  const [msg, setMsg] = React.useState('');

  // OTP state
  const [otpEmail, setOtpEmail] = React.useState('');
  const [sent, setSent] = React.useState(false);
  const [otp, setOtp] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(()=>{
    const s = getSession();
    if (s) nav('/');
    try {
      const saved = JSON.parse(localStorage.getItem(CREDS_KEY) || 'null');
      if (saved) {
        setEmail(saved.email || '');
        setPassword(saved.password || '');
      }
    } catch {}
  }, []);

  const auth = getAuth();

  const handleLogin = async () => {
    setMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const role = (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'Admin' : 'Member';
      const session = { uid: auth.currentUser.uid, email, role, loginAt: Date.now() };
      setSession(session);
      if (remember) localStorage.setItem(CREDS_KEY, JSON.stringify({ email, password }));
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
      await createUserWithEmailAndPassword(auth, email, password);
      setMsg('Đăng ký thành công. Bạn có thể đăng nhập.');
      setTab('login');
    } catch (e) {
      setMsg('Đăng ký thất bại: ' + (e?.message || e));
    }
  };

  const startCountdown = (sec) => {
    setCountdown(sec);
    const id = setInterval(()=> {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendOtp = async () => {
    setMsg('');
    try {
      const resp = await fetch('/api/send-otp', { method:'POST', body: JSON.stringify({ email: otpEmail }) });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Send OTP failed');
      setSent(true);
      startCountdown((json.ttlMin || 10) * 60);
      setMsg('Đã gửi OTP tới email. Vui lòng kiểm tra hộp thư.');
    } catch (e) {
      setMsg('Không thể gửi OTP: ' + e.message);
    }
  };

  const doReset = async () => {
    setMsg('');
    try {
      const resp = await fetch('/api/reset-password', { method:'POST', body: JSON.stringify({ email: otpEmail, otp, newPassword: newPwd }) });
      const json = await resp.json();
      if (!resp.ok) throw new Error(json.error || 'Reset failed');
      setMsg('Đã đổi mật khẩu. Hãy đăng nhập bằng mật khẩu mới.');
      setTab('login');
    } catch (e) {
      setMsg('Không thể đổi mật khẩu: ' + e.message);
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
          <button className={`rounded-lg py-2 ${tab==='otp'?'bg-indigo-600 text-white':'bg-neutral-800 text-neutral-300'}`} onClick={()=>setTab('otp')}>Quên mật khẩu</button>
        </div>

        {/* LOGIN */}
        {tab==='login' && (
          <div className="mt-4 space-y-3 text-sm">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mật khẩu" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
            <label className="flex items-center gap-2 text-neutral-300">
              <input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Lưu tài khoản/mật khẩu
            </label>
            <button onClick={handleLogin} className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2">Đăng nhập</button>
          </div>
        )}

        {/* REGISTER */}
        {tab==='register' && (
          <div className="mt-4 space-y-3 text-sm">
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
            <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Mật khẩu (≥6 ký tự)" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
            <button onClick={handleRegister} className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2">Đăng ký</button>
          </div>
        )}

        {/* OTP RESET */}
        {tab==='otp' && (
          <div className="mt-4 space-y-3 text-sm">
            <input value={otpEmail} onChange={e=>setOtpEmail(e.target.value)} placeholder="Email cần khôi phục" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
            {!sent ? (
              <button onClick={sendOtp} className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white py-2">Gửi OTP</button>
            ) : (
              <>
                <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="Nhập mã OTP" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
                <input value={newPwd} onChange={e=>setNewPwd(e.target.value)} type="password" placeholder="Mật khẩu mới (≥6 ký tự)" className="w-full rounded-lg bg-neutral-800 border border-white/10 px-3 py-2 text-white"/>
                <button onClick={doReset} className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white py-2">Cập nhật mật khẩu</button>
                <div className="text-xs text-neutral-400 text-center">OTP còn hiệu lực: {countdown}s</div>
              </>
            )}
          </div>
        )}

        <div className="mt-3 text-xs text-rose-400 min-h-[18px]">{msg}</div>
        <div className="mt-2 text-[10px] text-neutral-500 text-center">Nguồn trang: <b>TOOLMONIQ-ByLiamNguyen</b></div>
      </div>
    </div>
  );
}
