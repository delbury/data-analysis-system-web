import { FormItemSection, FormItem } from '../interface';
import { DEFAULT_DATE, formatDateValue, formatTimeValue } from '~/components/CompTable/util';
import moment from 'moment';

// 关闭 warning
moment.suppressDeprecationWarnings = true;

// 判断日期字符串的合法性
export const isValidDateString = (str: string) => !Number.isNaN(new Date(str).valueOf());
export const isValidTimeString = (str: string) => !Number.isNaN(new Date(`${DEFAULT_DATE} ${str}`).valueOf());

// 不同类型的参数校验
export const validateFormValue = (type?: NonNullable<FormItem['customType']>, value?: any) => {
  switch(type) {
    case 'date':
      return isValidDateString(value);
    case 'time':
      return isValidTimeString(value);
    case 'int':
      return Number.isInteger(+value);
    case 'float':
      return !Number.isNaN(+value);
    default:
      return true;
  }
};

// 处理不同类型的数据
export const resolveFormValue = (type?: NonNullable<FormItem['customType']>, value?: any) => {
  switch(type) {
    case 'date':
      return formatDateValue(value);
    case 'time':
      return formatTimeValue(`${DEFAULT_DATE} ${value}`);
    case 'int':
    case 'float':
      return +value;
    default:
      return value;
  }
};
