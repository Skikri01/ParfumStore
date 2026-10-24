import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const UserOrdersPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { orders } = await api.getUserOrders();
        setOrders(orders);
      } catch (err) {
        console.error('Failed to load user orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {t('statusPending')}
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-neutral-600" />
            {t('statusProcessing')}
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-300 animate-pulse">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            {t('statusShipped')}
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            {t('statusDelivered')}
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-800 border border-red-300">
            <XCircle className="w-3.5 h-3.5 text-red-600" />
            {t('statusCancelled')}
          </span>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-neutral-900 font-bold">{t('clientAccount')}</h2>
        <p className="text-xs text-neutral-600">{t('loginSubtitle')}</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider"
        >
          {t('signIn')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-500 font-bold">
            SWILA PARFUM
          </span>
          <h1 className="font-serif text-3xl font-bold text-neutral-900 mt-1">
            {t('myOrdersTitle')}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">{t('myOrdersSubtitle')}</p>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-4 py-2 rounded bg-black hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto"
        >
          <span>{t('acquireNewFlacon')}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 rounded bg-neutral-100 animate-pulse border border-neutral-200" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-lg p-12 text-center space-y-4 bg-white border border-neutral-200 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600">
            <PackageCheck className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="font-serif text-lg font-bold text-neutral-900">
            {t('noPastOrders')}
          </h3>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto font-sans">
            {t('cartEmptySubtitle')}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-black hover:bg-neutral-800 text-white font-serif font-bold text-xs uppercase tracking-wider shadow-sm"
          >
            <span>{t('exploreCollection')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg overflow-hidden border border-neutral-200 bg-white shadow-sm"
            >
              {/* Order Meta Bar */}
              <div className="p-5 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-6 text-xs">
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider font-semibold">
                      {t('orderRef')}
                    </span>
                    <span className="font-mono text-neutral-900 font-bold">
                      #{order.id.slice(0, 8)}...
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider font-semibold">
                      {t('orderDate')}
                    </span>
                    <span className="text-neutral-800 font-medium">
                      {new Date(order.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block text-[10px] uppercase tracking-wider font-semibold">
                      {t('total')}
                    </span>
                    <span className="font-serif font-bold text-neutral-900 font-mono">
                      {order.total_amount.toFixed(2)} MAD
                    </span>
                  </div>
                </div>

                <div>{getStatusBadge(order.status)}</div>
              </div>

              {/* Order Items List */}
              <div className="p-5 divide-y divide-neutral-100">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.product?.image_url && (
                        <img
                          src={item.product.image_url}
                          alt={item.product.name}
                          className="w-12 h-16 object-cover rounded border border-neutral-200 bg-white"
                        />
                      )}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                          {item.product?.brand || 'SWILA PARFUM'}
                        </span>
                        <h4 className="font-serif text-sm font-semibold text-neutral-900">
                          {item.product?.name || 'Exclusive Perfume'}
                        </h4>
                        <span className="text-xs text-neutral-600 font-medium font-mono">
                          Qty: {item.quantity} × {item.price_at_purchase.toFixed(2)} MAD
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-serif text-sm font-bold text-neutral-900 font-mono">
                        {(item.price_at_purchase * item.quantity).toFixed(2)} MAD
                      </span>
                      {item.product && (
                        <Link
                          to={`/product/${item.product.id}`}
                          className="block text-[11px] text-neutral-900 hover:underline mt-1 font-bold"
                        >
                          {t('discover')}
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address Footer */}
              <div className="px-5 py-3 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                <span className="truncate pr-4">
                  <strong className="text-neutral-800 font-semibold">{t('shippingDestination')}:</strong> {order.shipping_address}
                </span>
                <span className="font-mono text-[11px] text-emerald-700 font-bold whitespace-nowrap">
                  {t('expressCourier')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
