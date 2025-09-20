import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase.js';

function ErrorBanner({msg}){
  return (
    <div className="min-h-screen grid place-items-center">
      <div className="max-w-xl rounded-2xl border border-red-500/40 bg-red-500/10 text-red-200 p-6">
        <div className="text-lg font-semibold mb-2">Cấu hình thiếu</div>
        <div className="text-sm whitespace-pre-wrap">{msg}</div>
        <div className="mt-3 text-xs text-red-300">
          Vào Vercel → Project → Settings → Environment Variables và thêm đủ các biến VITE_FIREBASE_* và VITE_MONIQ_CHART_URL. Sau đó redeploy.
        </div>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [envErr, setEnvErr] = React.useState(null);

  React.useEffect(() => {
    if (window.__TOOLMONIQ_ENV_ERROR__) {
      setEnvErr(window.__TOOLMONIQ_ENV_ERROR__);
      setLoading(false);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsub && unsub();
  }, []);

  if (envErr) return <ErrorBanner msg={envErr} />;
  if (loading) return <div className="min-h-screen grid place-items-center text-neutral-400">Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" /> : <AuthPage />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
