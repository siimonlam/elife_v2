import { useEffect } from 'react';
import type { Lang } from '../types';
import { useSEOOverride } from '../context/SEOContext';

const SITE_NAME = 'ogelo';
const SITE_URL = 'https://www.ogelo-toy.com';

const LOCALE_MAP: Record<Lang, string> = {
  en: 'en_US',
  de: 'de_DE',
  it: 'it_IT',
  fr: 'fr_FR',
};

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  lang?: Lang;
  canonicalPath?: string;
  ogImage?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object | object[];
}

export function useSEO({
  title,
  description,
  keywords,
  lang = 'en',
  canonicalPath,
  ogImage,
  type = 'website',
  structuredData,
}: SEOProps) {
  const override = useSEOOverride(canonicalPath ?? '', lang);

  useEffect(() => {
    // DB overrides take priority over props
    const resolvedTitle = override?.title || title;
    const resolvedDesc = override?.description || description;
    const resolvedKeywords = override?.keywords || keywords;
    const resolvedImage = override?.og_image || ogImage;

    document.title = resolvedTitle;
    document.documentElement.lang = lang;

    const setMeta = (name: string, content: string, prop = false) => {
      const attr = prop ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const canonicalUrl = `${SITE_URL}${canonicalPath ?? '/'}`;

    if (resolvedDesc) {
      setMeta('description', resolvedDesc);
      setMeta('og:description', resolvedDesc, true);
      setMeta('twitter:description', resolvedDesc);
    }
    if (resolvedKeywords) setMeta('keywords', resolvedKeywords);

    setMeta('og:title', resolvedTitle, true);
    setMeta('og:type', type, true);
    setMeta('og:locale', LOCALE_MAP[lang], true);
    setMeta('og:site_name', SITE_NAME, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('twitter:title', resolvedTitle);
    setMeta('twitter:card', 'summary_large_image');

    // robots: respect no_index override
    if (override?.no_index) {
      setMeta('robots', 'noindex, nofollow');
    } else {
      setMeta('robots', 'index, follow');
    }

    const image = resolvedImage ?? '/ogelo-banner.jpg';
    const absoluteImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;
    setMeta('og:image', absoluteImage, true);
    setMeta('og:image:width', '1200', true);
    setMeta('og:image:height', '630', true);
    setMeta('twitter:image', absoluteImage);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // hreflang alternate links
    const langs: Lang[] = ['en', 'de', 'it', 'fr'];
    langs.forEach(l => {
      const selector = `link[hreflang="${l}"]`;
      let el = document.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = 'alternate';
        el.hreflang = l;
        document.head.appendChild(el);
      }
      el.href = `${SITE_URL}${canonicalPath ?? '/'}`;
    });

    // x-default hreflang
    let xDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement | null;
    if (!xDefault) {
      xDefault = document.createElement('link');
      xDefault.rel = 'alternate';
      xDefault.setAttribute('hreflang', 'x-default');
      document.head.appendChild(xDefault);
    }
    xDefault.href = `${SITE_URL}${canonicalPath ?? '/'}`;

    // JSON-LD structured data
    const existingScript = document.querySelector('script[data-seo="structured-data"]');
    if (existingScript) existingScript.remove();
    if (structuredData) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-seo', 'structured-data');
      const payload = Array.isArray(structuredData) ? structuredData : [structuredData];
      script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': payload });
      document.head.appendChild(script);
    }
  }, [title, description, keywords, lang, canonicalPath, ogImage, type, structuredData, override]);
}

// Helpers for building common structured data objects
export const buildOrganization = () => ({
  '@type': 'Organization',
  name: 'ogelo',
  url: SITE_URL,
  logo: `${SITE_URL}/ogelo-logo.jpg`,
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@ogelo-toy.com',
    contactType: 'customer service',
    availableLanguage: ['English', 'German', 'Italian', 'French'],
  },
});

export const buildWebsite = () => ({
  '@type': 'WebSite',
  name: 'ogelo',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/products?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

export const buildBreadcrumbs = (items: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE_URL}${item.path}`,
  })),
});

export const buildProduct = (opts: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku?: string;
  brand?: string;
  availability?: 'InStock' | 'OutOfStock';
}) => ({
  '@type': 'Product',
  name: opts.name,
  description: opts.description,
  image: opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}`,
  sku: opts.sku,
  brand: { '@type': 'Brand', name: opts.brand ?? 'ogelo' },
  offers: {
    '@type': 'Offer',
    price: opts.price.toFixed(2),
    priceCurrency: opts.currency ?? 'EUR',
    availability: `https://schema.org/${opts.availability ?? 'InStock'}`,
    url: `${SITE_URL}/products`,
    seller: { '@type': 'Organization', name: 'ogelo' },
  },
});

export const buildArticle = (opts: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  slug: string;
  tags?: string[];
}) => ({
  '@type': 'Article',
  headline: opts.title,
  description: opts.description,
  image: opts.image.startsWith('http') ? opts.image : `${SITE_URL}${opts.image}`,
  datePublished: opts.publishedAt,
  url: `${SITE_URL}/blog/${opts.slug}`,
  keywords: opts.tags?.join(', '),
  publisher: {
    '@type': 'Organization',
    name: 'ogelo',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/ogelo-logo.jpg` },
  },
  author: { '@type': 'Organization', name: 'ogelo' },
});
