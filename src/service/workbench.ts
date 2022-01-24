import { WorkbenchTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';

export default {
  ...createRESTfulAPI<WorkbenchTable>('workbench'),
  getProjectCode: apiCreater.get<{ code: number; project: string; }>('/workbench/projectcode'),
};
