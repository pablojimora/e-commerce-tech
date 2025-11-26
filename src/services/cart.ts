import axios from 'axios';

const API = '/api/cart';

export const getCart = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.error || err.message };
  }
};

export const addToCart = async (productId: string, quantity = 1, replace = false) => {
  try {
    const res = await axios.post(API, { productId, quantity, replace });
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.error || err.message };
  }
};

export const removeFromCart = async (productId?: string) => {
  try {
    const url = productId ? `${API}?productId=${productId}` : API;
    const res = await axios.delete(url);
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.error || err.message };
  }
};

export default { getCart, addToCart, removeFromCart };
