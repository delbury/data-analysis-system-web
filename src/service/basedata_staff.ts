import { StaffTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<StaffTable>('staff'),
};
