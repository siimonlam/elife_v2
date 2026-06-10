import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import {
  Search, Globe, ChevronDown, ChevronUp, Check, AlertCircle, Info,
  Save, RefreshCw, Eye, EyeOff, ArrowLeft, TrendingUp, FileText,
  Tag, Image, BarChart2, Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useSEOContext } from '../context/SEOContext';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import type { Lang } from '../types';

type LangTab = Lang;

interface PageDef {
  path: string;
  labelEn: string;
  category: 'main' | 'info' | 'legal';
}

const PAGES: PageDef[] = [
  { path: '/', labelEn: 'Home', category: 'main' },
  { path: '/products', labelEn: 'Shop / Products', category: 'main' },
  { path: '/blog', labelEn: 'Blog', category: 'main' },
  { path: '/about', labelEn: 'About Us', category: 'info' },
  { path: '/contact', labelEn: 'Contact', category: 'info' },
  { path: '/faq', labelEn: 'FAQ', category: 'info' },
  { path: '/shipping', labelEn: 'Shipping & Returns', category: 'legal' },
  { path: '/privacy', labelEn: 'Privacy Policy', category: 'legal' },
  { path: '/terms', labelEn: 'Terms & Conditions', category: 'legal' },
];

const LANGS: { code: LangTab; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
];

interface SEOFormState {
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  no_index: boolean;
}

function getSEOScore(form: SEOFormState): { score: number; issues: string[]; tips: string[] } {
  const issues: string[] = [];
  const tips: string[] = [];
  let score = 0;

  const titleLen = form.title.trim().length;
  if (titleLen === 0) issues.push('Title is missing');
  else if (titleLen < 30) issues.push('Title too short (< 30 chars)');
  else if (titleLen > 65) issues.push('Title too long (> 65 chars)');
  else { score += 30; }

  const descLen = form.description.trim().length;
  if (descLen === 0) issues.push('Meta description is missing');
  else if (descLen < 100) issues.push('Description too short (< 100 chars)');
  else if (descLen > 165) issues.push('Description too long (> 165 chars)');
  else { score += 30; }

  if (form.keywords.trim().length === 0) tips.push('Add keywords to help with relevance');
  else { score += 15; }

  if (form.og_image.trim().length === 0) tips.push('Add an OG image for social sharing');
  else { score += 15; }

  if (issues.length === 0) score += 10;

  return { score: Math.min(score, 100), issues, tips };
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'Good' : score >= 50 ? 'Fair' : 'Poor';
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-16 h-16">
        <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle cx="32" cy="32" r={r} fill="none" stroke={color} strokeWidth="6"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold" style={{ color }}>{score}</span>
      </div>
      <div>
        <p className="font-semibold text-gray-900 text-sm">{label}</p>
        <p className="text-xs text-gray-400">SEO Score</p>
      </div>
    </div>
  );
}

function GooglePreview({ title, description, path }: { title: string; description: string; path: string }) {
  const url = `ogelo-toy.com${path}`;
  const displayTitle = title || 'Page title will appear here';
  const displayDesc = description || 'Meta description will appear here. Write a compelling summary that encourages clicks.';
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 font-sans">
      <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Google Search Preview</p>
      <div className="text-xs text-green-700 mb-0.5 truncate">{url}</div>
      <div className="text-[#1a0dab] text-lg font-medium leading-snug hover:underline cursor-pointer line-clamp-1">{displayTitle}</div>
      <div className="text-sm text-gray-600 leading-snug mt-1 line-clamp-2">{displayDesc}</div>
    </div>
  );
}

function CharCount({ value, min, max }: { value: string; min: number; max: number }) {
  const len = value.trim().length;
  const color = len === 0 ? 'text-gray-400' : len < min ? 'text-amber-500' : len > max ? 'text-red-500' : 'text-green-600';
  return (
    <span className={`text-xs font-mono ${color}`}>
      {len} / {max}
    </span>
  );
}

