import { PermissionTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<PermissionTable>('permission'),
};
