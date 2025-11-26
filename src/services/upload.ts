import axios from "axios";

/**
 * Uploads a base64 file payload to the server upload endpoint.
 * Returns `{ url: string }` on success.
 */
export const uploadImage = async (fileBase64: string): Promise<{ url: string } | { error: string }> => {
  try {
    const response = await axios.post(`/api/upload`, { file: fileBase64 });
    return response.data;
  } catch (err: unknown) {
    return { error: "Error al subir la imagen" };
  }
};

export default uploadImage;
