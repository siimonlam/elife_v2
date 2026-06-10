import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { BlogPost } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO, buildArticle, buildBreadcrumbs } from '../hooks/useSEO';

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const postExcerpt = post ? (post.excerpt as Record<string, string>)[lang] || (post.excerpt as Record<string, string>)['en'] : '';

  useSEO({
    title: post ? `${title} — ogelo` : 'Article — ogelo',
    description: postExcerpt || undefined,
    keywords: post?.tags.join(', '),
    lang,
    canonicalPath: `/blog/${slug}`,
    ogImage: post?.cover_image ?? undefined,
    type: 'article',
    structuredData: post ? [
      buildArticle({
        title,
        description: postExcerpt,
        image: post.cover_image ?? '/ogelo-banner.jpg',
        publishedAt: post.published_at ?? post.created_at,
        slug: post.slug,
        tags: post.tags,
      }),
      buildBreadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Blog', path: '/blog' },
        { name: title, path: `/blog/${slug}` },
      ]),
    ] : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const load = async () => {
      const { data } = await supabase.from('blog_posts_elife').select('*').eq('slug', slug).eq('published', true).maybeSingle();
      if (!data) { navigate('/blog'); return; }
      setPost(data);
      if (data.tags.length > 0) {
        const { data: rel } = await supabase.from('blog_posts_elife').select('*').neq('id', data.id).eq('published', true).limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    load();
  }, [slug, navigate]);

  if (loading) return <PageLoader />;
  if (!post) return null;

  const content = (post.content as Record<string, string>)[lang] || post.content['en'];
  const excerpt = (post.excerpt as Record<string, string>)[lang] || post.excerpt['en'];

  const formatDate = (d: string | null) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : lang, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero image */}
      {post.cover_image && (
        <div className="w-full h-[45vh] min-h-[280px] overflow-hidden">
          <img src={post.cover_image} alt={title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-forest-600 font-medium hover:text-forest-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('blog', 'backToBlog')}
        </Link>

        <article className="bg-white rounded-3xl shadow-sm p-8 sm:p-12 space-y-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs bg-forest-50 text-forest-600 px-3 py-1 rounded-full font-medium capitalize flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{title}</h1>

          {/* Excerpt */}
          <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-forest-300 pl-5">{excerpt}</p>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-400 py-4 border-y border-cream-200">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {post.author}</span>
            {post.published_at && (
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(post.published_at)}</span>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-sm sm:prose max-w-none prose-headings:font-serif prose-headings:text-gray-800 prose-p:text-gray-600 prose-p:leading-relaxed prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </article>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">{t('blog', 'relatedPosts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map(rp => {
                const rpTitle = (rp.title as Record<string, string>)[lang] || rp.title['en'];
                return (
                  <Link key={rp.id} to={`/blog/${rp.slug}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {rp.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={rp.cover_image} alt={rpTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-forest-600 transition-colors leading-snug">{rpTitle}</h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
