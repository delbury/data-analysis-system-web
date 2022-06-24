import { TrainerTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';
import { Page } from '~types/Server';
import { SafeStaffInfo } from './basedata_staff';

interface SafeTrainerInfo extends SafeStaffInfo {
  level: number;
}

export default {
  ...createRESTfulAPI<TrainerTable>('trainer'),
  getAllList: apiCreater.get<any, Page<SafeTrainerInfo>>('/trainer/safelist'),
};
