import { TrainerTable } from '~types/db-table-type';
import { createRESTfulAPI } from './tools';

export default {
  ...createRESTfulAPI<TrainerTable>('trainer'),
};
