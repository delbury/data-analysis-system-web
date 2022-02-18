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

export const TRAINER_TYPE_MAP: FormatMapType = {
  1: '内部',
  2: '外部',
};
