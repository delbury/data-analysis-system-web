import { StaffTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';
import { Page } from '~types/Server';

export interface SafeStaffInfo {
  code: string;
  group_id: number;
  group_name: string;
  id: number;
  name: string;
  sex: number;
  level: number;
  position: string;
}

export default {
  ...createRESTfulAPI<StaffTable>('staff'),
  getAllList: apiCreater.get<any, Page<SafeStaffInfo>>('/staff/safelist'),
};
