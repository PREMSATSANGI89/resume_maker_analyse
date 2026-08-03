import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/utils/constants';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('resumeforge:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (!error.response) {
      toast.error('Network error — please check your internet connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || 'Something went wrong. Please try again.';

    switch (status) {
      case 400:
        toast.error(message || 'Invalid request.');
        break;
      case 401:
        toast.error('Session expired. Please sign in again.');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 413:
        toast.error('File too large. Please upload a smaller file.');
        break;
      case 422:
        toast.error(message || 'Validation failed.');
        break;
      case 429:
        toast.error('Too many requests. Please slow down.');
        break;
      case 500:
      default:
        toast.error(message || 'Server error. Please try again later.');
        break;
    }

    return Promise.reject(error);
  },
);
