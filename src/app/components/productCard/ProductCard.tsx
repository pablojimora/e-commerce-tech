"use client";

import Image from "next/image";
import { Product } from "@/app/interfaces/products";
import { MiButton } from "../MiButton/MiButton";

interface Props {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onEdit, onDelete }: Props) {
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

        <MiButton
          text="Editar"
          variant="secondary"
          size="sm"
          onClick={() => onEdit(product._id!)}
          className="w-full"
        />

        <MiButton
          text="Eliminar"
          variant="danger"
          size="sm"
          onClick={() => onDelete(product._id!)}
          className="w-full"
        />

      </div>
    </div>
  );
}
