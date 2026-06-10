import React from 'react';
import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useState } from 'react';

export default function Footer() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-forest-800 text-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 py-16">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <p className="text-sm text-cream-300 leading-relaxed max-w-xs">{t('footer', 'tagline')}</p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-forest-300">{t('footer', 'shop')}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/products', label: t('footer', 'allProducts') },
                { to: '/products?filter=new', label: t('footer', 'newArrivals') },
                { to: '/products?filter=featured', label: t('footer', 'bestsellers') },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-cream-300 hover:text-cream-100 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-forest-300">{t('footer', 'company')}</h3>
            <ul className="space-y-2.5">
              {[
                { to: '/about', label: t('footer', 'about') },
                { to: '/blog', label: t('footer', 'blog') },
                { to: '/contact', label: t('footer', 'contact') },
              ].map(({ to, label }) => (
                <li key={to}><Link to={to} className="text-sm text-cream-300 hover:text-cream-100 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-forest-300">{t('footer', 'newsletter')}</h3>
            <p className="text-sm text-cream-300 leading-relaxed">{t('footer', 'newsletterText')}</p>
            {subscribed ? (
              <p className="text-sm text-forest-300 font-medium">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('footer', 'emailPlaceholder')}
                  required
                  className="w-full bg-forest-700 border border-forest-600 text-cream-200 placeholder-forest-400 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-forest-400"
                />
                <button type="submit" className="w-full bg-terracotta-500 hover:bg-terracotta-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('footer', 'subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-forest-700 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-400">{t('footer', 'copyright')}</p>
          <div className="flex items-center gap-4 text-xs text-forest-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              {t('footer', 'ssl')}
            </span>
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
