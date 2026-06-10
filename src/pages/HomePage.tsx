import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TreePine, Shield, Zap, Globe, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, BlogPost } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ui/ProductCard';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO, buildOrganization, buildWebsite } from '../hooks/useSEO';

export default function HomePage() {
  const { t, lang } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: t('seo', 'homeTitle'),
    description: t('seo', 'homeDescription'),
    keywords: t('seo', 'homeKeywords'),
    lang,
    canonicalPath: '/',
    ogImage: '/ogelo-banner.jpg',
    structuredData: [buildOrganization(), buildWebsite()],
  });

  useEffect(() => {
    const load = async () => {
      const [featRes, newRes, blogRes] = await Promise.all([
        supabase.from('products_elife').select('*').eq('featured', true).eq('is_active', true).limit(4),
        supabase.from('products_elife').select('*').eq('is_new', true).eq('is_active', true).limit(2),
        supabase.from('blog_posts_elife').select('*').eq('published', true).order('published_at', { ascending: false }).limit(3),
      ]);
      setFeaturedProducts(featRes.data || []);
      setNewArrivals(newRes.data || []);
      setBlogPosts(blogRes.data || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <PageLoader />;

  const HERO_IMG = '/ogelo-banner.jpg';

  const promises = [
    { icon: TreePine, title: t('home', 'promise1Title'), text: t('home', 'promise1Text') },
    { icon: Shield, title: t('home', 'promise2Title'), text: t('home', 'promise2Text') },
    { icon: Zap, title: t('home', 'promise3Title'), text: t('home', 'promise3Text') },
    { icon: Globe, title: t('home', 'promise4Title'), text: t('home', 'promise4Text') },
  ];

  return (
    <div className="bg-cream-50">
      {/* Hero — ogelo brand banner as backdrop, text on the right */}
      <section className="relative h-[85vh] min-h-[560px] overflow-hidden bg-gray-100">
        <img
          src={HERO_IMG}
          alt="ogelo — adventure starts here"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#27180A]/80 via-[#27180A]/30 to-transparent" />
        <div className="relative h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-end">
            <div className="max-w-lg animate-slide-up text-right">
              <span className="inline-block bg-forest-500/20 text-forest-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm border border-forest-400/30">
                {t('home', 'newArrivals')} →
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t('home', 'heroTitle')}
              </h1>
              <p className="text-lg text-cream-200 leading-relaxed mb-8 max-w-md ml-auto">
                {t('home', 'heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-4 justify-end">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 text-white font-semibold px-7 py-3.5 rounded-xl transition-colors text-sm shadow-lg"
                >
                  {t('home', 'shopNow')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 border border-white/50 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm backdrop-blur-sm"
                >
                  {t('home', 'exploreCollection')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured / Popular Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-terracotta-500 font-semibold text-sm uppercase tracking-wider mb-2">{t('home', 'featuredSubtitle')}</p>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">{t('home', 'featuredProducts')}</h2>
              </div>
              <Link to="/products?filter=featured" className="hidden sm:flex items-center gap-1 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors">
                {t('home', 'viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Promises */}
      <section className="py-20 bg-forest-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold text-white text-center mb-14">{t('home', 'ourPromise')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {promises.map(({ icon: Icon, title, text }, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-6 h-6 text-cream-200" />
                </div>
                <h3 className="text-base font-bold text-cream-100 mb-2">{title}</h3>
                <p className="text-sm text-forest-200 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {newArrivals.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">{t('home', 'newArrivals')}</h2>
                <p className="text-gray-500 mt-2">{t('home', 'newArrivalsSubtitle')}</p>
              </div>
              <Link to="/products?filter=new" className="hidden sm:flex items-center gap-1 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors">
                {t('home', 'viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-6 lg:gap-8 max-w-2xl">
              {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Mid-page banner */}
      <section className="relative h-72 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Children playing"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-forest-900/60 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              {lang === 'en' ? 'Toys that grow with your child' : lang === 'de' ? 'Spielzeug, das mit Ihrem Kind wächst' : lang === 'it' ? 'Giocattoli che crescono col tuo bambino' : 'Des jouets qui grandissent avec votre enfant'}
            </p>
            <Link to="/products?category=toys-play" className="inline-flex items-center gap-2 bg-white text-forest-700 font-semibold px-6 py-3 rounded-xl hover:bg-cream-100 transition-colors text-sm">
              {t('home', 'shopNow')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog */}
      {blogPosts.length > 0 && (
        <section className="py-20 bg-cream-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900">{t('home', 'fromJournal')}</h2>
                <p className="text-gray-500 mt-2">{t('home', 'journalSubtitle')}</p>
              </div>
              <Link to="/blog" className="hidden sm:flex items-center gap-1 text-forest-600 font-semibold text-sm hover:text-forest-700 transition-colors">
                {t('home', 'viewAll')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map(post => {
                const title = (post.title as Record<string, string>)[lang] || post.title['en'];
                const excerpt = (post.excerpt as Record<string, string>)[lang] || post.excerpt['en'];
                return (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      {post.cover_image && (
                        <img src={post.cover_image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        {post.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-xs bg-cream-100 text-forest-600 px-2.5 py-1 rounded-full font-medium capitalize">{tag}</span>
                        ))}
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-forest-600 transition-colors leading-snug mb-2">{title}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{excerpt}</p>
                      <div className="flex items-center gap-1 mt-4 text-forest-600 text-sm font-semibold">
                        {t('blog', 'readMore')} <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
