import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Button } from '../components/ui/Button';
import { useSEO } from '../hooks/useSEO';

export default function CartPage() {
  const { t, lang } = useLanguage();
  const { items, removeItem, updateQuantity, subtotal } = useCart();
  const navigate = useNavigate();

  useSEO({ title: t('seo', 'cartTitle'), lang, canonicalPath: '/cart' });

  const shippingCost = subtotal >= 80 ? 0 : subtotal > 0 ? 5.95 : 0;
  const tax = (subtotal + shippingCost) * 0.20;
  const total = subtotal + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-cream-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-cream-400" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 mb-3">{t('cart', 'empty')}</h1>
          <p className="text-gray-500 mb-8">{t('cart', 'emptyDescription')}</p>
          <Button onClick={() => navigate('/products')} size="lg">{t('cart', 'continueShopping')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6 flex items-center gap-1">
          <Link to="/" className="hover:text-forest-600">Home</Link>
          <span>/</span>
          <span className="text-gray-700">{t('cart', 'title')}</span>
        </nav>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 mb-10">{t('cart', 'title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const name = (item.name as Record<string, string>)[lang] || item.name['en'];
              return (
                <div key={item.id} className="bg-white rounded-2xl p-5 flex gap-5 shadow-sm">
                  <Link to={`/products/${item.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                    <img src={item.image} alt={name} className="w-full h-full object-cover" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/products/${item.slug}`} className="font-semibold text-gray-900 hover:text-forest-600 transition-colors leading-snug">{name}</Link>
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-2">€{(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-xs text-gray-400">€{item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex items-center border border-cream-300 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1.5 text-gray-600 hover:bg-cream-100 text-sm">−</button>
                        <span className="px-3 py-1.5 text-sm font-semibold border-x border-cream-300">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1.5 text-gray-600 hover:bg-cream-100 text-sm">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="pt-4">
              <Link to="/products" className="text-sm text-forest-600 font-medium hover:text-forest-700 flex items-center gap-1 transition-colors">
                ← {t('cart', 'continueShopping')}
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24 space-y-4">
              <h2 className="font-semibold text-lg text-gray-900">{t('checkout', 'orderSummary')}</h2>

              {subtotal < 80 && (
                <div className="bg-forest-50 rounded-xl p-3 text-xs text-forest-700">
                  {t('cart', 'freeShipping')} — add €{(80 - subtotal).toFixed(2)} more
                </div>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>{t('cart', 'subtotal')}</span>
                  <span className="font-semibold text-gray-900">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart', 'shipping')}</span>
                  <span className="font-semibold text-gray-900">{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('cart', 'tax')}</span>
                  <span className="font-semibold text-gray-900">€{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-cream-200">
                <span>{t('cart', 'total')}</span>
                <span>€{total.toFixed(2)}</span>
              </div>

              <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
                {t('cart', 'checkout')} <ArrowRight className="w-4 h-4 ml-1" />
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('checkout', 'secureCheckout')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
