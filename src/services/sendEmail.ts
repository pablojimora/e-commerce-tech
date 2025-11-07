
import { ApiResponse, Email } from "@/app/interfaces/sendEmail";
import axios from "axios";


const API_URL = "/api/sendEmail";

/* ==========================
   POST - Enviar email
   ========================== */
export const sendEmail = async (email: Email): Promise<ApiResponse<Email>> => {
  try {
    const response = await axios.post(API_URL, email);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return { error: "Error al enviar email" };
    }
    return { error: "Error desconocido" };
  }
};


