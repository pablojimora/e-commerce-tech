"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getCart, addToCart, removeFromCart } from '@/services/cart';
import { notification } from '@/app/helpers/notification';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import { MiButton } from '@/app/components/MiButton/MiButton';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
  stock: number;
  brand?: string;
  category?: string;
}

export const Cart: React.FC = () => {
  const { data: session } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const loadCart = async () => {
    setLoading(true);
    const res = await getCart();
    setLoading(false);
    if (res?.data) setItems(res.data);
  };

  useEffect(() => {
    if (session?.user) loadCart();
  }, [session]);

  const handleRemove = async (productId: string) => {
    setLoading(true);
    const res = await removeFromCart(productId);
    setLoading(false);
    if (res?.error) {
      notification(res.error, 'error');
    } else if (res?.data) {
      setItems(res.data);
      notification(t('notifications.cartRemoved') || 'Removed from cart', 'success');
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  };

  const handleQtyChange = async (productId: string, nextQty: number, maxStock: number) => {
    if (nextQty < 1) return;
    if (nextQty > maxStock) {
      notification(t('notifications.stockExceeded') || `Stock disponible: ${maxStock}`, 'error');
      return;
    }
    setLoading(true);
    const res = await addToCart(productId, nextQty, true); // replace
    setLoading(false);
    if (res?.error) {
      notification(res.error, 'error');
    } else if (res?.data) {
      setItems(res.data);
      notification(t('notifications.cartUpdated') || 'Cart updated', 'success');
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
    }
  };

  const total = items.reduce((acc, it) => acc + (it.price || 0) * (it.quantity || 0), 0);

  if (!session?.user) {
    return (
      <div className="p-6">
        <p>{t('notifications.loginRequired') || 'You must be logged in'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-white">{t('cart.title') || 'Your cart'}</h1>
      {loading && <p className="text-gray-400">{t('ui.loading')}</p>}

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-xl mb-4">{t('cart.empty') || 'Your cart is empty'}</p>
          <a href="/dashboard/products" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            {t('cart.continueShopping') || 'Continue Shopping'}
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((it) => (
              <div key={it.productId} className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] rounded-xl shadow-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                  {/* Imagen del producto */}
                  <div className="w-full md:w-32 h-32 relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-900">
                    <Image 
                      src={it.imageUrl || '/placeholder.png'} 
                      alt={it.name} 
                      fill 
                      className="object-cover"
                    />
                  </div>

                  {/* Información del producto */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{it.name}</h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-400 mb-3">
                        {it.brand && (
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-gray-300">{t('product.brand')}:</span> {it.brand}
                          </span>
                        )}
                        {it.category && (
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-gray-300">{t('product.category')}:</span> {it.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-gray-400">{t('product.stock')}:</span>
                        <span className={`text-sm font-semibold ${it.stock > 10 ? 'text-green-400' : it.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {it.stock > 0 ? `${it.stock} ${t('cart.available') || 'disponibles'}` : t('cart.outOfStock') || 'Agotado'}
                        </span>
                      </div>
                    </div>

                    {/* Controles de cantidad y precio */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm text-gray-300 font-semibold">{t('cart.quantity') || 'Cantidad'}:</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={it.stock}
                          value={it.quantity} 
                          onChange={(e) => handleQtyChange(it.productId, Number(e.target.value), it.stock)} 
                          className="w-20 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-white">
                            ${(it.price * it.quantity).toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-400">
                            ${it.price.toFixed(2)} c/u
                          </div>
                        </div>
                        <MiButton 
                          text={t('product.delete')} 
                          variant="danger" 
                          size="sm" 
                          onClick={() => handleRemove(it.productId)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a2a] rounded-xl shadow-xl border border-gray-800 p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-white mb-6">{t('cart.summary') || 'Resumen'}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.subtotal') || 'Subtotal'}:</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>{t('cart.items') || 'Items'}:</span>
                  <span className="font-semibold">{items.reduce((acc, it) => acc + it.quantity, 0)}</span>
                </div>
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>{t('cart.total') || 'Total'}:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <MiButton
                type="button"
                variant="primary"
                size="lg"
                text={t('cart.checkout') || 'Proceder al pago'}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition transform hover:scale-105 border-0"
              />
              
              <a 
                href="/dashboard/products" 
                className="block text-center mt-4 text-blue-400 hover:text-blue-300 transition"
              >
                {t('cart.continueShopping') || 'Continuar comprando'}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
