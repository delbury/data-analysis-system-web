import http from '/@/plugins/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList, Response } from '/@types/Server';

export interface SearchParams {
  pageSize: number;
  pageNumber: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

// 创建 RESTful 风格基本接口
export const createRESTfulAPI = <T = any, U = any>(baseUrl: string) => {
  return {
    // 查询
    get: (config?: AxiosRequestConfig<U & SearchParams>) =>
      http.get<any, AxiosResponse<ResponseList<T>>>(`/${baseUrl}/list/`, config),
    // 查询详情
    getById: (id: string) =>
      http.get<any, AxiosResponse<ResponseList<T>>>(`/${baseUrl}/list/${id}/`),
    // 新增
    post: (data?: Partial<T>, config?: AxiosRequestConfig) =>
      http.post<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/`, data, config),
    // 修改
    put: (id?: string, data?: Partial<T>, config?: AxiosRequestConfig) =>
      http.put<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}/`, data, config),
    // 删除
    delete: (id: string) =>
      http.delete<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}/`),
  };
};

export type FetcherType = ReturnType<typeof createRESTfulAPI>['get']
