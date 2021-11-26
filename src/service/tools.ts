import http from '/@/plugins/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList, Response } from '/@types/Server';

export interface SearchParams {
  all?: number;
  pageSize?: number;
  pageNumber?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

// 创建 RESTful 风格基本接口
export const createRESTfulAPI = <S = any, R = any>(baseUrl: string) => {
  return {
    // 查询
    get: (params?: SearchParams, config?: AxiosRequestConfig<R>) =>
      http.get<any, AxiosResponse<ResponseList<R>>>(`/${baseUrl}/list/`, config ? { ...config, params } : { params }),
    // 查询详情
    getById: (id: string) =>
      http.get<any, AxiosResponse<ResponseList<R>>>(`/${baseUrl}/list/${id}/`),
    // 新增
    post: (data?: Partial<R>, config?: AxiosRequestConfig<R>) =>
      http.post<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/`, data, config),
    // 修改
    put: (id?: string, data?: Partial<R>, config?: AxiosRequestConfig<R>) =>
      http.put<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}/`, data, config),
    // 删除
    delete: (id: string) =>
      http.delete<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}/`),
  };
};

export type FetchersType = ReturnType<typeof createRESTfulAPI>;
export type FetchersGetType =
  (params?: SearchParams, config?: AxiosRequestConfig<any> | undefined)=> Promise<AxiosResponse<ResponseList<any>, any>>;
