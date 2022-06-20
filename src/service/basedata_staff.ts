import { StaffTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';
import { apiCreater } from './tools';

export default {
  ...createRESTfulAPI<StaffTable>('staff'),
  getAllList: apiCreater.get('/staff/safelist'),
};
