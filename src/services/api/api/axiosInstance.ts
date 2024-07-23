import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  Method,
  InternalAxiosRequestConfig,
} from 'axios';
import {getData} from '../../../utils/storage';

const axiosInstance = axios.create({
  baseURL: 'https://ctsandbox.innohub.app/',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const idToken = await getData('idToken');
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export const apiRequest = async <T>(
  method: Method,
  url: string,
  data?: any,
  headers?: Record<string, string>,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosInstance.request<T>({
      method,
      url,
      data,
      headers,
    });
    return response;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default axiosInstance;
