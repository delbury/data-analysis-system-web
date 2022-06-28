import { WorkbenchTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';

export default {
  ...createRESTfulAPI<WorkbenchTable>('workbench'),
  // 获取课程项目编号
  getProjectCode: apiCreater.get<{ code: number; project: string; }>('/workbench/projectcode'),
  // 录入参训人员
  putTrainedStaffs: apiCreater.put<{ trained_staffs: number[]; id?: number }>('/workbench/:id/staffs'),
  // 填写完成情况，并完成
  putComplete: apiCreater.put('/workbench/:id/complete'),
};
