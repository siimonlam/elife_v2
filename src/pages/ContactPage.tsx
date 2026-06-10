import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

export default function ContactPage() {
  const { t, lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useSEO({ title: t('seo', 'contactTitle'), description: t('seo', 'contactDescription'), lang, canonicalPath: '/contact' });

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const { error } = await supabase.from('contacts_elife').insert(form);
    setStatus(error ? 'error' : 'success');
    if (!error) setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputCls = 'w-full px-4 py-3 border border-cream-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-forest-300 bg-white';

  const info = [
    { icon: MapPin, title: t('contact', 'addressTitle'), text: t('contact', 'address') },
    { icon: Mail, title: t('contact', 'emailTitle'), text: t('contact', 'emailAddress') },
    { icon: Phone, title: t('contact', 'phoneTitle'), text: t('contact', 'phoneNumber') },
    { icon: Clock, title: t('contact', 'hoursTitle'), text: t('contact', 'hours') },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-200 py-14 text-center">
        <h1 className="font-serif text-4xl font-bold text-gray-900 mb-3">{t('contact', 'title')}</h1>
        <p className="text-gray-500">{t('contact', 'subtitle')}</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-6">
            {info.map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 bg-forest-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="w-5 h-5 text-forest-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
                  <p className="text-sm text-gray-800">{text}</p>
                </div>
              </div>
            ))}

            {/* Map placeholder */}
            <div className="rounded-2xl overflow-hidden h-48 bg-cream-200 mt-6">
              <img
                src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Office"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            {status === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-lg text-green-800 mb-2">{t('contact', 'success')}</h3>
                <button onClick={() => setStatus('idle')} className="text-sm text-green-600 hover:underline mt-2">
                  {lang === 'en' ? 'Send another message' : lang === 'de' ? 'Weitere Nachricht senden' : lang === 'it' ? 'Invia un altro messaggio' : 'Envoyer un autre message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{t('contact', 'name')} *</label>
                    <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">{t('contact', 'email')} *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} required className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t('contact', 'subject')}</label>
                  <input type="text" value={form.subject} onChange={e => set('subject', e.target.value)} className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">{t('contact', 'message')} *</label>
                  <textarea rows={6} value={form.message} onChange={e => set('message', e.target.value)} required className={`${inputCls} resize-none`} />
                </div>
                {status === 'error' && (
                  <p className="text-sm text-red-600">{t('contact', 'error')}</p>
                )}
                <Button type="submit" loading={status === 'loading'} size="lg" fullWidth>
                  <Send className="w-4 h-4 mr-1" />
                  {status === 'loading' ? t('contact', 'sending') : t('contact', 'send')}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
