import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  Filter,
  X,
} from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const ShopPage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const volumeParam = searchParams.get('volume') || 'all';
  const [priceRange, setPriceRange] = useState<number>(1000);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch categories once
  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.categories)).catch(console.error);
  }, []);

  // Fetch products whenever params change
  useEffect(() => {
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const { products } = await api.getProducts({
          category: categoryParam !== 'all' ? categoryParam : undefined,
          search: searchParam || undefined,
          maxPrice: priceRange,
          volume: volumeParam !== 'all' ? volumeParam : undefined,
          sort: sortParam,
        });
        setProducts(products);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiltered();
  }, [categoryParam, searchParam, sortParam, volumeParam, priceRange]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (!val || val === 'all') {
      next.delete(key);
    } else {
      next.set(key, val);
    }
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setPriceRange(1000);
  };

  const activeFiltersCount =
    (volumeParam !== 'all' ? 1 : 0) +
    (priceRange < 1000 ? 1 : 0);

  return (
    <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-neutral-900 tracking-tight">
          {t('catalogTitle')}
        </h1>
        <p className="text-xs text-neutral-500">
          {t('catalogSubtitle')}
        </p>
      </div>

      {/* Main Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between pb-4 border-b border-neutral-200">
        {/* Search input */}
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchParam}
            onChange={(e) => updateParam('search', e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black placeholder-neutral-400"
          />
          {searchParam && (
            <button
              onClick={() => updateParam('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 rounded border border-neutral-300 text-xs text-neutral-800"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{t('filters')} {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 hidden sm:inline">{t('sortBy')}:</span>
            <select
              value={sortParam}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="px-3 py-2 text-xs border border-neutral-300 rounded cursor-pointer bg-white text-neutral-900 focus:outline-none focus:border-black"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="price-asc">{t('sortPriceAsc')}</option>
              <option value="price-desc">{t('sortPriceDesc')}</option>
              <option value="name">{t('sortName')}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <aside className={`${mobileFilterOpen ? 'block' : 'hidden'} md:block space-y-6`}>
          <div className="rounded border border-neutral-200 p-5 space-y-5 bg-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-800" />
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  {t('filters')}
                </h3>
              </div>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-black transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t('resetFilters')}</span>
                </button>
              )}
            </div>

            {/* Flacon Volume filter */}
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">
                {t('bottleVolume')}
              </h4>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', '50', '100'].map((vol) => (
                  <button
                    key={vol}
                    onClick={() => updateParam('volume', vol)}
                    className={`py-1.5 text-xs rounded border text-center transition-colors ${
                      volumeParam === vol
                        ? 'bg-black text-white border-black font-semibold'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-400 bg-white'
                    }`}
                  >
                    {vol === 'all' ? t('allVolumes') : `${vol} ml`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Range Slider */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider">
                  {t('maxPrice')}
                </h4>
                <span className="font-bold text-xs text-neutral-900 font-mono">
                  {priceRange} MAD
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="1000"
                step="20"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-mono font-medium">
                <span>150 MAD</span>
                <span>1000 MAD</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-neutral-500 pb-2">
            <span>
              <strong className="text-neutral-900 font-semibold">{products.length}</strong> {t('perfumesAvailable')}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded bg-neutral-100 animate-pulse border border-neutral-200"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded border border-neutral-200 p-12 text-center space-y-3 bg-white">
              <h3 className="text-sm font-semibold text-neutral-900">
                {t('noPerfumesMatch')}
              </h3>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2 rounded bg-black text-white text-xs font-medium uppercase tracking-wider hover:bg-neutral-800 transition-colors"
              >
                {t('resetFiltersBtn')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
