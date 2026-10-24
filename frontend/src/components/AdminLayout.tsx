import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  ExternalLink,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actions,
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Dashboard Overview',
      icon: LayoutDashboard,
      path: '/admin',
    },
    {
      label: 'Perfume Inventory',
      icon: Package,
      path: '/admin/products',
    },
    {
      label: 'Customer Orders',
      icon: ShoppingBag,
      path: '/admin/orders',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFB] text-neutral-900 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-neutral-200">
            <Link to="/" className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-neutral-300 bg-white p-0.5 shrink-0">
                <img
                  src="/logo.jpg"
                  alt="SWILA PARFUM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-[0.16em] text-black font-semibold">
                  SWILA
                </span>
                <span className="text-[9px] tracking-[0.25em] uppercase text-neutral-500 font-sans font-medium">
                  ADMIN ATELIER
                </span>
              </div>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3 py-2.5 rounded text-xs tracking-wider transition-colors ${
                    active
                      ? 'bg-black text-white font-semibold'
                      : 'text-neutral-600 hover:text-black hover:bg-neutral-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                    <span>{item.label}</span>
                  </div>
                  {active && <ChevronRight className="w-3.5 h-3.5 text-white" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-neutral-200 space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded text-xs text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </div>
          </Link>

          <div className="p-2.5 rounded bg-neutral-100 flex items-center justify-between">
            <div className="truncate pr-2">
              <span className="block text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Signed In Admin</span>
              <span className="block text-xs font-semibold text-neutral-900 truncate">
                {user?.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1 rounded text-neutral-500 hover:text-red-600 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="px-8 py-5 border-b border-neutral-200 bg-white sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-neutral-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        {/* Page Body */}
        <div className="p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
