import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const service: AxiosInstance = axios.create({
  timeout: 2000,
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
