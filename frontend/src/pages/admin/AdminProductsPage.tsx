import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Flame,
  Sparkles,
  Filter,
  Upload,
  Link as LinkIcon,
  Check,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { AdminLayout } from '../../components/AdminLayout';
import { LowStockBadge } from '../../components/LowStockBadge';

export const AdminProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'perfumes' | 'bakhour'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [isBakhourModal, setIsBakhourModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default Form State for standard perfumes
  const initialForm = {
    name: '',
    brand: 'SWILA PARFUM',
    category_id: '',
    price: 320,
    volume_ml: 100,
    stock_quantity: 15,
    description: '',
    top_notes: '',
    heart_notes: '',
    base_notes: '',
    image_url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
  };

  // Default Form State specifically for Bakhour & Incense
  const initialBakhourForm = {
    name: '',
    brand: 'SWILA Atelier',
    category_id: '',
    price: 280,
    volume_ml: 50,
    stock_quantity: 20,
    description: 'Encens Bakhour de prestige préparé avec des copeaux de bois d’agarwood trempés dans des huiles essentielles précieuses, musc et résines orientales.',
    top_notes: 'Safran Impérial, Rose de Damas, Cardamome',
    heart_notes: 'Copeaux d’Oud Sauvage, Encens d’Oman, Ambre Gris',
    base_notes: 'Bois de Santal, Musc Blanc, Résine de Ciste',
    image_url: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
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

  // Check action query parameter (e.g. ?action=add-bakhour)
  useEffect(() => {
    if (searchParams.get('action') === 'add-bakhour' && categories.length > 0) {
      handleOpenAddBakhourModal();
    }
  }, [searchParams, categories]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsBakhourModal(false);
    setImageMode('upload');
    setUploadSuccess(false);
    setFormData({
      ...initialForm,
      category_id: categories.length > 0 ? categories[0].id : '',
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenAddBakhourModal = () => {
    setEditingProduct(null);
    setIsBakhourModal(true);
    setImageMode('upload');
    setUploadSuccess(false);
    const bakhourCat = categories.find(
      (c) =>
        c.slug === 'oud' ||
        c.name.toLowerCase().includes('bakhour') ||
        c.name.toLowerCase().includes('oud')
    );
    setFormData({
      ...initialBakhourForm,
      category_id: bakhourCat ? bakhourCat.id : (categories[0]?.id || ''),
    });
    setFormError(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageMode('upload');
    setUploadSuccess(false);
    const isBakhour =
      product.category?.slug === 'oud' ||
      product.name.toLowerCase().includes('bakhour') ||
      product.description.toLowerCase().includes('bakhour') ||
      product.description.toLowerCase().includes('encens');
    setIsBakhourModal(isBakhour);

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

  const handleFileProcess = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP, GIF)');
      return;
    }

    // Set immediate preview to give instant feedback
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({ ...prev, image_url: previewUrl }));

    try {
      setUploadingImage(true);
      setUploadSuccess(false);
      const res = await api.uploadImage(file);
      setFormData((prev) => ({ ...prev, image_url: res.url }));
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.warn('API image upload failed, falling back to base64 DataURL:', err);
      // Fallback: convert file to base64 data URL so image is retained and saved even if offline
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
          setUploadSuccess(true);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
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

  const filtered = products.filter((p) => {
    const isBakhour =
      p.category?.slug === 'oud' ||
      p.name.toLowerCase().includes('bakhour') ||
      p.description.toLowerCase().includes('bakhour') ||
      p.description.toLowerCase().includes('encens');

    if (categoryFilter === 'bakhour' && !isBakhour) return false;
    if (categoryFilter === 'perfumes' && isBakhour) return false;

    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <AdminLayout
      title="Catalog & Inventory Management"
      subtitle="Manage luxury flacons, bakhour collections, fragrance pyramids, pricing, and stock levels"
      actions={
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add Bakhour Button */}
          <button
            onClick={handleOpenAddBakhourModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm active:scale-95"
            title="Add Artisanal Bakhour or Incense"
          >
            <Flame className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Add Bakhour</span>
          </button>

          {/* Add New Perfume Button */}
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Perfume</span>
          </button>
        </div>
      }
    >
      {/* Search & Quick Filter Tabs Bar */}
      <div className="rounded border border-neutral-200 p-4 flex flex-col md:flex-row gap-3 items-center justify-between bg-white">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search perfumes, bakhour, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
          />
        </div>

        {/* Quick Filter Tabs: All, Perfumes, Bakhour & Oud */}
        <div className="flex items-center gap-1.5 self-start md:self-auto">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              categoryFilter === 'all'
                ? 'bg-black text-white font-semibold'
                : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            All Products ({products.length})
          </button>
          <button
            onClick={() => setCategoryFilter('perfumes')}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              categoryFilter === 'perfumes'
                ? 'bg-black text-white font-semibold'
                : 'bg-neutral-100 text-neutral-600 hover:text-black hover:bg-neutral-200'
            }`}
          >
            Perfumes Only
          </button>
          <button
            onClick={() => setCategoryFilter('bakhour')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              categoryFilter === 'bakhour'
                ? 'bg-amber-700 text-white font-semibold'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
            <span>Bakhour & Oud</span>
          </button>
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                {isBakhourModal && <Flame className="w-4 h-4 fill-amber-600 text-amber-600" />}
                <span>
                  {editingProduct
                    ? 'Edit Creation'
                    : isBakhourModal
                    ? 'Add New Bakhour & Incense'
                    : 'Add New Perfume'}
                </span>
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
                    {isBakhourModal ? 'Bakhour / Incense Name' : 'Perfume Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={isBakhourModal ? 'e.g. Bakhour Al-Malaki Royal' : 'e.g. Royal Oud Extrait'}
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
                    placeholder={isBakhourModal ? 'e.g. SWILA Atelier' : 'e.g. SWILA PARFUM'}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Category
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
                    {isBakhourModal ? 'Weight / Packaging' : 'Volume'}
                  </label>
                  <select
                    value={formData.volume_ml}
                    onChange={(e) => setFormData({ ...formData, volume_ml: parseInt(e.target.value, 10) })}
                    className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-black"
                  >
                    <option value={40}>40 g (Box)</option>
                    <option value={50}>50 ml / g</option>
                    <option value={80}>80 g (Luxury Jar)</option>
                    <option value={100}>100 ml / g</option>
                    <option value={200}>200 ml / g</option>
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

              {/* Product Image Section: File Import or Web URL */}
              <div className="p-3.5 border border-neutral-200 rounded-lg bg-neutral-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-neutral-900 tracking-wide uppercase">
                    Product Image / Image du Produit
                  </label>
                  <div className="inline-flex p-0.5 bg-neutral-200/80 rounded text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                        imageMode === 'upload'
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <Upload className="w-3 h-3" />
                      <span>Importer Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-colors ${
                        imageMode === 'url'
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      <LinkIcon className="w-3 h-3" />
                      <span>Lien Web URL</span>
                    </button>
                  </div>
                </div>

                {/* Upload Mode */}
                {imageMode === 'upload' ? (
                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      className="hidden"
                      onChange={handleFileSelect}
                    />

                    {formData.image_url ? (
                      <div className="flex items-center gap-4 p-2.5 bg-white border border-neutral-200 rounded-lg">
                        <div className="relative w-20 h-20 bg-neutral-100 rounded-md overflow-hidden flex-shrink-0 border border-neutral-200">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          {uploadingImage && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-neutral-900 truncate">
                              Image sélectionnée
                            </span>
                            {uploadSuccess && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                <Check className="w-3 h-3" /> Importée avec succès
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate mt-0.5 font-mono">
                            {formData.image_url.startsWith('data:') ? 'Image chargée (Base64)' : formData.image_url}
                          </p>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadingImage}
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[11px] font-medium rounded hover:bg-neutral-800 transition-colors disabled:opacity-50"
                            >
                              <Upload className="w-3 h-3" />
                              {uploadingImage ? 'Téléchargement...' : 'Changer l\'image'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, image_url: '' })}
                              className="text-[11px] text-rose-600 hover:text-rose-800 underline ml-1"
                            >
                              Retirer
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                          dragActive
                            ? 'border-black bg-neutral-100'
                            : 'border-neutral-300 hover:border-neutral-500 bg-white'
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-2 text-neutral-600">
                          {uploadingImage ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Upload className="w-5 h-5" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-neutral-800">
                          {uploadingImage ? 'Téléchargement de l\'image...' : 'Cliquez pour importer une image ou glissez-déposez ici'}
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-1">
                          PNG, JPG, JPEG, WEBP jusqu'à 15MB
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="flex-1 px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black font-mono"
                      />
                    </div>
                    {formData.image_url && (
                      <div className="flex items-center gap-3 p-2 bg-white border border-neutral-200 rounded">
                        <img
                          src={formData.image_url}
                          alt="URL preview"
                          className="w-12 h-12 object-cover rounded border border-neutral-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=400&q=80';
                          }}
                        />
                        <span className="text-[11px] text-neutral-500 truncate">
                          Aperçu de l'image liée
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  {isBakhourModal ? 'Bakhour & Resin Description' : 'Olfactory Description'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={
                    isBakhourModal
                      ? 'Precious agarwood chips, resins, infusion notes, and burning sillage...'
                      : 'Notes, inspiration, and sillage description...'
                  }
                  className="w-full px-3 py-1.5 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              {/* Fragrance Pyramid Notes Inputs */}
              <div className="p-3.5 rounded border border-neutral-200 bg-neutral-50 space-y-2.5">
                <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  {isBakhourModal && <Flame className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />}
                  <span>{isBakhourModal ? 'Bakhour Olfactory Notes & Resins' : 'Olfactory Pyramid'}</span>
                </span>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    {isBakhourModal ? 'Initial Notes / Infusion' : 'Top Notes'}
                  </label>
                  <input
                    type="text"
                    value={formData.top_notes}
                    onChange={(e) => setFormData({ ...formData, top_notes: e.target.value })}
                    placeholder={
                      isBakhourModal
                        ? 'e.g. Saffron, Damask Rose, Cinnamon Bark'
                        : 'e.g. Saffron, Calabrian Bergamot, Pink Pepper'
                    }
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    {isBakhourModal ? 'Wood Chips & Heart Resins' : 'Heart Notes'}
                  </label>
                  <input
                    type="text"
                    value={formData.heart_notes}
                    onChange={(e) => setFormData({ ...formData, heart_notes: e.target.value })}
                    placeholder={
                      isBakhourModal
                        ? 'e.g. Wild Agarwood Chips, Somalian Frankincense, Cistus'
                        : 'e.g. Grasse Centifolia Rose, Noble Florentine Iris'
                    }
                    className="w-full px-2.5 py-1 text-xs border border-neutral-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-600 mb-0.5">
                    {isBakhourModal ? 'Deep Incense & Burning Base' : 'Base Notes'}
                  </label>
                  <input
                    type="text"
                    value={formData.base_notes}
                    onChange={(e) => setFormData({ ...formData, base_notes: e.target.value })}
                    placeholder={
                      isBakhourModal
                        ? 'e.g. Pure Cambodian Oud Oil, Mysore Sandalwood, White Musk'
                        : 'e.g. Cambodian Aged Oud, Mysore Sandalwood, Natural Ambergris'
                    }
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
