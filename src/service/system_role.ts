import { RoleTable } from '/@types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<RoleTable>('role'),
};
