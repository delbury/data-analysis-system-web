import { FormItemRule } from './interface';

const CHAR_LENGTH_SHORT = 20;
const CHAR_LENGTH_NORMAL = 100;
const CHAR_LENGTH_LONG = 255;

type GetRule<T> = T extends any[] ? never : T;
type Validator = NonNullable<GetRule<FormItemRule>>['validator'];

// 包装规则
const createRule = (validator: Validator): FormItemRule => ({ validator });

// 生成文本长度规则
const getStringLengthRule = (length: number) =>
  createRule((rule, value: string, cb) => {
    if(value.length > length) {
      return cb(`输入文本长度不能超过${length}`);
    }
    return cb();
  });

// 数字类型校验
const getNumberTypeRule = (type: 'int' | 'float', unsigned = false, includeZero = true) =>
  createRule((rule, value: number, cb) => {
    if(typeof value !== 'number') {
      return cb('请输入合法的数值类型');
    }
    if(type === 'int' && !Number.isInteger(value)) {
      return cb('请输入整数');
    }
    if(!includeZero && value === 0) {
      return cb('输入数值不能为0');
    }
    if(unsigned && value < 0) {
      return cb('请输入非负数');
    }
    return cb();
  });

// 数字范围规则
export const getNumberRangeRule = ({ min, max }: { min?: number, max?: number }): FormItemRule =>
  createRule((rule, value: number, cb) => {
    if(min !== void 0 && value < min) {
      return cb(`数值不能小于${min}`);
    }
    if(max !== void 0 && value > max) {
      return cb(`数值不能大于${max}`);
    }
    return cb();
  });

// 手机号码校验
const phoneReg = /^1\d{10}/;
const phoneRule = createRule((rule, value: string, cb) => {
  const phone = String(value);
  if(phone && !phoneReg.test(phone)) {
    return cb('请输入正确的11位手机号码');
  }
  return cb();
});

// 常用表单校验条件
export const formRules = {
  // 必填
  required: <FormItemRule>{
    required: true,
    message: '不能为空',
  },
  // 长度限制
  shortLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_SHORT),
  normalLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_NORMAL),
  longLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_LONG),
  // 数字限制
  int: <FormItemRule>getNumberTypeRule('int', false, true), // 整数
  intUnsigned: <FormItemRule>getNumberTypeRule('int', true, true), // 非负整数
  intPositive: <FormItemRule>getNumberTypeRule('int', true, false), // 正整数
  float: <FormItemRule>getNumberTypeRule('float', false, true), // 浮点数
  floatUnsigned: <FormItemRule>getNumberTypeRule('float', true, true), // 非负浮点数
  floatPositive: <FormItemRule>getNumberTypeRule('float', true, false), // 正浮点数
  // 手机号码
  phone: <FormItemRule>phoneRule,
};

export type FormRuleNames = keyof (typeof formRules);
