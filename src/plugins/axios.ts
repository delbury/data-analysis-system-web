import axios, { AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';
import qs from 'qs';

const instance = axios.create({
  baseURL: '/api',
  timeout: 6000,
  paramsSerializer: params => qs.stringify(
    params,
    {
      arrayFormat: 'repeat',
      skipNulls: true,
      filter: (prefix, value) => {
        if(value == '') return;
        return value;
      },
    }),
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  const msg = error?.response?.data?.msg;
  if(msg) {
    ElMessage.error(msg);
  }

  return Promise.reject(error);
});

export default instance;
