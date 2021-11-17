import http from '/@/plugins/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList } from '/@types/Server';
import { WorkbenchTable } from '/@types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<WorkbenchTable>('workbench'),
};
