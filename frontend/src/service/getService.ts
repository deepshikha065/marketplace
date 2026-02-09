import axios from "axios";
import { BASE_URL } from "../../constant";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
interface LoginPayload {
  email: string;
  password: string;
}
interface SignupPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const adminLoginApi = async (data: LoginPayload) => {
  const response = await api.post("/api/v1/admin/login", data);
  return response.data;
};

export const resigterUserApi = async (data: SignupPayload) => {
  const response = await api.post("/api/auth/signup", data);
  return response.data;
};

export const getProductsApi = async () => {
  const response = await api.get("/api/v1/products");
  return response.data;
};

export const getProductByIdApi = async (id: string) => {
  const response = await api.get(`/api/v1/products/${id}`);
  return response.data;
};

export default api;
