import { GlobalConfigTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<GlobalConfigTable>('global_config'),
};
