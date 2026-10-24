import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Crown, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
    setLoading(true);

    try {
      await login(userEmail, userPass);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Quick login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-normal text-neutral-900">
          {t('loginTitle')}
        </h1>
        <p className="text-xs text-neutral-500">
          {t('loginSubtitle')}
        </p>
      </div>

      {/* Quick Demo Credentials Helpers */}
      <div className="rounded-lg p-4 space-y-2.5 border border-neutral-200 bg-[#FAFAFA]">
        <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block font-semibold">
          {t('quickDemoLogin')}
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@auraparfums.com', 'AdminPassword123!')}
            className="p-2.5 rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-left transition-colors"
          >
            <div className="flex items-center gap-1.5 text-black font-semibold text-xs">
              <Crown className="w-3.5 h-3.5" />
              <span>{t('adminAtelier')}</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5 truncate font-medium">
              admin@auraparfums.com
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('vip@auraparfums.com', 'CustomerPass123!')}
            className="p-2.5 rounded bg-white hover:bg-neutral-100 border border-neutral-200 text-left transition-colors"
          >
            <div className="flex items-center gap-1.5 text-black font-semibold text-xs">
              <User className="w-3.5 h-3.5" />
              <span>{t('vipCustomer')}</span>
            </div>
            <span className="text-[10px] text-neutral-500 block mt-0.5 truncate font-medium">
              vip@auraparfums.com
            </span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-lg p-7 space-y-5 border border-neutral-200 bg-white shadow-sm">
        {error && (
          <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              {t('emailAddress')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 rtl:right-3 rtl:left-auto" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domaine.com"
                className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              {t('password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 rtl:right-3 rtl:left-auto" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 rtl:pr-9 rtl:pl-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{loading ? '...' : t('signIn')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          <span>{t('noAccountYet')}{' '}</span>
          <Link to="/register" className="text-black hover:underline font-semibold">
            {t('register')}
          </Link>
        </div>
      </div>
    </div>
  );
};
