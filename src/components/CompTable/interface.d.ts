import { ElTableColumn, ElFormItem, ElForm } from 'element-plus';
import { FormRuleNames } from './DialogForm/form-rules';
import { FormItemRule } from 'element-plus/es/components/form/src/form.type';
import type CompTable from './CompTable.vue';

export type CompTableInstance = InstanceType<typeof CompTable>;

export type FormInstance = InstanceType<typeof ElForm>
export type ElFormProps = InstanceType<typeof ElForm>['$props'];
type Writeable<T> = {
  -readonly [P in keyof T]: T[P];
};

type BaseCustomType = 'date' | 'datetime' | 'time' | 'int' | 'float' | 'bool';
type SearchType = boolean | 'remote';
export type LableValue<T = any> = { label: string; value: any; other?: T };
export type FormatMapType = Record<string, string | { text: string; className?: string }>;
/**
 * table 展示列配置类型
 */
export type ColumnProps = Writeable<InstanceType<typeof ElTableColumn>['$props']> & {
  // btns?: { label: string; key: string; }[];
  // 展示数据类型
  customType?: BaseCustomType | 'list';
  // 当数据为 object list 时，展示的字段 key
  listLabelKey?: string;
  subColumns?: ColumnProps[];
  tip?: string;
  // 格式化展示
  formatMap?: FormatMapType;
  // 自定义格式化函数
  customFormatter?: (val: any, row: Record<string, any>) => string | number;
  // 远程搜索条件配置
  search?: SearchType;
  // 查询的字段名
  searchProp?: string;
  // 远程搜索过滤列表
  searchOptions?: LableValue[];
  // 远程搜索其他参数
  searchAttach?: Record<string, any>;
};


/**
 * 表单字段配置
 */
type ElFormItemProps = InstanceType<typeof ElFormItem>['$props'];
interface Rule extends FormItemRule {
  validatorWithForm?: (form: any) => NonNullable<FormItemRule['validator']>;
}
export type CustomSelectOption = {
  options?: LableValue[];
  lastSearchedText?: string;
  rebuildField?: {
    listField?: string;
    label?: string;
    value?: string;
  }
  selectChange?: (val: string, opt: any, form: any) => void;
  remoteMethod?: (text: string, opt: CustomOption) => void;
  optionRender?: (item: { label: string; value: string; extra: any }) => string[];
}
type CustomNumberOption = {
  controls?: boolean;
  precision?: number;
}
type CustomInputOption = {
  placeholder?: string;
}
type CustomOption = CustomSelectOption & CustomNumberOption & CustomInputOption;
export { Rule as FormItemRule };
export type FormItem = Omit<ElFormItemProps, 'rules'> & {
  // 创建时的默认值
  default?: any;
  // 列宽
  span?: number;
  // 输入数据类型
  customType?: BaseCustomType | 'string' | 'select' | 'remote-select' | 'remote-select-multi' | 'timerange' | 'textarea' | 'tags';
  // 确切的数值类型，为空则以 customType 为准
  valueType?: BaseCustomType;
  // 输入数据类型组件可选参数
  // TODO 考虑拆成 | 形式的类型
  customOption?: CustomOption;
  // tip，同label，超长显示省略号
  tip?: string;
  // info，显示图标，hover显示
  info?: string | string[];
  readonly?: boolean;
  disabled?: boolean | ((form: any) => boolean);
  // 编辑时，是否可修改，默认为 true
  editable?: boolean;
  // 字段规则，预设的规则
  ruleNames?: FormRuleNames[];
  rules?: Rule | Rule[];
  // form表单值提交时处理
  valueSubmitHandler?: (params: {value: any, key: string, form: Record<string, any>}) => Record<string, any> | void;
  // form表单值回显时处理
  valueRebuildHandler?: (
    params: {value: any, key: string, params: Record<string, any>}
  ) => Record<string, any> | void;
  // 表单值改变时的回调
  formValueChangeHandler?: (current: any, form: any, other?: any) => void;
  // 表单值改变是否 immediate，默认 false
  immediate?: boolean;
  // 导入 excel 预览时，默认的列映射，一对一，或一对多 (field, column)
  importDefaultCol?: string | Record<string, { label: string; col: string; }>;
  // 该字段由多个字段组合而成
  importMergeCols?: string[];
  // 系统创建的可编辑字段
  systemEditable?: boolean;
}

// 表单字段组
export interface FormItemSection {
  title?: string;
  // 用来标记当前表单 section
  key?: string;
  formItems: FormItem[];
  // 禁用该 section 内容
  sectionDisabled?: (detail?: Record<string, any>) => boolean;
}

// 表单弹框状态
export type DialogStatus = 'create' | 'edit' | 'detail';

// 行按钮配置
export type RowBtn = {
  label: string;
  key: string;
  disabled?: boolean | ((row: any, other?: any) => boolean);
  tip?: string | ((row: any, other?: any) => string);
};
