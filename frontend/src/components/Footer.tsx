import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Droplets, ArrowRight, Truck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer id="contact" className="bg-[#FAFAFA] border-t border-neutral-200 text-neutral-600 mt-20">
      {/* Trust Badges */}
      <div className="border-b border-neutral-200 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Droplets className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">{t('pureConcentration')}</h4>
              <p className="text-[11px] text-neutral-500">{t('pureConcentrationSub')}</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">{t('masterPerfumers')}</h4>
              <p className="text-[11px] text-neutral-500">{t('masterPerfumersSub')}</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Shield className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">{t('authenticBadge')}</h4>
              <p className="text-[11px] text-neutral-500">{t('authenticBadgeSub')}</p>
            </div>

            <div className="flex flex-col items-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900">
                <Truck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-900">{t('freeDelivery')}</h4>
              <p className="text-[11px] text-neutral-500">{t('freeDeliverySub')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-neutral-300 bg-white p-0.5">
                <img
                  src="/logo.jpg"
                  alt="SWILA PARFUM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-serif text-xl tracking-[0.16em] text-black font-semibold">
                  SWILA
                </span>
                <span className="text-[9px] tracking-[0.32em] uppercase text-neutral-500 font-sans -mt-0.5 font-medium">
                  PARFUM PARIS
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm font-sans">
              {t('footerStory')}
            </p>
            <div className="text-xs text-neutral-700 font-mono">
              7 Place Vendôme, 75001 Paris, France
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
              Collections
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop?category=oud" className="text-neutral-500 hover:text-black transition-colors">{t('bakhourOud')}</Link></li>
              <li><Link to="/shop?category=floral" className="text-neutral-500 hover:text-black transition-colors">{t('womenPerfumes')}</Link></li>
              <li><Link to="/shop?category=woody" className="text-neutral-500 hover:text-black transition-colors">{t('menPerfumes')}</Link></li>
              <li><Link to="/shop?category=gourmand" className="text-neutral-500 hover:text-black transition-colors">{t('designerPerfumes')}</Link></li>
            </ul>
          </div>

          {/* Account & Service */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/orders" className="text-neutral-500 hover:text-black transition-colors">{t('myOrders')}</Link></li>
              <li><Link to="/shop" className="text-neutral-500 hover:text-black transition-colors">{t('fullCatalog')}</Link></li>
              <li><Link to="/login" className="text-neutral-500 hover:text-black transition-colors">{t('clientAccount')}</Link></li>
              <li><Link to="/admin" className="text-neutral-500 hover:text-black transition-colors">{t('adminDashboard')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-3 space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-widest text-neutral-900">
              {t('newsletterTitle')}
            </h5>
            <p className="text-xs text-neutral-500">
              {t('newsletterDesc')}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-neutral-300 focus:outline-none focus:border-black placeholder-neutral-400"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg bg-black text-white hover:bg-neutral-800 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} SWILA PARFUM. {t('rightsReserved')}</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <span className="hover:text-black cursor-pointer">Privacy Policy</span>
            <span className="hover:text-black cursor-pointer">Terms of Service</span>
            <span className="hover:text-black cursor-pointer">Authenticity Certificate</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
