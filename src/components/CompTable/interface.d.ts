import { ElTableColumn, ElFormItem } from 'element-plus';
import { FormRuleNames } from './form-rules';

// 列配置类型
type BaseCustomType = 'date' | 'datetime' | 'time' | 'int' | 'float';
export type ColumnProps = InstanceType<typeof ElTableColumn>['$props'] & {
  // btns?: { label: string; key: string; }[];
  // 展示数据类型
  customType?: BaseCustomType;
  children?: ColumnProps[];
  tip?: string;
};

// 表单字段配置
type ElFormItemProps = InstanceType<typeof ElFormItem>['$props'];
// rule prop 类型
export type FormItemRule = ElFormItemProps['rules'];
export type FormItem = ElFormItemProps & {
  // 列宽
  span?: number;
  // 输入数据类型
  customType?: BaseCustomType | 'string' | 'select' | 'remote-select' | 'timerange' | 'textarea';
  // tip
  tip?: string;
  readonly?: boolean;
  disabled?: boolean;
  // 字段规则，预设的规则
  ruleName?: FormRuleNames[];
}

// 表单字段组
export interface FormItemSection {
  title?: string;
  formItems: FormItem[];
}

// 表单弹框状态
export type DialogStatus = 'create' | 'edit' | 'detail';