export default function SEOAdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { overrides, refresh } = useSEOContext();
  const location = useLocation();

  const [activePage, setActivePage] = useState<PageDef>(PAGES[0]);
  const [activeLang, setActiveLang] = useState<LangTab>('en');
  const [forms, setForms] = useState<Record<string, SEOFormState>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [searchQ, setSearchQ] = useState('');



  // Populate forms from overrides whenever overrides update
  useEffect(() => {
    const newForms: Record<string, SEOFormState> = {};
    PAGES.forEach(page => {
      LANGS.forEach(l => {
        const key = `${page.path}__${l.code}`;
        const rec = overrides.get(key);
        newForms[key] = {
          title: rec?.title ?? '',
          description: rec?.description ?? '',
          keywords: rec?.keywords ?? '',
          og_image: rec?.og_image ?? '',
          no_index: rec?.no_index ?? false,
        };
      });
    });
    setForms(newForms);
  }, [overrides]);

  const currentKey = `${activePage.path}__${activeLang}`;
  const currentForm = forms[currentKey] ?? { title: '', description: '', keywords: '', og_image: '', no_index: false };
  const { score, issues, tips } = getSEOScore(currentForm);

  const setField = useCallback(<K extends keyof SEOFormState>(field: K, value: SEOFormState[K]) => {
    setForms(prev => ({ ...prev, [currentKey]: { ...prev[currentKey], [field]: value } }));
  }, [currentKey]);

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      page_path: activePage.path,
      lang: activeLang,
      title: currentForm.title || null,
      description: currentForm.description || null,
      keywords: currentForm.keywords || null,
      og_image: currentForm.og_image || null,
      no_index: currentForm.no_index,
    };
    await supabase.from('seo_settings_elife').upsert(payload, { onConflict: 'page_path,lang' });
    await refresh();
    setSaving(false);
    setSaved(currentKey);
    setTimeout(() => setSaved(null), 2500);
  };

  const handleReset = async () => {
    if (!confirm('Remove DB override for this page/language? It will revert to the code defaults.')) return;
    await supabase.from('seo_settings_elife').delete().eq('page_path', activePage.path).eq('lang', activeLang);
    await refresh();
  };

  const filteredPages = PAGES.filter(p =>
    p.labelEn.toLowerCase().includes(searchQ.toLowerCase()) ||
    p.path.includes(searchQ.toLowerCase())
  );

  const hasOverride = (path: string, lang: LangTab) => overrides.has(`${path}__${lang}`);
  const pageOverrideCount = (path: string) => LANGS.filter(l => hasOverride(path, l.code)).length;

  if (authLoading) return <PageLoader />;
  // user is set but profile fetch may still be in flight — wait rather than redirect
  if (user && profile === null) return <PageLoader />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (!profile?.is_admin) return <Navigate to="/" replace />;

  const categories = ['main', 'info', 'legal'] as const;
  const categoryLabels = { main: 'Main Pages', info: 'Info Pages', legal: 'Legal Pages' };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Admin
            </Link>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-forest-500" />
              <h1 className="font-bold text-gray-900 text-lg">SEO Manager</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Globe className="w-4 h-4" />
            <span>EN · DE · IT · FR</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">

          {/* LEFT: Page list */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Filter pages…"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400"
                  />
                </div>
              </div>
              <nav className="p-2">
                {categories.map(cat => {
                  const pagesInCat = filteredPages.filter(p => p.category === cat);
                  if (pagesInCat.length === 0) return null;
                  return (
                    <div key={cat} className="mb-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 py-2">{categoryLabels[cat]}</p>
                      {pagesInCat.map(page => {
                        const active = activePage.path === page.path;
                        const count = pageOverrideCount(page.path);
                        return (
                          <button
                            key={page.path}
                            onClick={() => setActivePage(page)}
                            className={`w-full text-left flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${active ? 'bg-forest-50 text-forest-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            <div>
                              <div className="font-medium">{page.labelEn}</div>
                              <div className="text-xs text-gray-400 font-mono">{page.path}</div>
                            </div>
                            {count > 0 && (
                              <span className="text-xs bg-forest-100 text-forest-600 font-semibold px-1.5 py-0.5 rounded-full shrink-0">{count}/4</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* RIGHT: Editor */}
          <main className="col-span-12 lg:col-span-9 space-y-5">
            {/* Page + Lang selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-xl">{activePage.labelEn}</h2>
                  <p className="text-sm text-gray-400 font-mono mt-0.5">{activePage.path}</p>
                </div>
                {/* Language tabs */}
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setActiveLang(l.code)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${activeLang === l.code ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      <span>{l.flag}</span>
                      <span className="hidden sm:inline">{l.label}</span>
                      <span className="sm:hidden uppercase">{l.code}</span>
                      {hasOverride(activePage.path, l.code) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-forest-500 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-5">
              {/* FORM */}
              <div className="col-span-12 xl:col-span-8 space-y-4">
                {/* Title */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
                      <FileText className="w-4 h-4 text-forest-500" />
                      Page Title
                    </label>
                    <CharCount value={currentForm.title} min={30} max={65} />
                  </div>
                  <input
                    type="text"
                    value={currentForm.title}
                    onChange={e => setField('title', e.target.value)}
                    placeholder="e.g. ogelo — Premium Wooden Toys & Indoor Playgrounds"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 text-gray-900 placeholder-gray-300"
                  />
                  <div className="mt-2 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">Ideal: 30–65 characters. Include the primary keyword near the start.</p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
                      <FileText className="w-4 h-4 text-forest-500" />
                      Meta Description
                    </label>
                    <CharCount value={currentForm.description} min={100} max={165} />
                  </div>
                  <textarea
                    rows={3}
                    value={currentForm.description}
                    onChange={e => setField('description', e.target.value)}
                    placeholder="A compelling summary of the page. Include primary keywords and a call to action."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 text-gray-900 placeholder-gray-300 resize-none leading-relaxed"
                  />
                  <div className="mt-2 flex items-start gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-400">Ideal: 100–165 characters. This text appears in Google search results.</p>
                  </div>
                </div>

                {/* Keywords */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <label className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                    <Tag className="w-4 h-4 text-forest-500" />
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={currentForm.keywords}
                    onChange={e => setField('keywords', e.target.value)}
                    placeholder="wooden toys, indoor playground, climbing frame, toddler playsets"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 text-gray-900 placeholder-gray-300"
                  />
                  <div className="mt-3">
                    {currentForm.keywords && (
                      <div className="flex flex-wrap gap-1.5">
                        {currentForm.keywords.split(',').map(kw => kw.trim()).filter(Boolean).map((kw, i) => (
                          <span key={i} className="text-xs bg-forest-50 text-forest-600 border border-forest-200 px-2.5 py-1 rounded-full font-medium">{kw}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-400">Comma-separated. 5–10 targeted keywords. Focus on what your customers search for.</p>
                    </div>
                  </div>
                </div>

                {/* OG Image + noindex */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <label className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
                    <Image className="w-4 h-4 text-forest-500" />
                    Social Share Image (OG Image URL)
                  </label>
                  <input
                    type="text"
                    value={currentForm.og_image}
                    onChange={e => setField('og_image', e.target.value)}
                    placeholder="https://www.ogelo-toy.com/ogelo-banner.jpg"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-forest-500/30 focus:border-forest-400 text-gray-900 placeholder-gray-300"
                  />
                  {currentForm.og_image && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-100 h-28 bg-gray-50">
                      <img src={currentForm.og_image} alt="OG preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Block from search engines</p>
                      <p className="text-xs text-gray-400 mt-0.5">Adds noindex, nofollow to this page</p>
                    </div>
                    <button
                      onClick={() => setField('no_index', !currentForm.no_index)}
                      className={`relative w-11 h-6 rounded-full transition-colors ${currentForm.no_index ? 'bg-red-400' : 'bg-gray-200'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${currentForm.no_index ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                {/* Save actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-forest-500 hover:bg-forest-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors shadow-sm"
                  >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : saved === currentKey ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving…' : saved === currentKey ? 'Saved!' : 'Save Override'}
                  </button>
                  {overrides.has(currentKey) && (
                    <button
                      onClick={handleReset}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm px-4 py-3 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset to Default
                    </button>
                  )}
                  <span className="text-xs text-gray-400 ml-auto">
                    {overrides.has(currentKey) ? 'DB override active' : 'Using code default'}
                  </span>
                </div>
              </div>

              {/* SCORE + PREVIEW sidebar */}
              <div className="col-span-12 xl:col-span-4 space-y-4">
                {/* Score */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-forest-500" />
                      SEO Score
                    </p>
                  </div>
                  <ScoreRing score={score} />
                  {(issues.length > 0 || tips.length > 0) && (
                    <div className="mt-4 space-y-2">
                      {issues.map((issue, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          {issue}
                        </div>
                      ))}
                      {tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                          <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          {tip}
                        </div>
                      ))}
                      {issues.length === 0 && tips.length === 0 && (
                        <div className="flex items-start gap-2 text-xs text-green-600 bg-green-50 rounded-lg px-3 py-2">
                          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          All checks passed
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Google Preview */}
                <GooglePreview
                  title={currentForm.title}
                  description={currentForm.description}
                  path={activePage.path}
                />

                {/* Coverage table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                  <p className="font-semibold text-gray-800 text-sm mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-forest-500" />
                    Language Coverage
                  </p>
                  <div className="space-y-2">
                    {LANGS.map(l => {
                      const has = hasOverride(activePage.path, l.code);
                      const key = `${activePage.path}__${l.code}`;
                      const rec = overrides.get(key);
                      return (
                        <button
                          key={l.code}
                          onClick={() => setActiveLang(l.code)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-colors ${activeLang === l.code ? 'bg-forest-50 ring-1 ring-forest-300' : 'hover:bg-gray-50'}`}
                        >
                          <span className="flex items-center gap-2 font-medium text-gray-700">
                            <span>{l.flag}</span> {l.label}
                          </span>
                          {has ? (
                            <span className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                              <Check className="w-3 h-3" /> Custom
                            </span>
                          ) : (
                            <span className="text-xs text-gray-300 font-medium">Default</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick tips */}
                <div className="bg-forest-50 rounded-2xl border border-forest-100 p-5">
                  <p className="font-semibold text-forest-800 text-sm mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    SEO Best Practices
                  </p>
                  <ul className="space-y-2 text-xs text-forest-700">
                    <li className="flex items-start gap-2"><span className="shrink-0 font-bold">1.</span> Include primary keyword in title and first sentence of description.</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-bold">2.</span> Each page should target a unique, specific keyword set.</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-bold">3.</span> Write natural-language descriptions that encourage clicks.</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-bold">4.</span> Translate and localise — avoid word-for-word machine translation.</li>
                    <li className="flex items-start gap-2"><span className="shrink-0 font-bold">5.</span> OG images should be 1200×630 px for best social sharing.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* All-pages overview table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">All Pages Overview</h3>
                <p className="text-xs text-gray-400 mt-0.5">Pages with active DB overrides are highlighted.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs text-gray-400 font-semibold uppercase tracking-wider">
                      <th className="text-left px-5 py-3">Page</th>
                      {LANGS.map(l => (
                        <th key={l.code} className="text-center px-4 py-3">{l.flag} {l.code.toUpperCase()}</th>
                      ))}
                      <th className="text-center px-4 py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PAGES.map(page => (
                      <tr
                        key={page.path}
                        onClick={() => setActivePage(page)}
                        className={`border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 ${activePage.path === page.path ? 'bg-forest-50' : ''}`}
                      >
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-gray-800">{page.labelEn}</div>
                          <div className="text-xs text-gray-400 font-mono">{page.path}</div>
                        </td>
                        {LANGS.map(l => {
                          const has = hasOverride(page.path, l.code);
                          const rec = overrides.get(`${page.path}__${l.code}`);
                          const { score: s } = has ? getSEOScore({ title: rec?.title ?? '', description: rec?.description ?? '', keywords: rec?.keywords ?? '', og_image: rec?.og_image ?? '', no_index: rec?.no_index ?? false }) : { score: 0 };
                          return (
                            <td key={l.code} className="text-center px-4 py-3.5">
                              {has ? (
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${s >= 80 ? 'bg-green-100 text-green-600' : s >= 50 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-500'}`}>{s}</span>
                              ) : (
                                <span className="text-gray-200 text-xs">—</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="text-center px-4 py-3.5">
                          <span className="text-xs text-gray-400">
                            {pageOverrideCount(page.path)}/4
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
