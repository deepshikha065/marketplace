import axios from "axios";
import {
  ADMIN,
  BASE_URL,
  CARTAPI,
  FORGOTPASSWORD,
  LOGIN,
  PRODUCTSAPI,
  SIGNUP,
} from "../../constant";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const persistRoot = localStorage.getItem("persist:root");

    if (persistRoot) {
      const root = JSON.parse(persistRoot);

      if (root.user) {
        const user = JSON.parse(root.user);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const adminLoginApi = async (data: LoginPayload) => {
  const res = await api.post(LOGIN, data);
  return res.data;
};

export const registerUserApi = async (data: SignupPayload) => {
  const res = await api.post(SIGNUP, data);
  return res.data;
};

export const getProductByIdApi = async (id: string) => {
  const res = await api.get(`${PRODUCTSAPI}${id}`);
  return res.data;
};

export const forgotPasswordApi = async (email: string) => {
  const res = await api.post(FORGOTPASSWORD, { email });
  return res.data;
};

export const addProductApi = async (data: {
  productId: string;
  quantity: number;
}) => {
  const res = await api.post(`${CARTAPI}items`, data);
  return res.data;
};

export const getProductCartApi = async () => {
  const res = await api.get(CARTAPI);
  return res.data;
};

export const updateCartItemApi = async (itemId: string, quantity: number) => {
  const res = await api.put(`${CARTAPI}items/${itemId}`, { quantity });
  return res.data;
};

export const removeCartItemApi = async (itemId: string) => {
  const res = await api.delete(`${CARTAPI}items/${itemId}`);
  return res.data;
};

// Admin Product APIs
export const createProductApi = async (productData: unknown) => {
  const res = await api.post(`${ADMIN}/products`, productData);
  return res.data;
};

export const updateProductApi = async (id: string, productData: unknown) => {
  const res = await api.put(`${ADMIN}/products/${id}`, productData);
  return res.data;
};

export default api;
