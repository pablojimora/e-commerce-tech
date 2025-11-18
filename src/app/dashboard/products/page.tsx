"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/interfaces/products";
import { getProducts, deleteProduct } from "@/services/products";

import ProductCard from "@/app/components/productCard/ProductCard";
import { notification } from "@/app/helpers/notification";

export default function ProductsDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ category: "", brand: "" });

  const router = useRouter();

  // 🔄 Obtener productos
  const fetchData = useCallback(async (newFilters = filters) => {
    const response = await getProducts(newFilters);
    setProducts(response.data ?? []);
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🗑 Eliminar producto
  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id);

    if (!res.error) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      notification("Producto eliminado correctamente", "success");
    } else {
      notification(res.error, "error");
    }
  };

  // 🔍 Filtros
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    fetchData(newFilters);
  };

  return (
    <div className="min-h-screen w-full py-10 px-4">
      
      {/* FILTROS */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <input
          type="text"
          name="brand"
          value={filters.brand}
          onChange={handleFilter}
          placeholder="Buscar por marca"
          className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white"
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleFilter}
          className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white"
        >
          <option value="">Todas las categorías</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Computadores">Computadores</option>
          <option value="Accesorios">Accesorios</option>
          <option value="Audio">Audio</option>
          <option value="Gaming">Gaming</option>
        </select>
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">No se encontraron productos</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={(id) => router.push(`/dashboard/products/${id}/edit`)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
