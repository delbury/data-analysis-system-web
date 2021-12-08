import { AccountTable } from '/@types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<AccountTable>('account'),
};
