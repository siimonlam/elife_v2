import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SetupPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', firstName: '', lastName: '' });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  useEffect(() => {
    supabase.from('profiles_elife').select('id').eq('is_admin', true).limit(1).then(({ data }) => {
      if (data && data.length > 0) setHasAdmin(true);
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setStatus('loading');
    setError('');

    const { data, error: signUpErr } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpErr || !data.user) {
      setError(signUpErr?.message ?? 'Could not create account.');
      setStatus('error');
      return;
    }

    // Upsert profile with is_admin = true
    const { error: profileErr } = await supabase.from('profiles_elife').upsert({
      id: data.user.id,
      first_name: form.firstName,
      last_name: form.lastName,
      is_admin: true,
    });

    if (profileErr) {
      setError(profileErr.message);
      setStatus('error');
      return;
    }

    setStatus('success');
    setTimeout(() => navigate('/admin'), 2000);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
          <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h1 className="font-bold text-gray-900 text-xl mb-2">Setup Complete</h1>
          <p className="text-gray-500 text-sm mb-6">An admin account already exists. Please log in to access the admin panel.</p>
          <a href="/login" className="inline-block bg-forest-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-forest-600 transition-colors text-sm">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-forest-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-7 h-7 text-forest-500" />
          </div>
          <h1 className="font-bold text-gray-900 text-2xl mb-1">First-Time Setup</h1>
          <p className="text-gray-400 text-sm">Create the admin account for ogelo.</p>
        </div>

        {status === 'success' ? (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="font-bold text-gray-900 text-lg mb-2">Admin account created!</h2>
            <p className="text-gray-400 text-sm">Redirecting to admin panel…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">First Name</label>
                <input
                  required
                  value={form.firstName}
                  onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400"
                  placeholder="First"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Last Name</label>
                <input
                  required
                  value={form.lastName}
                  onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400"
                  placeholder="Last"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400"
                placeholder="admin@yourdomain.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input
                  required
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400"
                  placeholder="Min. 8 characters"
                />
                <button type="button" onClick={() => setShowPw(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-forest-500 hover:bg-forest-600 disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl text-sm transition-colors mt-2"
            >
              {status === 'loading' ? 'Creating account…' : 'Create Admin Account'}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-300 mt-6">
          This page is only available when no admin accounts exist.
        </p>
      </div>
    </div>
  );
}
