import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

export default function LoginPage() {
  const { t, lang } = useLanguage();
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useSEO({ title: 'Login — ogelo', lang });

  React.useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  if (user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await signIn(email, password);
    if (err) { setError(t('auth', 'loginError')); setLoading(false); return; }
    // signIn sets user+profile in context; useEffect above handles navigation
  };

  const inputCls = 'w-full px-4 py-3 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-300 bg-white';

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <img src="/ogelo-logo.jpg" alt="ogelo" className="h-10 w-auto" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">{t('auth', 'welcomeBack')}</h1>
          <p className="text-gray-500 mt-2 text-sm">{t('auth', 'loginDescription')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-cream-200 p-8 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth', 'email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputCls}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">{t('auth', 'password')}</label>
              <button type="button" className="text-xs text-forest-600 hover:underline">{t('auth', 'forgotPassword')}</button>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputCls} pr-10`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            {t('auth', 'loginSubmit')}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('auth', 'noAccount')}{' '}
          <Link to="/register" className="text-forest-600 font-semibold hover:underline">
            {t('auth', 'registerLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
