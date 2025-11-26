'use client'
import React, { useEffect, useState } from "react";
import { MiButton } from "../MiButton/MiButton";
import { Product } from "@/app/interfaces/products";
import { uploadImage } from "@/services/upload";
import { useLanguage } from '@/contexts/LanguageContext';


export interface FormDataProps {
  name?: string;
  brand?: string;
  quantity?: number;
  price?: number;
  isActive?: boolean;
  category?: string;
  imageUrl?: string;
}

interface FormProductProps {
  data?: FormDataProps; // opcional para nuevo producto
  isEditing?: boolean;
  onSubmitEdit?: (formData: Product) => void;
}

export const FormProduct: React.FC<FormProductProps> = ({ data, isEditing, onSubmitEdit }) => {
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    brand: "",
    quantity: 1,
    price: 0,
    isActive: false,
    category: "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  
  const {t} = useLanguage();

  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        brand: data.brand || "",
        quantity: data.quantity || 0,
        price: data.price || 0,
        isActive: data.isActive || false,
        category: data.category || "",
        imageUrl: data.imageUrl || "",
      });
    }
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  //Para imagen con cloudinary
  const handleImageUpload = async (file: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const fileBase64 = reader.result as string;

      // Use upload service (axios)
      const res = await uploadImage(fileBase64);
      if ((res as any).url) {
        setFormData((prev) => ({ ...prev, imageUrl: (res as any).url }));
      } else {
        // You can set an error state here if needed
        console.error("Upload error:", (res as any).error || res);
      }
    };
  };

  const validateForm = (): string[] => {
    const validationErrors: string[] = [];

    if (!formData.name) validationErrors.push("El nombre es obligatorio.");
    if (!formData.brand) validationErrors.push("La marca es obligatoria.");
    if (!formData.category) validationErrors.push("La categoría es obligatoria.");
    if (!formData.quantity || formData.quantity < 0)
      validationErrors.push("La cantidad debe ser mayor a 0.");
    if (!formData.price || formData.price < 1)
      validationErrors.push("El precio debe ser mayor a 0.");
    if (!formData.imageUrl)
      validationErrors.push("La imagen del producto es obligatoria.");

    return validationErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors([]);
      onSubmitEdit?.(formData as Product);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-[#0d1a2d] to-[#101b33]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 bg-slate-800 p-6 rounded-2xl shadow-md text-white"
      >
        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            {isEditing ? "Edit product" : "Add a new product"}
          </h2>

          <label className="block text-sm font-medium mb-1">{t('formProduct.name')}</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.brand')}</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.category')}</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">{t('formProduct.selectCategory')}</option>
            <option value="Electrónica">{t('formProduct.electronics')}</option>
            <option value="Computadores">{t('formProduct.computers')}</option>
            <option value="Accesorios">{t('formProduct.accessories')}</option>
            <option value="Audio">{t('formProduct.audio')}</option>
            <option value="Gaming">{t('formProduct.gaming')}</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.quantity')}:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.price')}</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.status')}</label>
          <select
            name="isActive"
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "true" })
            }
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="true">{t('product.active')}</option>
            <option value="false">{t('product.inactive')}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t('formProduct.image')}</label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              handleImageUpload(file);
            }}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none"
          />

          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Product Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>


        <MiButton
          type="submit"
          text={isEditing ? "Update product" : "Add product"}
          variant="primary"
          size="md"
        />

        {errors.length > 0 && (
          <ul className="text-red-400 text-sm mt-2 list-disc pl-5">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}
      </form>
    </div>
  );
};

export default FormProduct;
