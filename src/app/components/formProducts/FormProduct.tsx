import React, { useEffect, useState } from "react";
import { MiButton } from "../MiButton/MiButton";
import { Product } from "@/app/interfaces/products";

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
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: reader.result }),
      });

      const data = await res.json();
      setFormData({ ...formData, imageUrl: data.url }); // Cloudinary URL
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

          <label className="block text-sm font-medium mb-1">Name:</label>
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
          <label className="block text-sm font-medium mb-1">Brand:</label>
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
          <label className="block text-sm font-medium mb-1">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
            required
          >
            <option value="">Select a category</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Computadores">Computadores</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Audio">Audio</option>
            <option value="Gaming">Gaming</option>
          </select>
        </div>


        <div>
          <label className="block text-sm font-medium mb-1">Quantity:</label>
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
          <label className="block text-sm font-medium mb-1">Price:</label>
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
          <label className="block text-sm font-medium mb-1">Status:</label>
          <select
            name="isActive"
            value={formData.isActive ? "true" : "false"}
            onChange={(e) =>
              setFormData({ ...formData, isActive: e.target.value === "true" })
            }
            className="w-full p-2 rounded-lg bg-slate-700 text-white outline-none focus:ring-2 focus:ring-indigo-400"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image:</label>

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
