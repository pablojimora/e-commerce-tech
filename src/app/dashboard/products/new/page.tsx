"use client";

import FormProduct from "@/app/components/formProducts/FormProduct";
import { createProduct } from "@/services/products";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();

  const { data: session, status } = useSession({
      required: true,
      onUnauthenticated() {
        window.location.href = "/login";
      },
    });

  const handleCreate = async (formData: any) => {
    await createProduct(formData);
    router.push("/dashboard/products");
  };

  return (
    <div className="p-6">
      <FormProduct
        isEditing={false}
        onSubmitEdit={handleCreate}
      />
    </div>
  );
}
