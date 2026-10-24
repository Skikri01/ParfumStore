import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { LowStockBadge } from '../../components/LowStockBadge';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const initialForm = {
    name: '',
    brand: 'SWILA PARFUM',
    category_id: '',
    price: 250,
    volume_ml: 100,
    stock_quantity: 10,
    description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(prodRes.products);
      setCategories(catRes.categories);
      if (catRes.categories.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: catRes.categories[0].id }));
      }
    } catch (err) {
      console.error('Failed to load products for admin:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      ...initialForm,
      category_id: categories.length > 0 ? categories[0].id : '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      brand: product.brand,
      category_id: product.category_id,
      price: product.price,
      volume_ml: product.volume_ml,
      stock_quantity: product.stock_quantity,
      description: product.description,
      top_notes: product.top_notes,
      heart_notes: product.heart_notes,
      base_notes: product.base_notes,
      image_url: product.image_url,
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
      } else {
        await api.createProduct(formData);
      }
      setModalOpen(false);
      fetchCatalog();
    } catch (err: any) {
      setFormError(err.message || 'Error saving product.');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      setDeleteConfirmId(null);
      fetchCatalog();
    } catch (err: any) {
      alert(err.message || 'Unable to delete product.');
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Perfume Catalog & Inventory"
      subtitle="Manage luxury flacons, fragrance pyramids, pricing, and stock levels"
      actions={
        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Perfume</span>
        </button>
      }
    >
      {/* Search & Stats Bar */}
      <div className="rounded border border-neutral-200 p-4 flex flex-col sm:flex-row gap-3 items-center justify-between bg-white">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search by perfume name or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
          />
        </div>

        <div className="text-xs text-neutral-500">
          Total: <strong className="text-neutral-900">{products.length}</strong> creations
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded border border-neutral-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 font-mono uppercase tracking-wider text-[11px] bg-neutral-50">
                <th className="py-3 px-4">Perfume</th>
                <th className="py-3 px-4">Family</th>
                <th className="py-3 px-4">Volume</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    Loading catalog...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400">
                    No perfumes found matching search.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-10 h-12 object-cover rounded border border-neutral-200 bg-neutral-50 shrink-0"
                        />
                        <div>
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                            {product.brand}
                          </span>
                          <h4 className="text-xs font-semibold text-neutral-900">
                            {product.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 truncate max-w-xs block font-sans">
                            {product.top_notes}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-800 border border-neutral-200">
                        {product.category?.name || 'Unclassified'}
                      </span>
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-700">
                      {product.volume_ml} ml
                    </td>

                    <td className="py-3 px-4 font-bold text-neutral-900 font-mono">
                      {product.price.toFixed(2)} MAD
                    </td>

                    <td className="py-3 px-4">
                      <LowStockBadge stock={product.stock_quantity} />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded border border-neutral-200 bg-white text-neutral-700 hover:text-black hover:border-black transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === product.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-neutral-200 text-neutral-700 text-[10px]"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(product.id)}
                            className="p-1.5 rounded border border-neutral-200 bg-white text-neutral-400 hover:text-red-600 hover:border-red-300 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-neutral-200 p-6 space-y-5 bg-white shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                {editingProduct ? 'Edit Perfume' : 'Add New Perfume'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded border border-red-200 bg-red-50 text-red-700 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Perfume Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Oud Extrait"
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Brand / Maison
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. SWILA PARFUM"
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Fragrance Family
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-black"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Price (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Volume (ml)
                  </label>
                  <select
                    value={formData.volume_ml}
                    onChange={(e) => setFormData({ ...formData, volume_ml: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-black"
                  >
                    <option value={50}>50 ml</option>
                    <option value={100}>100 ml</option>
                    <option value={200}>200 ml</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Olfactory Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Notes, inspiration, and sillage description..."
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Fragrance Pyramid Notes Inputs */}
              <div className="p-3.5 rounded border border-neutral-200 bg-neutral-50 space-y-2.5">
                <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider block">
                  Olfactory Pyramid
                </span>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    Top Notes
                  </label>
                  <input
                    type="text"
                    value={formData.top_notes}
                    onChange={(e) => setFormData({ ...formData, top_notes: e.target.value })}
                    placeholder="e.g. Saffron, Calabrian Bergamot, Pink Pepper"
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    Heart Notes
                  </label>
                  <input
                    type="text"
                    value={formData.heart_notes}
                    onChange={(e) => setFormData({ ...formData, heart_notes: e.target.value })}
                    placeholder="e.g. Grasse Centifolia Rose, Noble Florentine Iris"
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    Base Notes
                  </label>
                  <input
                    type="text"
                    value={formData.base_notes}
                    onChange={(e) => setFormData({ ...formData, base_notes: e.target.value })}
                    placeholder="e.g. Cambodian Aged Oud, Mysore Sandalwood, Natural Ambergris"
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded border border-neutral-300 bg-white text-neutral-700 text-xs hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Creation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
