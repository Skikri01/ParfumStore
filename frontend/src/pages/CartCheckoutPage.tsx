import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  CreditCard,
  Gift,
  ArrowRight,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const CartCheckoutPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, clearCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user ? 'Client Privilège' : '',
    email: user ? user.email : '',
    street: '',
    city: '',
    postalCode: '',
    country: 'France',
    giftMessage: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError('Veuillez vous connecter ou créer un compte pour finaliser votre commande.');
      return;
    }

    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      setError('Veuillez renseigner tous les champs obligatoires.');
      return;
    }

    if (items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);

    try {
      const fullAddressString = `${shippingAddress.fullName || user.email}, ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country} ${
        shippingAddress.giftMessage ? `(Message cadeau: "${shippingAddress.giftMessage}")` : ''
      }`;

      const payload = {
        shipping_address: fullAddressString,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };

      const result = await api.createOrder(payload);

      // Clean monochromatic celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#000000', '#555555', '#AAAAAA', '#FFFFFF'],
      });

      setCompletedOrder(result.order);
      clearCart();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Erreur lors de la commande.');
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="rounded-lg p-8 sm:p-12 text-center space-y-6 border border-neutral-200 bg-white">
          <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-black">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 font-semibold">
              Commande Confirmée
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-normal text-neutral-900">
              Merci pour votre commande
            </h1>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Votre commande <span className="font-mono text-black font-semibold">#{completedOrder.id.slice(0, 8)}</span> a été prise en compte et est en cours de préparation.
            </p>
          </div>

          <div className="p-4 rounded border border-neutral-200 bg-[#FAFAFA] text-left max-w-md mx-auto space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-500">Numéro de commande:</span>
              <span className="font-mono text-neutral-900 font-semibold">{completedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Montant total:</span>
              <span className="font-bold text-neutral-900 font-mono">{completedOrder.total_amount.toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Adresse de livraison:</span>
              <span className="text-neutral-800 truncate max-w-[200px] text-right font-medium">{completedOrder.shipping_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Statut:</span>
              <span className="text-black capitalize font-bold">{completedOrder.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-6 py-2.5 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
            >
              Suivre mes commandes
            </Link>
            <Link
              to="/shop"
              className="w-full sm:w-auto px-6 py-2.5 rounded border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:bg-neutral-50"
            >
              Retour à la boutique
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Votre panier est vide</h2>
        <p className="text-xs text-neutral-500">
          Parcourez notre collection pour ajouter des flacons à votre panier.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded bg-black text-white text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800"
        >
          <span>Découvrir les parfums</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal font-serif text-neutral-900">
          Validation de la Commande
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Renseignez vos coordonnées de livraison pour finaliser votre achat.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded border border-red-300 bg-red-50 text-red-700 text-xs flex items-center justify-between">
          <span>{error}</span>
          {!user && (
            <Link to="/login" className="text-black font-bold underline ml-2">
              Se connecter
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Shipping Form Card */}
            <div className="rounded-lg border border-neutral-200 p-6 space-y-5 bg-white">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-100">
                1. Adresse de Livraison
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Nom & Prénom
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    placeholder="ex. Sophie Martin"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={shippingAddress.email}
                    onChange={handleChange}
                    placeholder="client@domaine.com"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Adresse postale
                </label>
                <input
                  type="text"
                  name="street"
                  required
                  value={shippingAddress.street}
                  onChange={handleChange}
                  placeholder="ex. 12 Avenue Montaigne, Apt 4B"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleChange}
                    placeholder="Paris"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    placeholder="75008"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Pays
                  </label>
                  <select
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded bg-white focus:outline-none focus:border-black"
                  >
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Maroc">Maroc</option>
                    <option value="Émirats arabes unis">Émirats arabes unis</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Message cadeau (Optionnel)</span>
                </label>
                <textarea
                  name="giftMessage"
                  rows={2}
                  value={shippingAddress.giftMessage}
                  onChange={handleChange}
                  placeholder="Ajouter une carte personnalisée à votre envoi..."
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="rounded-lg border border-neutral-200 p-6 space-y-4 bg-white">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-100">
                2. Mode de Paiement
              </h3>

              <div className="p-3.5 rounded border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-white text-black border border-neutral-200">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900">
                      Paiement Sécurisé Simulé
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Environnement bac à sable pour tester instantanément la commande.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-neutral-700 border border-neutral-300 font-semibold">
                  TEST
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <span>Validation en cours...</span>
                ) : (
                  <>
                    <span>Confirmer la commande • {subtotal.toFixed(2)} MAD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-lg border border-neutral-200 p-6 space-y-4 bg-white">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-100">
              Articles ({items.length})
            </h3>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex gap-3 p-2.5 rounded border border-neutral-100 bg-[#FAFAFA]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-14 h-18 object-cover rounded border border-neutral-200 bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                        {product.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {product.volume_ml} ml
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 border border-neutral-300 rounded px-1.5 py-0.5 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="text-neutral-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono text-neutral-900">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          disabled={quantity >= product.stock_quantity}
                          className="text-neutral-500 hover:text-black disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral-900 font-mono">
                          {(product.price * quantity).toFixed(2)} MAD
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFromCart(product.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span className="font-semibold text-neutral-900 font-mono">{subtotal.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-neutral-900 font-medium uppercase">Offerte</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-sm">
                <span className="font-bold text-neutral-900">Total</span>
                <span className="font-bold text-base text-neutral-900 font-mono">
                  {subtotal.toFixed(2)} MAD
                </span>
              </div>
            </div>

            <div className="p-3 rounded border border-neutral-200 bg-neutral-50 text-[11px] text-neutral-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
              <span>Flacons authentiques et échantillons offerts.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
