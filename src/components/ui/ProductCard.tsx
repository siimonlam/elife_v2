import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Leaf } from 'lucide-react';
import type { Product } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

export function ProductCard({ product }: ProductCardProps) {
  const { lang, t } = useLanguage();
  const { addItem } = useCart();

  const name = (product.name as Record<string, string>)[lang] || product.name['en'];
  const image = product.images[0] || 'https://images.pexels.com/photos/3933025/pexels-photo-3933025.jpeg?auto=compress&cs=tinysrgb&w=600';
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const inStock = product.stock > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image,
      quantity: 1,
      slug: product.slug,
    });
  };

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-cream-100 aspect-square mb-4">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />

        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new && (
            <span className="bg-terracotta-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {t('product', 'newArrival')}
            </span>
          )}
          {isOnSale && (
            <span className="bg-forest-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {t('product', 'sale')}
            </span>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-sm font-semibold px-4 py-2 rounded-full border border-gray-200">
              {t('product', 'soldOut')}
            </span>
          </div>
        )}

        {inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-white text-forest-600 w-10 h-10 rounded-full flex items-center justify-center shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-forest-500 hover:text-white"
            aria-label={t('product', 'addToCart')}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-1">
        {product.brand && (
          <p className="text-xs text-forest-500 font-medium uppercase tracking-wider">{product.brand}</p>
        )}
        <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-forest-600 transition-colors line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">€{product.price.toFixed(2)}</span>
          {isOnSale && (
            <span className="text-sm text-gray-400 line-through">€{product.compare_price!.toFixed(2)}</span>
          )}
        </div>
        {product.age_range && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Leaf className="w-3 h-3 text-forest-400" />
            {product.age_range}
          </div>
        )}
      </div>
    </Link>
  );
}
