import { ApiResponse, Product } from "@/app/interfaces/products";
import axios from "axios";



const API_URL = "/api/products";

/* ==========================
   GET - Listar o filtrar producto
   ========================== */
export const getProducts = async (filters?: {
  category?: string;
  brand?: string;
}): Promise<ApiResponse<Product[]>> => {
  try {
    const params = new URLSearchParams();
    if (filters?.category) params.append("category", filters.category);
    if (filters?.brand) params.append("brand", filters.brand);

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Error en la solicitud" };
    }
    return { error: "Error desconocido" };
  }
};

/* ==========================
   GET - Obtener producto por ID
   ========================== */
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  try {
    // Use a RESTful resource path (API returns a single product at /api/products/:id)
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Producto no encontrado" };
    }
    return { error: "Error desconocido" };
  }
};

/* ==========================
   POST - Crear producto
   ========================== */
export const createProduct = async (product: Omit<Product, "_id">): Promise<ApiResponse<Product>> => {
  try {
    const response = await axios.post(API_URL, product);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Error al crear producto" };
    }
    return { error: "Error desconocido" };
  }
};

/* ==========================
   PUT - Actualizar producto
   ========================== */
export const updateProduct = async (product: Product, _id: string): Promise<ApiResponse<Product>> => {
  try {
    const response = await axios.put(`${API_URL}/${_id}`, product);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Error al actualizar prodcuto" };
    }
    return { error: "Error desconocido" };
  }
};

/* ==========================
   DELETE - Eliminar producto
   ========================== */
export const deleteProduct = async (_id: string): Promise<ApiResponse<Product>> => {
  try {
    const response = await axios.delete(`${API_URL}/${_id}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Error al eliminar producto" };
    }
    return { error: "Error desconocido" };
  }
};