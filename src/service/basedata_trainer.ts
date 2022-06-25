import { TrainerTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';
import { Page } from '~types/Server';

export interface SafeTrainerInfo {
  staff_code: string;
  group_id: number;
  group_name: string;
  id: number;
  staff_name: string;
  staff_sex: number;
  level: number;
}

export default {
  ...createRESTfulAPI<TrainerTable>('trainer'),
  getAllList: apiCreater.get<any, Page<SafeTrainerInfo>>('/trainer/safelist'),
};
