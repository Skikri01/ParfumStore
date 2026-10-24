import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalItemsCount,
  } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-neutral-200 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-neutral-900 stroke-[1.5]" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {t('yourCart')} ({totalItemsCount})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <ShoppingBag className="w-10 h-10 text-neutral-300 stroke-[1.5]" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">{t('cartEmpty')}</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-xs">
                    {t('cartEmptySubtitle')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-4 px-6 py-2.5 rounded bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                >
                  {t('explorePerfumes')}
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-lg border border-neutral-200 bg-white"
                >
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-20 object-cover rounded border border-neutral-100 bg-neutral-50"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                            {product.name}
                          </h4>
                          <span className="text-[11px] text-neutral-400">
                            {product.volume_ml} ml
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 border border-neutral-200 rounded px-1.5 py-0.5">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-0.5 text-neutral-600 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-medium px-1 text-neutral-900">
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          className="p-0.5 text-neutral-600 hover:text-black disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-bold text-neutral-900 text-xs font-mono">
                        {(product.price * quantity).toFixed(2)} MAD
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-[#FAFAFA] space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{t('subtotal')}</span>
                  <span className="font-semibold text-neutral-900 font-mono">{subtotal.toFixed(2)} MAD</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>{t('shipping')}</span>
                  <span className="text-neutral-900 font-medium">{t('complimentary')}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-neutral-200 text-sm">
                  <span className="font-bold text-neutral-900">{t('total')}</span>
                  <span className="font-bold text-base text-neutral-900 font-mono">
                    {subtotal.toFixed(2)} MAD
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3 px-5 rounded bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('checkout')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('securePayment')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
