import axios from 'axios';

const API_URL = '/api/register';

export const createUser = async (payload: { name?: string; email: string; password: string }) => {
  try {
    const res = await axios.post(API_URL, payload);
    return res.data;
  } catch (err: any) {
    return { error: err.response?.data?.error || err.message };
  }
};

export default createUser;
