/**
 * 用于 form 表单 select 填写的选项
 */
import { LableValue } from '~/components/CompTable/interface';
type Options = LableValue[];

export const GROUP_TYPE_OPTIONS: Options = [
  { label: '车间', value: 1 },
  { label: '委外', value: 2 },
];

export const TRAIN_LEVEL_OPTIONS: Options = [
  { label: '分公司级', value: '分公司级' },
  { label: '车间级', value: '车间级' },
  { label: '班组级', value: '班组级' },
];
export const TRAIN_CONTENT_OPTIONS: Options = [
  { label: '管理才能类', value: '管理才能类' },
  { label: '业务发展类', value: '业务发展类' },
  { label: '综合保障类', value: '综合保障类' },
  { label: '生产技能类', value: '生产技能类' },
  { label: '三级安全培训', value: '三级安全培训' },
  { label: '培训师培训', value: '培训师培训' },
  { label: '班组长培训', value: '班组长培训' },
];
export const TRAIN_WAY1_OPTIONS: Options = [
  { label: '理论', value: '理论' },
  { label: '实操', value: '实操' },
];
export const TRAIN_WAY2_OPTIONS: Options = [
  { label: '内部培训', value: '内部培训' },
  { label: '外请讲师培训', value: '外请讲师培训' },
  { label: '送外培训', value: '送外培训' },
  { label: '对外培训', value: '对外培训' },
];
export const TRAIN_TYPE_OPTION: Options = [
  { label: '线上直播培训', value: '线上直播培训' },
  { label: '线上自学培训', value: '线上自学培训' },
  { label: '线下培训', value: '线下培训' },
];
export const TRAIN_CLASS_OPTIONS: Options = [
  { label: '运营期', value: '运营期' },
  { label: '筹备期', value: '筹备期' },
];
export const TRAINER_LEVEL_OPTIONS: Options = [
  { label: '无', value: 0 },
  { label: '见习', value: 1 },
  { label: '一星', value: 2 },
  { label: '二星', value: 3 },
  { label: '三星', value: 4 },
];
