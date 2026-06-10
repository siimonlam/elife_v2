import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ProductCard } from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO, buildBreadcrumbs } from '../hooks/useSEO';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name';

export default function ProductsPage() {
  const { t, lang } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const q = searchParams.get('q') || '';
  const categorySlug = searchParams.get('category') || '';
  const filter = searchParams.get('filter') || '';
  const sort = (searchParams.get('sort') || 'newest') as SortOption;

  useSEO({
    title: t('seo', 'productsTitle'),
    description: t('seo', 'productsDescription'),
    keywords: t('seo', 'productsKeywords'),
    lang,
    canonicalPath: '/products',
    structuredData: buildBreadcrumbs([
      { name: 'Home', path: '/' },
      { name: 'Shop', path: '/products' },
    ]),
  });

  const loadProducts = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('products_elife').select('*, categories_elife(*)').eq('is_active', true);

    if (q) query = query.ilike('name->en', `%${q}%`);
    if (categorySlug) {
      const { data: cat } = await supabase.from('categories_elife').select('id').eq('slug', categorySlug).maybeSingle();
      if (cat) query = query.eq('category_id', cat.id);
    }
    if (filter === 'featured') query = query.eq('featured', true);
    if (filter === 'new') query = query.eq('is_new', true);

    switch (sort) {
      case 'price_asc': query = query.order('price', { ascending: true }); break;
      case 'price_desc': query = query.order('price', { ascending: false }); break;
      case 'name': query = query.order('name->en', { ascending: true }); break;
      default: query = query.order('created_at', { ascending: false });
    }

    const { data } = await query;
    setProducts(data || []);
    setLoading(false);
  }, [q, categorySlug, filter, sort]);

  useEffect(() => {
    supabase.from('categories_elife').select('*').order('sort_order').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  const updateParam = (key: string, value: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      return next;
    });
  };

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'newest', label: t('common', 'sortNewest') },
    { value: 'price_asc', label: t('common', 'sortPriceAsc') },
    { value: 'price_desc', label: t('common', 'sortPriceDesc') },
    { value: 'name', label: t('common', 'sortName') },
  ];

  const activeCat = categories.find(c => c.slug === categorySlug);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Page header */}
      <div className="bg-white border-b border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="text-xs text-gray-400 mb-3 flex items-center gap-1">
            <Link to="/" className="hover:text-forest-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-gray-700">{t('nav', 'shop')}</span>
            {activeCat && (
              <>
                <span>/</span>
                <span className="text-gray-700">{(activeCat.name_translations as Record<string, string>)[lang] || activeCat.name}</span>
              </>
            )}
          </nav>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">
            {activeCat ? (activeCat.name_translations as Record<string, string>)[lang] || activeCat.name : q ? `"${q}"` : t('nav', 'allProducts')}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">{products.length} {lang === 'en' ? 'products' : lang === 'de' ? 'Produkte' : lang === 'it' ? 'prodotti' : 'produits'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {/* Search input */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              defaultValue={q}
              onKeyDown={e => { if (e.key === 'Enter') updateParam('q', (e.target as HTMLInputElement).value); }}
              placeholder={t('nav', 'searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-cream-300 rounded-xl text-sm focus:outline-none focus:border-forest-400"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <button
              onClick={() => setFilterOpen(p => !p)}
              className="flex items-center gap-2 bg-white border border-cream-300 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-forest-400 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('common', 'filter')}
              {categorySlug && <span className="w-2 h-2 bg-forest-500 rounded-full" />}
            </button>
            {filterOpen && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-cream-200 rounded-2xl shadow-xl z-20 w-56 p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">{t('nav', 'categories')}</p>
                <button
                  onClick={() => { updateParam('category', ''); setFilterOpen(false); }}
                  className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${!categorySlug ? 'bg-forest-50 text-forest-700 font-semibold' : 'text-gray-700 hover:bg-cream-100'}`}
                >
                  {t('nav', 'allProducts')}
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => { updateParam('category', cat.slug); setFilterOpen(false); }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${categorySlug === cat.slug ? 'bg-forest-50 text-forest-700 font-semibold' : 'text-gray-700 hover:bg-cream-100'}`}
                  >
                    {(cat.name_translations as Record<string, string>)[lang] || cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2">
            {[{ label: t('home', 'newArrivals'), value: 'new' }, { label: t('home', 'featuredProducts'), value: 'featured' }].map(f => (
              <button
                key={f.value}
                onClick={() => updateParam('filter', filter === f.value ? '' : f.value)}
                className={`px-3 py-2 text-sm font-medium rounded-xl border transition-colors ${filter === f.value ? 'bg-forest-500 text-white border-forest-500' : 'bg-white text-gray-700 border-cream-300 hover:border-forest-400'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto relative group">
            <select
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              className="appearance-none bg-white border border-cream-300 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:border-forest-400 cursor-pointer"
            >
              {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Active filters */}
          {(categorySlug || q || filter) && (
            <button
              onClick={() => setSearchParams({})}
              className="flex items-center gap-1 text-xs text-red-500 font-medium hover:text-red-700 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Clear all
            </button>
          )}
        </div>

        {loading ? (
          <PageLoader />
        ) : products.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-xl font-semibold text-gray-500 mb-4">{t('common', 'noResults')}</p>
            <button onClick={() => setSearchParams({})} className="text-forest-600 font-medium hover:underline text-sm">
              {t('common', 'seeAll')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-8">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
