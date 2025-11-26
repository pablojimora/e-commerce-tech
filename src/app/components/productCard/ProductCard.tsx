"use client";

import Image from "next/image";
import { Product } from "@/app/interfaces/products";
import { MiButton } from "../MiButton/MiButton";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { addToCart } from '@/services/cart';
import { notification } from '@/app/helpers/notification';


interface Props {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onAddToCart }: Props) {
  const { data: session, status } = useSession();
  const { t } = useLanguage();
      const router = useRouter();

      const handleAdd = async () => {
        // Require login
        if (!session?.user) {
          notification(t('notifications.loginRequired') || 'Please log in to use the cart', 'error');
          router.push('/login');
          return;
        }
        // If parent provided a handler, delegate
        if (onAddToCart) return onAddToCart(product._id!);

        try {
          const res = await addToCart(product._id!, 1);
          if (res?.error) notification(res.error, 'error');
          else {
            notification(t('notifications.cartAdded'), 'success');
            if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
          }
        } catch (err: any) {
          notification(err?.message || 'Error', 'error');
        }
      };
      // Guardar el role del usuario que inició sesión (si existe)
      const role = (session?.user as any)?.role ?? undefined;

      

  return (
    <div className="bg-[#111] rounded-xl shadow-lg border border-gray-800 overflow-hidden hover:scale-[1.02] transition-all">
      
      {/* Imagen */}
      <div className="relative h-56 w-full">
        <Image
          src={product.imageUrl || "/placeholder.png"}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-2 text-gray-200">

        <h2 className="text-xl font-semibold">{product.name}</h2>

        <div className="grid grid-cols-2 gap-2 text-sm pt-2">

          <p>
            <span className="font-semibold">Precio:</span> ${product.price}
          </p>

          <p>
            <span className="font-semibold">Stock:</span> {product.quantity}
          </p>

          <p>
            <span className="font-semibold">Categoría:</span> {product.category}
          </p>

          <p>
            <span className="font-semibold">Marca:</span> {product.brand}
          </p>

          <p>
            <span className="font-semibold">Estado:</span>{" "}
            {product.isActive ? (
              <span className="text-green-400">Activo</span>
            ) : (
              <span className="text-red-500">Inactivo</span>
            )}
          </p>

        </div>
      </div>

      {/* Botones */}
      <div className="flex justify-between p-4 border-t border-gray-800 gap-3">
        {role === 'admin' && (
          <>
            <MiButton
              text={t('product.edit')}
              variant="secondary"
              size="sm"
              onClick={() => onEdit(product._id!)}
              className="w-full"
            />

            <MiButton
              text={t('product.delete')}
              variant="danger"
              size="sm"
              onClick={() => onDelete(product._id!)}
              className="w-full"
            />
          </>
        )}

        {role === 'user' && (
          <MiButton
            text={t('product.addToCart')}
            variant="primary"
            size="md"
            onClick={() => handleAdd()}
            className="w-full"
          />
        )}

      </div>
    </div>
  );
}
