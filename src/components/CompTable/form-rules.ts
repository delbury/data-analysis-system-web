import { FormItemRule } from './interface';

const CHAR_LENGTH_SHORT = 20;
const CHAR_LENGTH_NORMAL = 100;
const CHAR_LENGTH_LONG = 255;

type GetRule<T> = T extends any[] ? never : T;
type Validator = NonNullable<GetRule<FormItemRule>>['validator'];

const charLengthValidator = (length: number): Validator => {
  return (rule, value: string, cb) => {
    if(value.length > length) {
      return cb(`输入文本长度不能超过${length}`);
    }
    return cb();
  };
};

// 常用表单校验条件
export const formRules = {
  required: <FormItemRule>{
    required: true,
    message: '不能为空',
    validator: (v, r, cb) => {},
  },
  shortLength: <FormItemRule>charLengthValidator(CHAR_LENGTH_SHORT),
  normalLength: <FormItemRule>charLengthValidator(CHAR_LENGTH_NORMAL),
  longLength: <FormItemRule>charLengthValidator(CHAR_LENGTH_LONG),
};

export type FormRuleNames = keyof (typeof formRules);
