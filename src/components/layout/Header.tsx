import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, ChevronDown, Globe, Search } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import type { Lang } from '../../types';
import CartSidebar from './CartSidebar';

const LANGS: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'fr', label: 'FR' },
];

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { itemCount, openCart } = useCart();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-forest-500 text-white text-center text-xs font-medium py-2.5 px-4">
        {t('home', 'announcement')}
      </div>

      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled || !isHome ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-cream-300' : 'bg-white/95 backdrop-blur-md border-b border-cream-300'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img src="/61ef3c3a05bb1626efee911a0da9c024.w600.h600._CR0,0,600,600_SX600__(1) copy copy.jpg" alt="ogelo" className="h-9 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">{t('nav', 'home')}</Link>
              <Link to="/products" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">{t('nav', 'shop')}</Link>
              <Link to="/blog" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">{t('nav', 'blog')}</Link>
              <Link to="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">{t('nav', 'about')}</Link>
              <Link to="/contact" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-forest-600 transition-colors">{t('nav', 'contact')}</Link>
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={t('nav', 'searchPlaceholder')}
                    className="w-48 text-sm border-b border-forest-400 bg-transparent px-1 py-1 focus:outline-none text-gray-800"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="ml-1 p-1.5 text-gray-500 hover:text-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-gray-600 hover:text-forest-600 transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              )}

              {/* Language picker */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen(p => !p)}
                  className="flex items-center gap-1 p-2 text-gray-600 hover:text-forest-600 text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  {lang.toUpperCase()}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {langOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-cream-300 rounded-xl shadow-lg overflow-hidden z-50 min-w-[80px]">
                    {LANGS.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                        className={`block w-full text-left px-4 py-2 text-sm transition-colors ${lang === l.code ? 'bg-forest-50 text-forest-600 font-semibold' : 'text-gray-700 hover:bg-cream-100'}`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserOpen(p => !p)}
                  className="p-2 text-gray-600 hover:text-forest-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-cream-300 rounded-xl shadow-lg overflow-hidden z-50 min-w-[160px]">
                    {user ? (
                      <>
                        <div className="px-4 py-3 border-b border-cream-200">
                          <p className="text-xs text-gray-500">Signed in as</p>
                          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setUserOpen(false); }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          {t('nav', 'logout')}
                        </button>
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-cream-100">{t('nav', 'login')}</Link>
                        <Link to="/register" onClick={() => setUserOpen(false)} className="block px-4 py-2.5 text-sm text-forest-600 font-medium hover:bg-forest-50">{t('nav', 'register')}</Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-forest-600 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-terracotta-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(p => !p)}
                className="lg:hidden p-2 text-gray-600 hover:text-forest-600 transition-colors"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-white border-t border-cream-200 animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {[
                { to: '/', label: t('nav', 'home') },
                { to: '/products', label: t('nav', 'shop') },
                { to: '/blog', label: t('nav', 'blog') },
                { to: '/about', label: t('nav', 'about') },
                { to: '/contact', label: t('nav', 'contact') },
              ].map(({ to, label }) => (
                <Link key={to} to={to} className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-forest-600 hover:bg-cream-100 rounded-xl transition-colors">
                  {label}
                </Link>
              ))}
              <div className="pt-3 border-t border-cream-200 flex items-center gap-3">
                {user ? (
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="text-sm text-red-600 font-medium">
                    {t('nav', 'logout')}
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-gray-700">{t('nav', 'login')}</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="text-sm font-medium text-forest-600">{t('nav', 'register')}</Link>
                  </>
                )}
                <div className="ml-auto flex gap-2">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); }}
                      className={`text-xs font-semibold px-2 py-1 rounded-md transition-colors ${lang === l.code ? 'bg-forest-500 text-white' : 'text-gray-500 hover:text-forest-600'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartSidebar />
    </>
  );
}
