import React, { useState, useEffect } from 'react';
import {
  Search,
} from 'lucide-react';
import { Order } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { orders } = await api.getAdminOrders();
      setOrders(orders);
    } catch (err) {
      console.error('Failed to load admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
    } catch (err: any) {
      alert(err.message || 'Unable to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.shipping_address.toLowerCase().includes(search.toLowerCase()) ||
      (o.customer_name && o.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (o.customer_phone && o.customer_phone.toLowerCase().includes(search.toLowerCase())) ||
      (o.user?.email && o.user.email.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <AdminLayout
      title="Order Management"
      subtitle="Track customer shipments, fulfillment, and status updates"
    >
      {/* Controls Bar */}
      <div className="rounded border border-neutral-200 p-4 flex flex-col md:flex-row gap-3 items-center justify-between bg-white">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by email, address, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded text-xs capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-black text-white font-semibold'
                  : 'bg-neutral-100 text-neutral-600 hover:text-black border border-neutral-200'
              }`}
            >
              {st === 'all' ? 'All Orders' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded border border-neutral-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[11px] bg-neutral-50">
                <th className="py-3 px-4">Order Ref</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Shipping Destination</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Status & Dispatch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    {/* Order ID & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-neutral-900 font-semibold block">
                        #{order.id.slice(0, 8)}
                      </span>
                      <span className="text-[10px] text-neutral-400 block">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-neutral-900 font-semibold text-xs">
                          {order.customer_name || order.user?.email || 'Guest Client'}
                        </span>
                        {order.customer_phone && (
                          <span className="text-[11px] text-neutral-500 font-mono mt-0.5">
                            📞 {order.customer_phone}
                          </span>
                        )}
                        {order.user?.email && order.customer_name && (
                          <span className="text-[10px] text-neutral-400 truncate">
                            {order.user.email}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-4">
                      <div className="space-y-0.5">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-1.5 text-neutral-600">
                            <span className="font-mono text-[10px] text-neutral-900 font-semibold">
                              {item.quantity}×
                            </span>
                            <span className="truncate max-w-[150px]">
                              {item.product?.name || 'Perfume'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 text-neutral-500 max-w-xs truncate">
                      {order.shipping_address}
                    </td>

                    {/* Total */}
                    <td className="py-3 px-4 font-bold text-neutral-900 font-mono">
                      {order.total_amount.toFixed(2)} MAD
                    </td>

                    {/* Status updater dropdown */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={order.status}
                          disabled={updatingId === order.id}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="text-xs px-2.5 py-1 rounded border border-neutral-300 font-medium capitalize cursor-pointer bg-white text-neutral-900 focus:outline-none focus:border-black"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {updatingId === order.id && (
                          <span className="text-[10px] text-neutral-400 animate-spin">⟳</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
