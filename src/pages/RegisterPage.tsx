import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

export default function RegisterPage() {
  const { t, lang } = useLanguage();
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirm: '', firstName: '', lastName: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useSEO({ title: 'Register — ogelo', lang });

  if (user) { navigate('/'); return null; }

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError(t('auth', 'passwordMismatch')); return; }
    setLoading(true);
    setError('');
    const { error: err } = await signUp(form.email, form.password, form.firstName, form.lastName);
    if (err) { setError(t('auth', 'registerError')); setLoading(false); return; }
    navigate('/');
  };

  const inputCls = 'w-full px-4 py-3 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-300 bg-white';

  return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center mb-6">
            <img src="/ogelo-logo.jpg" alt="ogelo" className="h-10 w-auto" />
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">{t('auth', 'createAccount')}</h1>
          <p className="text-gray-500 mt-2 text-sm">{t('auth', 'registerDescription')}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-cream-200 p-8 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{t('auth', 'firstName')}</label>
              <input type="text" value={form.firstName} onChange={e => set('firstName', e.target.value)} required autoComplete="given-name" className={inputCls} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">{t('auth', 'lastName')}</label>
              <input type="text" value={form.lastName} onChange={e => set('lastName', e.target.value)} required autoComplete="family-name" className={inputCls} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth', 'email')}</label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" className={inputCls} placeholder="you@example.com" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth', 'password')}</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} required autoComplete="new-password" minLength={8} className={`${inputCls} pr-10`} placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">{t('auth', 'confirmPassword')}</label>
            <input type="password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required autoComplete="new-password" className={inputCls} placeholder="Repeat password" />
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
            {t('auth', 'registerSubmit')}
          </Button>

          <p className="text-xs text-gray-400 text-center pt-1">
            By creating an account you agree to our terms and privacy policy.
          </p>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {t('auth', 'hasAccount')}{' '}
          <Link to="/login" className="text-forest-600 font-semibold hover:underline">
            {t('auth', 'loginLink')}
          </Link>
        </p>
      </div>
    </div>
  );
}
