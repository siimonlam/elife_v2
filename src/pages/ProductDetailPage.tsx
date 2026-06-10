import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Share2, Leaf, Package, Truck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ui/ProductCard';
import { Button } from '../components/ui/Button';
import { PageLoader } from '../components/ui/LoadingSpinner';
import { useSEO, buildProduct, buildBreadcrumbs } from '../hooks/useSEO';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, lang } = useLanguage();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productName = product ? (product.name as Record<string, string>)[lang] || (product.name as Record<string, string>)['en'] : '';
  const productDesc = product ? ((product.description as Record<string, string>)[lang] || (product.description as Record<string, string>)['en']).replace(/<[^>]+>/g, '').substring(0, 160) : '';

  useSEO({
    title: product ? `${productName} — ogelo` : 'Product — ogelo',
    description: productDesc || undefined,
    lang,
    canonicalPath: `/products/${slug}`,
    ogImage: product?.images[0],
    type: 'product',
    structuredData: product ? [
      buildProduct({
        name: productName,
        description: productDesc,
        image: product.images[0] ?? '',
        price: product.price,
        sku: product.sku ?? product.slug,
        availability: product.stock > 0 ? 'InStock' : 'OutOfStock',
      }),
      buildBreadcrumbs([
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/products' },
        { name: productName, path: `/products/${slug}` },
      ]),
    ] : undefined,
  });

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const load = async () => {
      const { data } = await supabase.from('products_elife').select('*, categories_elife(*)').eq('slug', slug).eq('is_active', true).maybeSingle();
      if (!data) { navigate('/products'); return; }
      setProduct(data);
      setSelectedImage(0);
      if (data.category_id) {
        const { data: rel } = await supabase.from('products_elife').select('*').eq('category_id', data.category_id).neq('id', data.id).eq('is_active', true).limit(4);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    load();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      quantity,
      slug: product.slug,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (loading) return <PageLoader />;
  if (!product) return null;

  const name = (product.name as Record<string, string>)[lang] || product.name['en'];
  const description = (product.description as Record<string, string>)[lang] || product.description['en'];
  const inStock = product.stock > 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const cat = product.categories as unknown as { name: string; name_translations: Record<string, string>; slug: string } | undefined;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-8 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-forest-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-forest-600 transition-colors">{t('nav', 'shop')}</Link>
          {cat && (
            <>
              <span>/</span>
              <Link to={`/products?category=${cat.slug}`} className="hover:text-forest-600 transition-colors">
                {cat.name_translations?.[lang] || cat.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-cream-100">
              <img
                src={product.images[selectedImage] || 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=800'}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-forest-500' : 'border-transparent hover:border-cream-400'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Brand & badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.brand && <span className="text-xs font-bold text-forest-500 uppercase tracking-widest">{product.brand}</span>}
              {product.is_new && <span className="bg-terracotta-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{t('product', 'newArrival')}</span>}
              {isOnSale && <span className="bg-forest-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">{t('product', 'sale')}</span>}
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{name}</h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
              {isOnSale && <span className="text-xl text-gray-400 line-through">€{product.compare_price!.toFixed(2)}</span>}
              {isOnSale && (
                <span className="bg-terracotta-100 text-terracotta-700 text-sm font-semibold px-3 py-1 rounded-full">
                  Save {Math.round((1 - product.price / product.compare_price!) * 100)}%
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={inStock ? 'text-green-700 font-medium' : 'text-red-600 font-medium'}>
                {inStock ? `${t('product', 'inStock')} (${product.stock})` : t('product', 'soldOut')}
              </span>
            </div>

            {/* Description */}
            <div
              className="text-gray-600 leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-800"
              dangerouslySetInnerHTML={{ __html: description }}
            />

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-cream-200">
              {product.age_range && (
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-forest-400" />
                  <span className="text-sm text-gray-600"><strong>{t('product', 'ageRange')}:</strong> {product.age_range}</span>
                </div>
              )}
              {product.sku && (
                <div className="text-sm text-gray-500">
                  <strong>{t('product', 'sku')}:</strong> {product.sku}
                </div>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {inStock && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">{t('product', 'quantity')}</label>
                  <div className="flex items-center border border-cream-300 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2.5 text-gray-600 hover:bg-cream-100 transition-colors text-lg font-medium">−</button>
                    <span className="px-5 py-2.5 text-sm font-semibold border-x border-cream-300 min-w-[52px] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="px-4 py-2.5 text-gray-600 hover:bg-cream-100 transition-colors text-lg font-medium">+</button>
                  </div>
                </div>
                <Button onClick={handleAddToCart} size="lg" fullWidth className={`${added ? 'bg-green-500 hover:bg-green-600' : ''}`}>
                  {added ? (
                    <><Check className="w-5 h-5" /> {t('product', 'addedToCart')}</>
                  ) : (
                    <><ShoppingCart className="w-5 h-5" /> {t('product', 'addToCart')}</>
                  )}
                </Button>
              </div>
            )}
            {!inStock && (
              <div className="w-full bg-cream-200 text-gray-500 font-semibold py-4 px-8 rounded-xl text-center">
                {t('product', 'soldOut')}
              </div>
            )}

            {/* Shipping info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { icon: Truck, text: lang === 'en' ? 'Free shipping over €80' : lang === 'de' ? 'Kostenlos ab 80€' : lang === 'it' ? 'Spedizione gratuita oltre €80' : 'Livraison gratuite dès €80' },
                { icon: Package, text: lang === 'en' ? 'Eco packaging' : lang === 'de' ? 'Öko-Verpackung' : lang === 'it' ? 'Imballaggio eco' : 'Emballage écologique' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 bg-cream-100 rounded-xl px-4 py-3">
                  <Icon className="w-4 h-4 text-forest-500 flex-shrink-0" />
                  <span className="text-xs font-medium text-gray-700">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="font-serif text-2xl font-bold text-gray-900 mb-8">{t('product', 'relatedProducts')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
