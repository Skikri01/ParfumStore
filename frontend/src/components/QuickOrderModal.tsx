import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  MapPin,
  ShoppingBag,
  CheckCircle,
  Truck,
} from 'lucide-react';
import { Product } from '../types';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { WhatsAppIcon } from './WhatsAppButton';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
}

const MOROCCAN_CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Tanger',
  'Fès',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Safi',
  'Mohammédia',
  'El Jadida',
  'Nador',
  'Béni Mellal',
  'Autre Ville / Other City',
];

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  product,
  quantity,
}) => {
  const { t, language } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [createdOrderRef, setCreatedOrderRef] = useState<string>('');

  if (!isOpen) return null;

  // Calculate pricing in Moroccan MAD
  const priceInMad = (product.price * quantity).toFixed(2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      setError(
        language === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة'
          : language === 'fr'
          ? 'Veuillez remplir tous les champs obligatoires'
          : 'Please complete all required fields'
      );
      return;
    }

    setSubmitting(true);

    try {
      const fullShippingAddress = `${fullName} • ${phone} • ${address}, ${city}`;
      const res = await api.createOrder({
        shipping_address: fullShippingAddress,
        customer_name: fullName,
        customer_phone: phone,
        customer_city: city,
        items: [
          {
            product_id: product.id,
            quantity,
          },
        ],
      });

      setCreatedOrderRef(res.order.id);
      setOrderSuccess(true);
    } catch (err: any) {
      console.error('Order creation error:', err);
      setError(err.message || 'Impossible d\'enregistrer la commande. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppConfirmation = () => {
    const message = `Bonjour SWILA PARFUM, je viens de passer une commande express !\n- Référence: ${createdOrderRef}\n- Parfum: ${product.name} (${product.volume_ml}ml)\n- Quantité: ${quantity}\n- Total: ${priceInMad} MAD\n- Nom: ${fullName}\n- Tél: ${phone}\n- Ville: ${city}\n- Adresse: ${address}`;
    window.open(`https://wa.me/212600000000?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button at top-right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>

        {orderSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 stroke-[2]" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-neutral-900">
                {language === 'ar'
                  ? 'تم تأكيد طلبك بنجاح!'
                  : language === 'fr'
                  ? 'Merci pour votre commande !'
                  : 'Thank you for your order!'}
              </h3>
              <p className="text-xs text-neutral-600 max-w-sm mx-auto">
                {language === 'ar'
                  ? 'سيتصل بك فريقنا هاتفياً لتأكيد العنوان وموعد التسليم السريع.'
                  : language === 'fr'
                  ? 'Notre équipe vous contactera par téléphone pour confirmer la livraison express.'
                  : 'Our customer concierge will contact you by phone shortly to confirm delivery.'}
              </p>
              <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-800 rounded font-mono text-xs font-semibold mt-2">
                N° Commande: {createdOrderRef.slice(0, 12)}
              </div>
            </div>

            {/* Product summary pill */}
            <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center gap-3 text-left">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-12 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 truncate">
                  {product.name}
                </h4>
                <p className="text-[11px] text-neutral-500">
                  {product.volume_ml} ml • Qté: {quantity}
                </p>
                <p className="text-xs font-bold text-neutral-900 mt-0.5 font-mono">
                  {priceInMad} MAD
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={handleWhatsAppConfirmation}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>
                  {language === 'ar'
                    ? 'تأكيد الطلب فوراً عبر واتساب'
                    : language === 'fr'
                    ? 'Confirmer sur WhatsApp'
                    : 'Confirm via WhatsApp'}
                </span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : language === 'fr' ? 'Fermer' : 'Close'}
              </button>
            </div>
          </div>
        ) : (
          /* Order Form Matching Screenshot */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Header Title */}
            <div className="text-center pr-6 pl-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                {language === 'ar'
                  ? 'يرجى ملء الاستمارة للطلب'
                  : language === 'fr'
                  ? 'Veuillez remplir le formulaire pour commander'
                  : 'Please fill in the form to order'}
              </h2>
            </div>

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Row 1: Nom Complet */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <label className="sm:col-span-4 text-xs sm:text-sm font-bold text-neutral-900">
                  {t('fullName')}
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="sm:col-span-8 flex rounded-lg border border-neutral-300 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all bg-white">
                  <div className="w-12 bg-[#F3F4F6] border-r border-neutral-300 flex items-center justify-center text-neutral-700 shrink-0">
                    <User className="w-4 h-4 stroke-[2]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom Complet' : 'Full Name'}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Numéro De Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <label className="sm:col-span-4 text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1">
                  <span>{t('phoneNumber')}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="sm:col-span-8 flex rounded-lg border border-neutral-300 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all bg-white">
                  <div className="w-12 bg-[#F3F4F6] border-r border-neutral-300 flex items-center justify-center text-neutral-700 shrink-0">
                    <Phone className="w-4 h-4 stroke-[2]" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={language === 'ar' ? 'رقم الهاتف' : language === 'fr' ? 'Numéro De Téléphone' : 'Phone Number'}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 3: La Ville */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <label className="sm:col-span-4 text-xs sm:text-sm font-bold text-neutral-900">
                  {t('citySelect')}
                  <span className="text-red-500 font-bold ml-0.5">*</span>
                </label>
                <div className="sm:col-span-8 relative">
                  <select
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-neutral-900 rounded-lg border border-neutral-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all bg-white cursor-pointer appearance-none"
                  >
                    <option value="" disabled>
                      {language === 'ar' ? 'اختر المدينة' : language === 'fr' ? 'La Ville' : 'Select City'}
                    </option>
                    {MOROCCAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 4: Adresse De Livraison */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
                <label className="sm:col-span-4 text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-1">
                  <span>{t('deliveryAddress')}</span>
                  <span className="text-red-500 font-bold">*</span>
                </label>
                <div className="sm:col-span-8 flex rounded-lg border border-neutral-300 overflow-hidden focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all bg-white">
                  <div className="w-12 bg-[#F3F4F6] border-r border-neutral-300 flex items-center justify-center text-neutral-700 shrink-0">
                    <MapPin className="w-4 h-4 stroke-[2]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={language === 'ar' ? 'عنوان التوصيل' : language === 'fr' ? 'Adresse De Livraison' : 'Delivery Address'}
                    className="w-full px-3 py-2.5 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Brief Summary in the modal */}
              <div className="pt-2 pb-1 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                <span className="truncate max-w-[220px]">
                  {product.name} ({product.volume_ml}ml × {quantity})
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                  <Truck className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'توصيل مجاني' : 'Livraison Gratuite'}
                </span>
              </div>

              {/* Row 5: Big Green Button exactly like screenshot */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg transition-all duration-150 disabled:opacity-50 cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                <span>
                  {submitting
                    ? '...'
                    : language === 'ar'
                    ? `اشتري الآن - ${priceInMad} درهم`
                    : language === 'fr'
                    ? `ACHETER MAINTENANT - ${priceInMad} MAD`
                    : `BUY NOW - ${priceInMad} MAD`}
                </span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
