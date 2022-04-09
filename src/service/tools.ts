import http from '~/plugins/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList, Response } from '~types/Server';

export interface SearchParams {
  all?: number;
  pageSize?: number;
  pageNumber?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
}

// 创建 RESTful 风格基本接口
export const createRESTfulAPI = <R = any>(baseUrl: string) => {
  return {
    // 查询
    get: (params?: SearchParams & Partial<R>, config?: AxiosRequestConfig<R>) =>
      http.get<any, AxiosResponse<ResponseList<R>>>(`/${baseUrl}/list`, config ? { ...config, params } : { params }),
    // 查询详情
    getById: (id: string) =>
      http.get<any, AxiosResponse<ResponseList<R>>>(`/${baseUrl}/list/${id}`),
    // 新增
    post: (data?: Partial<R>, config?: AxiosRequestConfig<R>) =>
      http.post<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list`, data, config),
    // 修改
    put: (id?: string, data?: Partial<R>, config?: AxiosRequestConfig<R>) =>
      http.put<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}`, data, config),
    // 删除
    delete: (id: string) =>
      http.delete<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/${id}`),
    // 导入
    import: (datas?: Partial<R>[], config?: AxiosRequestConfig<R>) =>
      http.post<any, AxiosResponse<ResponseList<Response>>>(`/${baseUrl}/list/import`, datas, config),
  };
};

export type FetchersType = ReturnType<typeof createRESTfulAPI>;
export type FetchersGetType =
  (params?: SearchParams | Record<string, any>, config?: AxiosRequestConfig<any> | undefined)=> Promise<AxiosResponse<ResponseList<any>, any>>;

// 创建请求函数
const createGetApi = <T = any, R = any>(path: string) =>
  (params?: T, config?: AxiosRequestConfig) =>
    http.get<any, AxiosResponse<Response<R>>>(path, config ? { ...config, params } : { params });

const createPostApi = <T = any, R = any>(path: string) =>
  (data?: T, config?: AxiosRequestConfig<T>) =>
    http.post<any, AxiosResponse<Response<R>>>(path, data, config);

const createPutApi = <T = any, R = any>(path: string) =>
  (data?: T, config?: AxiosRequestConfig<T>) =>
    http.put<any, AxiosResponse<Response<R>>>(path, data, config);

export const apiCreater = {
  get: createGetApi,
  post: createPostApi,
  put: createPutApi,
};
