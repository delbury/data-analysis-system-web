import { ElTableColumn, ElFormItem, ElForm } from 'element-plus';
import { FormRuleNames } from './form-rules';

export type FormInstance = InstanceType<typeof ElForm>
export type ElFormProps = InstanceType<typeof ElForm>['$props'];

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
  // 输入数据类型组件可选参数
  customOption?: Record<string, any>;
  // tip
  tip?: string;
  readonly?: boolean;
  disabled?: boolean;
  // 字段规则，预设的规则
  ruleNames?: FormRuleNames[];
  // form表单值提交时处理
  valueSubmitHandler?: (val: any, key: string, form: Record<string, any>) => Record<string, any>;
  // form表单值回显时处理
  valueRebuildHandler?: (val: any, key: string, form: Record<string, any>) => Record<string, any>;
}

// 表单字段组
export interface FormItemSection {
  title?: string;
  formItems: FormItem[];
}

// 表单弹框状态
export type DialogStatus = 'create' | 'edit' | 'detail';
