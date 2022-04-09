/**
 * table 数据渲染用的 formatMap
 * */

import { FormatMapType } from '~/components/CompTable/interface';

// 班组类型
export const GROUP_TYPE_MAP: FormatMapType = {
  1: '车间',
  2: '委外',
};

// 培训师星级
export const TRAINER_LEVEL_MAP: FormatMapType = {
  0: '无',
  1: '见习',
  2: '一星',
  3: '二星',
  4: '三星',
};

// 培训计划完成状态
export const WORKBENCH_STATUS_MAP: FormatMapType = {
  1: '计划',
  2: { text: '完成', className: 'color-success' },
};

// 培训师类型
export const TRAINER_TYPE_MAP: FormatMapType = {
  1: '内部',
  2: '外部',
};

// 人员状态
export const STAFF_STATUS_MAP: FormatMapType = {
  0: '离职',
  1: '在职',
};

// 人员性别
export const STAFF_SEX_MAP: FormatMapType = {
  1: '男',
  2: '女',
};
