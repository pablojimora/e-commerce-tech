"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/app/interfaces/products";
import { getProducts, deleteProduct } from "@/services/products";

import ProductCard from "@/app/components/productCard/ProductCard";
import { notification } from "@/app/helpers/notification";
import { useLanguage } from '@/contexts/LanguageContext';
import { MiButton } from "@/app/components/MiButton/MiButton";
import { useSession } from "next-auth/react";
import { addToCart } from '@/services/cart';

export default function ProductsDashboardPage() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ category: "", brand: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const limit = 12;

  const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        window.location.href = "/login";
      },
    });
    // Guardar el role del usuario que inició sesión (si existe)
      const role = (session?.user as any)?.role ?? undefined;

  const router = useRouter();

  //  Obtener productos
  const fetchData = useCallback(async (newFilters = filters, page = currentPage) => {
    const response = await getProducts({ ...newFilters, page, limit });
    setProducts(response.data ?? []);
    if (response.pagination) {
      setTotalPages(response.pagination.totalPages);
      setTotalProducts(response.pagination.totalProducts);
    }
  }, [filters, currentPage, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  

  // Eliminar producto
  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id);

    if (!res.error) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      notification(t('notifications.productDeleted'), "success");
    } else {
      notification(res.error, "error");
    }
  };

  //  Filtros
  const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    fetchData(newFilters, 1);
  };

  // Cambiar página
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchData(filters, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
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
          placeholder={t('dashboard.products.filters.brandPlaceholder')}
          className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white"
        />

        <select
          name="category"
          value={filters.category}
          onChange={handleFilter}
          className="px-3 py-2 rounded-md border border-gray-600 bg-gray-800 text-white"
        >
          <option value="">{t('dashboard.products.filters.categoryAll')}</option>
          <option value="Electrónica">{t('formProduct.electronics')}</option>
          <option value="Computadores">{t('formProduct.computers')}</option>
          <option value="Accesorios">{t('formProduct.accessories')}</option>
          <option value="Audio">{t('formProduct.audio')}</option>
          <option value="Gaming">{t('formProduct.gaming')}</option>
        </select>
      {role === 'admin' && <div>
        <MiButton 
        onClick={() => router.push('/dashboard/products/new')}
        text={t('dashboard.products.addButton')}/>
      </div>}
      </div>

      {/* LISTA DE PRODUCTOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {products.length === 0 ? (
          <p className="text-gray-400 text-center col-span-full">{t('dashboard.products.noProducts')}</p>
        ) : (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={(id) => router.push(`/dashboard/products/${id}/edit`)}
              onDelete={handleDelete}
              onAddToCart={async (id) => {
                const res = await addToCart(id, 1);
                if (res?.error) notification(res.error, 'error');
                else {
                  notification(t('notifications.cartAdded'), 'success');
                  // notify header / other components to refresh cart data
                  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('cart-updated'));
                }
              }}
            />
          ))
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="mt-12 mb-8">
          <div className="flex justify-center items-center gap-2 flex-wrap">
            {/* Botón Anterior */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
            >
              {t('pagination.previous') || 'Anterior'}
            </button>

            {/* Números de página */}
            {getPageNumbers().map((page, idx) => (
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-3 py-2 text-gray-400">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === page
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-gray-800 text-white hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              )
            ))}

            {/* Botón Siguiente */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition"
            >
              {t('pagination.next') || 'Siguiente'}
            </button>
          </div>

          {/* Info de resultados */}
          <p className="text-center text-gray-400 mt-4">
            {t('pagination.showing') || 'Mostrando'} {(currentPage - 1) * limit + 1}-
            {Math.min(currentPage * limit, totalProducts)} {t('pagination.of') || 'de'} {totalProducts} {t('pagination.products') || 'productos'}
          </p>
        </div>
      )}
    </div>
  );
}
