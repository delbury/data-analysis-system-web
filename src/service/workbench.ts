import { WorkbenchTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';

export default {
  ...createRESTfulAPI<WorkbenchTable>('workbench'),
  getProjectCode: apiCreater.get<{ code: number; project: string; }>('/workbench/projectcode'),
  postComplete: apiCreater.post('/workbench/:id/complete'),
  putTrainedStaffs: apiCreater.put<{ trained_staffs: number[]; id?: number }>('/workbench/:id/staffs'),
};
