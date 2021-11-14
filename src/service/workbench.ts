import http from '/@/plugins/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList } from '/@types/Server';

export const getWorkbenchList = (config?: AxiosRequestConfig) => http.get<any, AxiosResponse<ResponseList>>('/workbench/list', config);
