import { TeamGroupTable } from '/@types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<TeamGroupTable>('teamgroup'),
};
