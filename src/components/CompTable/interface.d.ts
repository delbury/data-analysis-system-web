import { ElTableColumn } from 'element-plus/es/components/table';

export type ColumnProps = InstanceType<typeof ElTableColumn>['$props'] & {
  // btns?: { label: string; key: string; }[];
  customType?: 'date' | 'datetime' | 'time' | 'int' | 'float';
  children?: ColumnProps[];
};
