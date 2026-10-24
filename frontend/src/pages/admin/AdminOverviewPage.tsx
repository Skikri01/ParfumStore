import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  Clock,
  Truck,
  CheckCircle,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { AnalyticsData } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { LowStockBadge } from '../../components/LowStockBadge';

export const AdminOverviewPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAdminAnalytics();
        setAnalytics(data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Dashboard Overview" subtitle="Sales metrics, pipeline and inventory alerts">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded bg-neutral-200 border border-neutral-300" />
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (!analytics) {
    return (
      <AdminLayout title="Dashboard Overview">
        <div className="p-8 text-center text-red-600 bg-white border border-neutral-200 rounded">
          Unable to retrieve dashboard analytics.
        </div>
      </AdminLayout>
    );
  }

  const { summary, statusDistribution, topSellingProducts, lowStockProducts, recentOrders } = analytics;

  return (
    <AdminLayout
      title="Dashboard Overview"
      subtitle="Financial performance, sales velocity, and low-stock alerts"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/products?action=add-bakhour"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs uppercase tracking-wider transition-colors shadow-sm active:scale-95"
            title="Create new Bakhour or Incense"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Add Bakhour</span>
          </Link>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black text-white font-medium text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm active:scale-95"
          >
            <Package className="w-3.5 h-3.5" />
            <span>Add New Perfume</span>
          </Link>
        </div>
      }
    >
      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="rounded border border-neutral-200 p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 font-medium">
              Total Revenue
            </span>
            <div className="p-1.5 rounded bg-neutral-100 text-black">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-900 font-mono">
              {summary.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold inline-flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Confirmed retail volume</span>
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded border border-neutral-200 p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 font-medium">
              Orders Processed
            </span>
            <div className="p-1.5 rounded bg-neutral-100 text-black">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-900">
              {summary.totalOrders}
            </h3>
            <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1 mt-0.5">
              <span>Customer acquisitions</span>
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded border border-neutral-200 p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 font-medium">
              Active Catalog
            </span>
            <div className="p-1.5 rounded bg-neutral-100 text-black">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-900">
              {summary.totalProducts}
            </h3>
            <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1 mt-0.5">
              <span>Bespoke flacons</span>
            </span>
          </div>
        </div>

        {/* Registered Users */}
        <div className="rounded border border-neutral-200 p-5 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono tracking-wider text-neutral-500 font-medium">
              Registered Clients
            </span>
            <div className="p-1.5 rounded bg-neutral-100 text-black">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-neutral-900">
              {summary.registeredUsers}
            </h3>
            <span className="text-[11px] text-neutral-500 inline-flex items-center gap-1 mt-0.5">
              <span>VIP accounts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Inventory Low Stock Alert Warning Box */}
      {lowStockProducts && lowStockProducts.length > 0 && (
        <div className="p-5 rounded border border-amber-300 bg-amber-50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  Inventory Alert: {lowStockProducts.length} perfume(s) running critically low (≤ 5 units)
                </h3>
              </div>
            </div>
            <Link
              to="/admin/products"
              className="px-3 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-medium"
            >
              Manage Stock
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="p-2.5 rounded bg-white border border-amber-200 flex items-center justify-between gap-2 text-xs"
              >
                <div className="truncate">
                  <span className="block font-semibold text-neutral-900 truncate">{p.name}</span>
                  <span className="text-neutral-500 text-[11px] font-mono">{p.price.toFixed(2)} MAD</span>
                </div>
                <LowStockBadge stock={p.stock_quantity} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Middle Row: Status Distribution & Top Selling Flacons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Status Distribution */}
        <div className="lg:col-span-5 rounded border border-neutral-200 p-5 space-y-3 bg-white">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-2 border-b border-neutral-100">
            Fulfillment Pipeline
          </h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <Clock className="w-3.5 h-3.5" />
                <span>Pending Approval</span>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {statusDistribution.pending || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Atelier Preparation</span>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {statusDistribution.processing || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <Truck className="w-3.5 h-3.5" />
                <span>Courier Dispatched</span>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {statusDistribution.shipped || 0}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
              <div className="flex items-center gap-2 text-xs text-neutral-700">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Successfully Delivered</span>
              </div>
              <span className="font-mono text-xs font-bold text-neutral-900">
                {statusDistribution.delivered || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Top Selling Flacons */}
        <div className="lg:col-span-7 rounded border border-neutral-200 p-5 space-y-3 bg-white">
          <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Top Selling Perfumes
            </h3>
            <span className="text-[11px] text-neutral-400 font-mono">By volume</span>
          </div>

          <div className="space-y-2">
            {topSellingProducts.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">No sales recorded yet.</p>
            ) : (
              topSellingProducts.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded border border-neutral-100 bg-[#FAFAFA]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-neutral-400 w-4">
                      #{idx + 1}
                    </span>
                    <img
                      src={item.product?.image_url}
                      alt={item.product?.name}
                      className="w-8 h-10 object-cover rounded border border-neutral-200 bg-white"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900">
                        {item.product?.name}
                      </h4>
                      <span className="text-[11px] text-neutral-500">
                        {item.unitsSold} units sold
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-neutral-900 font-mono">
                    {item.totalSales.toFixed(2)} MAD
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded border border-neutral-200 p-5 space-y-3 bg-white">
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
          <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
            Recent Order Activity
          </h3>
          <Link
            to="/admin/orders"
            className="text-xs text-neutral-900 hover:text-neutral-500 font-semibold inline-flex items-center gap-1"
          >
            <span>All Orders</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[11px] bg-neutral-50">
                <th className="py-2.5 px-3">Order Ref</th>
                <th className="py-2.5 px-3">Client</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="py-2.5 px-3 font-mono text-neutral-900 font-medium">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-800">
                    {order.user?.email || 'Guest Client'}
                  </td>
                  <td className="py-2.5 px-3 text-neutral-600">
                    {order.items.length} item(s)
                  </td>
                  <td className="py-2.5 px-3 font-bold text-neutral-900 font-mono">
                    {order.total_amount.toFixed(2)} MAD
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-neutral-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
