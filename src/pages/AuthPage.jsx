import React from 'react';
import Logo from '../components/Logo.jsx';
import { auth, db } from '../lib/firebase.js';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Chuẩn hoá số VN về E.164: "0944..." -> "+84944..."
function toE164VN(input) {
  let s = (input || "").replace(/\s+/g, "").replace(/[^0-9+]/g, "");
  if (s.startsWith("+84")) return s;
  if (s.startsWith("84")) return "+" + s;
  if (s.startsWith("0")) return "+84" + s.slice(1);
  if (/^[1-9]\d{7,12}$/.test(s)) return "+84" + s;
  return s;
}

export default function AuthPage() {
  const [tab, setTab] = React.useState('login'); // login | register | forgot
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900/60 p-6">
        <div className="mb-6 text-center">
          <Logo large />
          <p className="mt-1 text-sm text-neutral-400">Đăng nhập để vào TOOLMONIQ</p>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-sm">
          {['login','register','forgot'].map(k => (
            <button key={k}
              onClick={()=>setTab(k)}
              className={`rounded-xl px-3 py-2 ${tab===k?'bg-neutral-800 text-white':'bg-neutral-800/40 text-neutral-300'}`}>
              {k==='login'?'Đăng nhập':k==='register'?'Đăng ký':'Quên mật khẩu'}
            </button>
          ))}
        </div>

        {tab==='login' && <LoginForm />}
        {tab==='register' && <RegisterForm />}
        {tab==='forgot' && <ForgotForm />}
      </div>
    </div>
  );
}

function LoginForm() {
  const [phone, setPhone] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const phoneKey = toE164VN(phone);
      const snap = await getDoc(doc(db, 'phone_map', phoneKey));
      if (!snap.exists()) throw new Error('Số điện thoại chưa được đăng ký');
      const { email } = snap.data();
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) { setErr(e.message); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="+84xxxxxxxxx (vd: +84944301226)" />
      <Input label="Mật khẩu" type="password" value={password} onChange={setPassword} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      <button className="w-full rounded-xl bg-indigo-600 py-2 font-medium">Đăng nhập</button>
    </form>
  );
}

function RegisterForm() {
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');

  const onSubmit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const phoneKey = toE164VN(phone);
      await setDoc(doc(db, 'phone_map', phoneKey), {
        uid: cred.user.uid, email, phone: phoneKey, createdAt: Date.now()
      });
    } catch(e) { setErr(e.message); }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="+84xxxxxxxxx" />
      <Input label="Email (dùng để khôi phục mật khẩu)" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Input label="Mật khẩu (bạn đặt)" type="password" value={password} onChange={setPassword} />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      <button className="w-full rounded-xl bg-indigo-600 py-2 font-medium">Tạo tài khoản</button>
    </form>
  );
}

function ForgotForm() {
  const [phone, setPhone] = React.useState('');
  const [err, setErr] = React.useState('');
  const [done, setDone] = React.useState(false);

  const onSubmit = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const phoneKey = toE164VN(phone);
      const snap = await getDoc(doc(db, 'phone_map', phoneKey));
      if (!snap.exists()) throw new Error('Số điện thoại chưa được đăng ký');
      const { email } = snap.data();
      await sendPasswordResetEmail(auth, email);
      setDone(true);
    } catch(e) { setErr(e.message); }
  };

  if (done) return <div className="text-emerald-400 text-sm">Đã gửi email đặt lại mật khẩu tới địa chỉ đã đăng ký.</div>;

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <Input label="Số điện thoại" value={phone} onChange={setPhone} placeholder="+84xxxxxxxxx" />
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      <button className="w-full rounded-xl bg-indigo-600 py-2 font-medium">Gửi email đặt lại mật khẩu</button>
    </form>
  );
}

function Input({ label, type='text', value, onChange, placeholder }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs text-neutral-400">{label}</div>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl bg-neutral-800 px-3 py-2 outline-none ring-1 ring-white/10 focus:ring-indigo-500"/>
    </label>
  );
}
