"use client";

import { useEffect, useState } from "react";
import { getProductById, updateProduct } from "@/services/products";
import { useParams, useRouter } from "next/navigation";
import FormProduct from "@/app/components/formProducts/FormProduct";
import { Product } from "@/app/interfaces/products";
import { useSession } from "next-auth/react";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        window.location.href = "/login";
      },
    });

  useEffect(() => {
    const load = async () => {
      const res = await getProductById(id);
      if (res.data) setProduct(res.data);
      setLoading(false);
    };
    load();
  }, [id]);

  const handleEdit = async (formData: Product) => {
    const res = await updateProduct({ ...formData, _id: id }, id);
    console.log(id)
    if (res.data) router.push("/dashboard/products");
  };

  if (loading) return <p>Cargando producto...</p>;
  if (!product) return <p>No se encontró el producto</p>;

  return (
    <FormProduct
      data={product}       
      isEditing={true}     
      onSubmitEdit={handleEdit}
    />
  );
}
