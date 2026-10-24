import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Crown,
  Menu,
  X,
  LogOut,
  PackageCheck,
  Globe,
} from 'lucide-react';
import { WhatsAppIcon } from './WhatsAppButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage, Language } from '../context/LanguageContext';

export const Navbar: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Nav links: strictly Men's Perfumes, Women's Perfumes, Bakhour & Oud, About Us, Contact
  const navLinks = [
    { name: t('menPerfumes'), href: '/shop?category=men' },
    { name: t('womenPerfumes'), href: '/shop?category=women' },
    { name: t('bakhourOud'), href: '/shop?category=oud' },
    { name: t('aboutUs'), href: '/#heritage' },
    { name: t('contact'), href: '/#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      {/* 1. Top Bar: Announcement & Language Selector (French, Arabic, English) */}
      <div className="bg-[#111111] text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-[1520px] mx-auto flex items-center justify-between">
          <p className="hidden md:block tracking-wider uppercase font-medium text-neutral-300">
            {t('topAnnouncement')}
          </p>

          <div className="flex items-center gap-4 ml-auto">
            {/* WhatsApp Support Link in Top Bar */}
            <a
              href="https://wa.me/212600000000?text=Bonjour%20SWILA%20PARFUM%2C%20je%20souhaite%20des%20informations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-[11px] font-semibold transition-colors shadow-sm"
              title="WhatsApp VIP Concierge"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-neutral-400 text-[10px] uppercase font-mono hidden sm:inline">
                {t('selectLanguage')}:
              </span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-neutral-900 text-white text-[11px] font-medium border border-neutral-700 rounded px-2 py-0.5 cursor-pointer focus:outline-none focus:border-white transition-colors"
              >
                <option value="en">English (US)</option>
                <option value="fr">Français (FR)</option>
                <option value="ar">العربية (AR)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-neutral-900 hover:text-neutral-600 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Left Brand Logo: Includes newly uploaded logo image + name "SWILA PARFUM" */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 text-left group">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-neutral-300 bg-neutral-50 flex items-center justify-center p-0.5 shadow-sm group-hover:scale-105 transition-transform shrink-0">
                <img
                  src="/logo.jpg"
                  alt="SWILA PARFUM Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl tracking-[0.16em] text-black font-semibold leading-tight group-hover:opacity-80 transition-opacity">
                  SWILA
                </span>
                <span className="text-[9px] tracking-[0.32em] uppercase text-neutral-600 font-sans -mt-0.5 font-medium">
                  PARFUM PARIS
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 xl:space-x-10">
            {navLinks.map((link) => {
              const active = location.pathname + location.search === link.href;
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`text-[11px] font-medium uppercase tracking-[0.08em] transition-colors whitespace-nowrap ${
                    active
                      ? 'text-black border-b border-black pb-0.5 font-bold'
                      : 'text-neutral-800 hover:text-neutral-500'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons: Search, Shopping Bag, User Menu */}
          <div className="flex items-center space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 text-black hover:text-neutral-500 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>

            {/* Shopping Bag Icon with subtle badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 text-black hover:text-neutral-500 transition-colors"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black text-white text-[9px] font-bold flex items-center justify-center font-mono">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User / Account Menu */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="p-1.5 text-black hover:text-neutral-500 transition-colors flex items-center"
                aria-label="Account"
              >
                {user ? (
                  <div className="w-6 h-6 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                    {user.email[0].toUpperCase()}
                  </div>
                ) : (
                  <UserIcon className="w-5 h-5 stroke-[1.5]" />
                )}
              </button>

              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <p className="text-[11px] text-neutral-500">{t('clientAccount')}</p>
                        <p className="text-xs font-semibold text-neutral-900 truncate mt-0.5">
                          {user.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-neutral-100 text-neutral-800 font-semibold">
                          {user.role}
                        </span>
                      </div>

                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-neutral-700 hover:text-black hover:bg-neutral-50 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4" />
                        <span>{t('myOrders')}</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-black font-semibold hover:bg-neutral-50 transition-colors"
                        >
                          <Crown className="w-4 h-4" />
                          <span>{t('adminDashboard')}</span>
                        </Link>
                      )}

                      <div className="border-t border-neutral-100 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('signOut')}</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2 space-y-1">
                      <Link
                        to="/login"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full py-2 px-3 text-center rounded-lg bg-black text-white text-xs font-medium hover:bg-neutral-800 transition-colors"
                      >
                        {t('signIn')}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block w-full py-2 px-3 text-center rounded-lg text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-colors"
                      >
                        {t('register')}
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Minimal Expandable Search Bar */}
        {searchOpen && (
          <div className="py-3 border-t border-neutral-100 animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto flex items-center">
              <Search className="absolute left-3 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                autoFocus
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-20 py-2 text-xs border border-neutral-300 rounded-full focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1 bg-black text-white text-xs font-medium rounded-full hover:bg-neutral-800"
              >
                {t('searchBtn')}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-6 py-5 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs text-neutral-900 hover:text-black uppercase tracking-wider font-medium border-b border-neutral-100 last:border-none"
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-xs text-black font-bold uppercase tracking-wider"
            >
              {t('adminDashboard')}
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
