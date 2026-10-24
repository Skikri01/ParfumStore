import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { LowStockBadge } from './LowStockBadge';
import { useLanguage } from '../context/LanguageContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="group bg-white rounded-lg border border-neutral-200 overflow-hidden flex flex-col transition-all duration-300 hover:border-neutral-400 hover:shadow-sm">
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top category & volume badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          {product.category && (
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-white/95 text-neutral-800 border border-neutral-200 shadow-sm">
              {product.category.name}
            </span>
          )}
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/90 text-neutral-600 border border-neutral-200 shadow-sm">
            {product.volume_ml} ml
          </span>
        </div>

        {/* Hover Quick Actions */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200">
          <Link
            to={`/product/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-white hover:bg-black hover:text-white text-black border border-neutral-300 text-xs font-medium transition-colors shadow-sm"
          >
            <Eye className="w-3.5 h-3.5" />
            {t('discover')}
          </Link>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
            className={`p-2 rounded border transition-colors shadow-sm ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                : 'bg-black hover:bg-neutral-800 text-white border-black'
            }`}
            title={isOutOfStock ? t('soldOut') : t('addToCart')}
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Content details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-medium">
            {product.brand}
          </span>
          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-semibold text-neutral-900 hover:text-neutral-600 transition-colors line-clamp-1 mt-0.5">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-neutral-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Notes preview */}
        <div className="pt-2 border-t border-neutral-100">
          <p className="text-[11px] text-neutral-500 line-clamp-1">
            <span className="text-neutral-900 font-medium">Notes:</span> {product.top_notes}
          </p>
        </div>

        {/* Price & Stock info */}
        <div className="pt-2 flex items-center justify-between">
          <div>
            <span className="text-sm sm:text-base font-bold text-neutral-900 font-mono">
              {product.price.toFixed(2)} MAD
            </span>
          </div>
          <LowStockBadge stock={product.stock_quantity} />
        </div>
      </div>
    </div>
  );
};
