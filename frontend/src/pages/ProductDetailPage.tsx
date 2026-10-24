import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  ArrowLeft,
  Share2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { FragrancePyramid } from '../components/FragrancePyramid';
import { LowStockBadge } from '../components/LowStockBadge';
import { ProductCard } from '../components/ProductCard';
import { QuickOrderModal } from '../components/QuickOrderModal';
import { WhatsAppIcon } from '../components/WhatsAppButton';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t, language } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [quickOrderOpen, setQuickOrderOpen] = useState<boolean>(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setQuantity(1);
    api
      .getProductById(id)
      .then((data) => {
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts);
      })
      .catch((err) => {
        console.error('Error fetching product details:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-neutral-200 rounded" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[4/5] bg-neutral-200 rounded" />
            <div className="space-y-6">
              <div className="h-10 w-3/4 bg-neutral-200 rounded" />
              <div className="h-6 w-1/4 bg-neutral-200 rounded" />
              <div className="h-32 bg-neutral-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">{t('noPerfumesMatch')}</h2>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
        >
          {t('backToCatalog')}
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.stock_quantity <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs text-neutral-600 hover:text-black transition-colors uppercase tracking-wider font-medium"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{t('backToCatalog')}</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-neutral-200 text-xs text-neutral-600 hover:text-black transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? t('linkCopied') : t('shareCreation')}</span>
        </button>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: High-res Bottle Image */}
        <div className="lg:col-span-6 relative">
          <div className="rounded-lg overflow-hidden border border-neutral-200 bg-neutral-50 p-2">
            <div className="relative aspect-[4/5] rounded overflow-hidden bg-white">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              {/* Volume & Category overlay badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {product.category && (
                  <span className="px-2.5 py-1 rounded text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-neutral-900 border border-neutral-200 shadow-sm">
                    {product.category.name}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded text-[11px] font-mono bg-white/90 text-neutral-700 border border-neutral-200 shadow-sm">
                  {product.volume_ml} ml
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Details & Buying Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-medium">
                {product.brand}
              </span>
              <LowStockBadge stock={product.stock_quantity} />
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 mt-1">
              {product.name}
            </h1>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl font-bold text-neutral-900 font-mono">
                {product.price.toFixed(2)} MAD
              </span>
              <span className="text-xs text-neutral-500 font-mono">
                {t('taxIncluded')}
              </span>
            </div>
          </div>

          <div className="border-t border-neutral-200" />

          {/* Description */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
              {t('pureExtrait')}
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed font-sans">
              {product.description}
            </p>
          </div>

          {/* Olfactory Fragrance Pyramid Breakdown */}
          <FragrancePyramid
            topNotes={product.top_notes}
            heartNotes={product.heart_notes}
            baseNotes={product.base_notes}
          />

          {/* Purchasing Controls: Buy Now & Add to Cart */}
          <div className="space-y-3 pt-4">
            {/* Row 1: Quantity selector + Add to Cart Button */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Quantity selector */}
              <div className="flex items-center justify-between sm:justify-start border border-neutral-300 rounded-lg p-1 bg-white w-full sm:w-auto">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="p-2 text-neutral-600 hover:text-black disabled:opacity-30"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-mono font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))}
                  disabled={quantity >= product.stock_quantity || isOutOfStock}
                  className="p-2 text-neutral-600 hover:text-black disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart button */}
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 border border-black transition-colors ${
                  isOutOfStock
                    ? 'bg-neutral-200 border-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-neutral-800'
                }`}
              >
                <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
                <span>{isOutOfStock ? t('soldOut') : t('addToCart')}</span>
              </button>
            </div>

            {/* Row 2: BUY NOW (ACHETER MAINTENANT) Button -> Opens Quick Order Modal */}
            <button
              onClick={() => setQuickOrderOpen(true)}
              disabled={isOutOfStock}
              className={`w-full py-4 px-6 rounded-lg text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md transition-all duration-150 ${
                isOutOfStock
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                  : 'bg-[#22C55E] hover:bg-[#16A34A] active:scale-[0.99] text-white cursor-pointer'
              }`}
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
              <span>
                {language === 'ar'
                  ? `اشتري الآن - ${(product.price * quantity).toFixed(2)} درهم`
                  : language === 'fr'
                  ? `ACHETER MAINTENANT - ${(product.price * quantity).toFixed(2)} MAD`
                  : `BUY NOW - ${(product.price * quantity).toFixed(2)} MAD`}
              </span>
            </button>

            {/* Row 3: WhatsApp Direct Order option */}
            <a
              href={`https://wa.me/212600000000?text=${encodeURIComponent(
                `Bonjour SWILA PARFUM, je souhaite commander:\n- Parfum: ${product.name}\n- Volume: ${product.volume_ml}ml\n- Quantité: ${quantity}\n- Prix: ${(product.price * quantity).toFixed(2)} MAD`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-lg border border-[#25D366]/40 hover:border-[#25D366] bg-emerald-50/50 hover:bg-emerald-50 text-[#128C7E] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>{t('whatsappOrder')}</span>
            </a>

            {/* Service & Delivery assurances */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-neutral-200 text-xs text-neutral-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>{t('expressCourier')}</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>{t('authenticGuaranteed')}</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>{t('sampleIncluded')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Creations */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-12 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-900">
              {t('youMayAlsoLike')}
            </h2>
            <Link
              to="/shop"
              className="text-xs text-neutral-900 hover:text-neutral-500 tracking-wider uppercase font-semibold"
            >
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
      {/* Quick Order Modal matching user reference */}
      <QuickOrderModal
        isOpen={quickOrderOpen}
        onClose={() => setQuickOrderOpen(false)}
        product={product}
        quantity={quantity}
      />
    </div>
  );
};
