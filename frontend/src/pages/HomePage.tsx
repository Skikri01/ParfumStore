import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
} from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ sort: 'newest' }),
          api.getCategories(),
        ]);
        setFeaturedProducts(prodRes.products.slice(0, 4));
        setCategories(catRes.categories);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-20">
      {/* Hero Section: Features Official SWILA PARFUM Logo at the top of Home */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-100">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=2000&q=85")',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />

        {/* Content with Brand Logo */}
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 z-10 py-16">
          {/* Official SWILA SL Perfume Logo Badge at top of Home */}
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-white p-2 border border-neutral-300 shadow-md transform hover:scale-105 transition-transform duration-300">
              <img
                src="/logo.jpg"
                alt="SWILA PARFUM Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-[11px] font-medium tracking-[0.28em] uppercase text-neutral-500 block">
              {t('heroSubtitle')}
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-neutral-900 tracking-tight leading-[1.15]">
            {t('heroTitle')}
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-600 font-normal leading-relaxed">
            {t('heroDescription')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-black text-white font-medium text-xs tracking-widest uppercase hover:bg-neutral-800 transition-colors shadow-sm"
            >
              {t('exploreCollection')}
            </Link>
            <Link
              to="/shop?category=oud"
              className="w-full sm:w-auto px-8 py-3.5 rounded bg-white text-black hover:bg-neutral-50 text-xs font-medium tracking-widest uppercase transition-colors border border-neutral-300"
            >
              {t('bakhourSeries')}
            </Link>
          </div>
        </div>
      </section>

      {/* Fragrance Families / Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              {t('olfactoryUniverses')}
            </span>
            <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900 mt-0.5">
              {t('fragranceFamilies')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs text-neutral-900 hover:text-neutral-500 tracking-wider uppercase font-semibold flex items-center gap-1"
          >
            <span>{t('viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group p-4 text-center rounded border border-neutral-200 bg-white hover:border-black transition-colors"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-900 group-hover:text-neutral-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider font-mono">
                {cat._count?.products || 0} Flacons
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Masterpieces */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400">
              {t('exclusiveSelection')}
            </span>
            <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-900 mt-0.5">
              {t('bestSellers')}
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs text-neutral-900 hover:text-neutral-500 tracking-wider uppercase font-semibold flex items-center gap-1"
          >
            <span>{t('fullCatalog')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 rounded bg-neutral-100 animate-pulse border border-neutral-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Heritage & Craftsmanship Spotlight */}
      <section id="heritage" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg overflow-hidden border border-neutral-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-5">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-neutral-400 font-semibold">
                {t('craftsmanshipSubtitle')}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 leading-snug">
                {t('craftsmanshipTitle')}
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {t('craftsmanshipDesc')}
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>{t('craftsmanshipBullet1')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>{t('craftsmanshipBullet2')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-neutral-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-black" />
                  <span>{t('craftsmanshipBullet3')}</span>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded bg-black text-white text-xs font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors"
                >
                  <span>{t('exploreCollection')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative aspect-square sm:aspect-[4/3] lg:aspect-auto h-full min-h-[350px]">
              <img
                src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85"
                alt="SWILA Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
