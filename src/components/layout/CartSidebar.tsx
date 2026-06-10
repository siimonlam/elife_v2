import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function CartSidebar() {
  const { items, removeItem, updateQuantity, subtotal, isOpen, closeCart, itemCount } = useCart();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const shippingCost = subtotal >= 80 ? 0 : subtotal > 0 ? 5.95 : 0;
  const total = subtotal + shippingCost;

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={closeCart}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-forest-500" />
            <h2 className="font-semibold text-lg text-gray-900">{t('cart', 'title')}</h2>
            {itemCount > 0 && (
              <span className="bg-forest-100 text-forest-700 text-xs font-bold px-2 py-0.5 rounded-full">{itemCount}</span>
            )}
          </div>
          <button onClick={closeCart} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-cream-400" />
              </div>
              <div>
                <p className="font-medium text-gray-700">{t('cart', 'empty')}</p>
                <p className="text-sm text-gray-400 mt-1">{t('cart', 'emptyDescription')}</p>
              </div>
              <button
                onClick={() => { closeCart(); navigate('/products'); }}
                className="mt-2 px-6 py-2.5 bg-forest-500 text-white text-sm font-semibold rounded-xl hover:bg-forest-600 transition-colors"
              >
                {t('cart', 'continueShopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => {
                const name = (item.name as Record<string, string>)[lang] || item.name['en'];
                return (
                  <div key={item.id} className="flex gap-4 py-4 border-b border-cream-100 last:border-0">
                    <Link to={`/products/${item.slug}`} onClick={closeCart} className="w-20 h-20 rounded-xl overflow-hidden bg-cream-100 flex-shrink-0">
                      <img src={item.image} alt={name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0 space-y-1">
                      <Link to={`/products/${item.slug}`} onClick={closeCart} className="text-sm font-semibold text-gray-900 leading-snug hover:text-forest-600 transition-colors line-clamp-2">
                        {name}
                      </Link>
                      <p className="text-sm font-bold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                      <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-2 bg-cream-100 rounded-lg px-1 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-forest-600 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-600 hover:text-forest-600 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-cream-200 space-y-4">
            {subtotal < 80 && (
              <div className="bg-forest-50 rounded-xl px-4 py-2.5 text-xs text-forest-700 font-medium flex items-center justify-between">
                <span>{t('cart', 'freeShipping')}</span>
                <span className="font-bold">€{(80 - subtotal).toFixed(2)} away</span>
              </div>
            )}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>{t('cart', 'subtotal')}</span>
                <span className="font-semibold text-gray-900">€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('cart', 'shipping')}</span>
                <span className="font-semibold text-gray-900">{shippingCost === 0 ? 'Free' : `€${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base text-gray-900 pt-2 border-t border-cream-200">
                <span>{t('cart', 'total')}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={() => { closeCart(); navigate('/checkout'); }}
              className="w-full bg-forest-500 hover:bg-forest-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
            >
              {t('cart', 'checkout')}
            </button>
            <button
              onClick={() => { closeCart(); navigate('/cart'); }}
              className="w-full border border-cream-300 text-gray-700 hover:bg-cream-100 font-medium py-2.5 rounded-xl transition-colors text-sm"
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
