import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO, buildBreadcrumbs } from '../hooks/useSEO';

export default function BlogPage() {
  const { t, lang } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTag, setActiveTag] = useState('');

  useSEO({
    title: t('seo', 'blogTitle'),
    description: t('seo', 'blogDescription'),
    keywords: t('seo', 'blogKeywords'),
    lang,
    canonicalPath: '/blog',
    structuredData: buildBreadcrumbs([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
    ]),
  });

  useEffect(() => {
    supabase.from('blog_posts_elife').select('*').eq('published', true).order('published_at', { ascending: false })
      .then(({ data }) => { setPosts(data || []); setLoading(false); });
  }, []);

  const allTags = [...new Set(posts.flatMap(p => p.tags))];
  const filtered = activeTag ? posts.filter(p => p.tags.includes(activeTag)) : posts;

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : lang, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero */}
      <div className="bg-forest-800 text-white py-20 px-4 text-center">
        <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-4">{t('blog', 'title')}</h1>
        <p className="text-forest-200 max-w-xl mx-auto">{t('blog', 'subtitle')}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveTag('')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!activeTag ? 'bg-forest-500 text-white' : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'}`}
            >
              All
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag === activeTag ? '' : tag)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${activeTag === tag ? 'bg-forest-500 text-white' : 'bg-white text-gray-600 hover:bg-cream-100 border border-cream-300'}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <PageLoader />
        ) : (
          <div className="space-y-8">
            {/* Featured post (first one) */}
            {filtered.length > 0 && (
              <Link to={`/blog/${filtered[0].slug}`} className="group block bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {filtered[0].cover_image && (
                    <div className="aspect-video md:aspect-auto overflow-hidden">
                      <img src={filtered[0].cover_image} alt={(filtered[0].title as Record<string, string>)[lang]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[260px]" loading="lazy" />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {filtered[0].tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-forest-50 text-forest-600 px-3 py-1 rounded-full font-medium capitalize">{tag}</span>
                      ))}
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-gray-900 group-hover:text-forest-600 transition-colors mb-3 leading-snug">
                      {(filtered[0].title as Record<string, string>)[lang] || filtered[0].title['en']}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-5">
                      {(filtered[0].excerpt as Record<string, string>)[lang] || filtered[0].excerpt['en']}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <User className="w-3.5 h-3.5" />
                        {filtered[0].author}
                        {filtered[0].published_at && (
                          <>
                            <span>·</span>
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(filtered[0].published_at)}
                          </>
                        )}
                        <span>·</span>
                        <Clock className="w-3.5 h-3.5" />
                        {filtered[0].read_time_minutes} min read
                      </div>
                      <span className="text-forest-600 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        {t('blog', 'readMore')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Remaining posts */}
            {filtered.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.slice(1).map(post => {
                  const title = (post.title as Record<string, string>)[lang] || post.title['en'];
                  const excerpt = (post.excerpt as Record<string, string>)[lang] || post.excerpt['en'];
                  return (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {post.cover_image && (
                        <div className="aspect-video overflow-hidden">
                          <img src={post.cover_image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className="text-xs bg-cream-100 text-forest-600 px-2.5 py-0.5 rounded-full font-medium capitalize">{tag}</span>
                          ))}
                        </div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-forest-600 transition-colors leading-snug mb-2">{title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">{excerpt}</p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                          <span className="flex items-center gap-1">
                            {post.published_at && <>{formatDate(post.published_at)} · </>}
                            <Clock className="w-3 h-3" /> {post.read_time_minutes} min
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-500">{t('common', 'noResults')}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
