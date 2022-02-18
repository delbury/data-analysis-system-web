import { FormItemRule } from '../interface';

const CHAR_LENGTH_SHORT = 20;
const CHAR_LENGTH_NORMAL = 100;
const CHAR_LENGTH_LONG = 255;
const CHAR_LENGTH_LONGER = 1023;

type GetRule<T> = T extends any[] ? never : T;
type Validator = NonNullable<GetRule<FormItemRule>>['validator'];

// 包装规则
const createRule = (validator: Validator): FormItemRule => ({ validator });

// 生成文本长度规则
const getStringLengthRule = (length: number) =>
  createRule((rule, value: string, cb) => {
    if(Array.isArray(value)) {
      // 如果是数组，则将数组 join(',') 并比较 length
      if(value.join(',').length > length) {
        return cb('输入的数据内容过长');
      }
    } else if(value.length > length) {
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

// 非零校验
export const notZeroRule = createRule((rule, value: number, cb) => {
  if(value === 0) {
    return cb('不能为0');
  }
  return cb();
});

// 手机号码校验
const phoneReg = /^1\d{10}$/;
const phoneRule = createRule((rule, value: string, cb) => {
  const phone = String(value);
  if(phone && !phoneReg.test(phone)) {
    return cb('请输入正确的11位手机号码');
  }
  return cb();
});

// 路径校验
const pathReg1 = /^\/[a-zA-Z0-9\/]*[a-zA-Z0-9]$/i;
const pathReg2 = /\/\//;
const pathRule = createRule((rule, value: string, cb) => {
  if(value !== '/' && (!pathReg1.test(value) || pathReg2.test(value))) {
    return cb('请输入合法的路径');
  }
  return cb();
});

// tag 校验
const tagReg1 = /^[a-zA-Z][a-zA-Z0-9_\.]*[a-zA-Z0-9]$/i;
const tagReg2 = /\.\./;
const tagRule = createRule((r, val, cb) => {
  if(!val?.length) return cb();

  if(!Array.isArray(val)) {
    val = [val];
  }
  if(
    val.some(it => tagReg2.test(it) || !tagReg1.test(it))
  ) {
    return cb('请输入合法tag e.g. xxx|xxx.yyy');
  }
  return cb();
});

// 常用表单校验条件
export const formRules = {
  // 必填
  required: <FormItemRule>{
    required: true,
    message: '不能为空',
    trigger: 'change',
  },
  // 长度限制
  shortLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_SHORT),
  normalLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_NORMAL),
  longLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_LONG),
  longerLength: <FormItemRule>getStringLengthRule(CHAR_LENGTH_LONGER),
  // 数字限制
  int: <FormItemRule>getNumberTypeRule('int', false, true), // 整数
  intUnsigned: <FormItemRule>getNumberTypeRule('int', true, true), // 非负整数
  intPositive: <FormItemRule>getNumberTypeRule('int', true, false), // 正整数
  float: <FormItemRule>getNumberTypeRule('float', false, true), // 浮点数
  floatUnsigned: <FormItemRule>getNumberTypeRule('float', true, true), // 非负浮点数
  floatPositive: <FormItemRule>getNumberTypeRule('float', true, false), // 正浮点数
  // 手机号码
  phone: <FormItemRule>phoneRule,
  notZero: <FormItemRule>notZeroRule,
  // 路径
  path: <FormItemRule>pathRule,
  // tag
  tag: <FormItemRule>tagRule,
};

export type FormRuleNames = keyof (typeof formRules);
