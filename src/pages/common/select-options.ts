/**
 * 用于 form 表单 select 填写的选项
 */
import { LableValue } from '~/components/CompTable/interface';
type Options<T = any> = LableValue<T>[];

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
export const TRAIN_PROJECT_NAME: Options<{ code: number }> = [
  { label: '安全类培训', value: '安全类培训', other: { code: 116 }},
  { label: '车间综合管理类培训', value: '车间综合管理类培训', other: { code: 117 }},
  { label: '继续教育学时学分制培训', value: '继续教育学时学分制培训', other: { code: 118 }},
  { label: '综合监控专业知识培训', value: '综合监控专业知识培训', other: { code: 119 }},
  { label: '消防专业知识培训', value: '消防专业知识培训', other: { code: 120 }},
  { label: '屏蔽门专业知识培训', value: '屏蔽门专业知识培训', other: { code: 121 }},
  { label: '电扶梯专业知识培训', value: '电扶梯专业知识培训', other: { code: 122 }},
  { label: '风水电专业知识培训', value: '风水电专业知识培训', other: { code: 123 }},
  { label: 'AFC专业知识培训', value: 'AFC专业知识培训', other: { code: 124 }},
];

export const TRAINER_TYPE_OPTIONS: Options = [
  { label: '内部', value: 1 },
  { label: '外部', value: 2 },
];

export const STAFF_SEX_OPTIONS: Options = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
];

export const STAFF_STATUS_OPTIONS: Options = [
  { label: '离职', value: 0 },
  { label: '在职', value: 1 },
];
