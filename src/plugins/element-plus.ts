import { Plugin } from 'vue';
import {
  // locale,
  ElButton,
  ElHeader,
  ElMain,
  ElFooter,
  ElCol,
  ElRow,
  ElDatePicker,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElTable,
  ElTableColumn,
  ElInput,
  ElScrollbar,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElCalendar,
  ElTooltip,
  ElDialog,
  ElLoading,
  ElPopconfirm,
  ElCheckTag,
  ElPagination,
} from 'element-plus';

const Coms = [
  ElButton,
  ElHeader,
  ElMain,
  ElFooter,
  ElCol,
  ElRow,
  ElDatePicker,
  ElRadio,
  ElRadioGroup,
  ElRadioButton,
  ElSelect,
  ElOption,
  ElCheckbox,
  ElTable,
  ElTableColumn,
  ElInput,
  ElScrollbar,
  ElMessageBox,
  ElForm,
  ElFormItem,
  ElCalendar,
  ElTooltip,
  ElDialog,
  ElLoading,
  ElPopconfirm,
  ElCheckTag,
  ElPagination,
];

const plugin: Plugin = {
  install: (app) => {
    Coms.forEach(Com => app.use(Com));
  },
};
export default plugin;

export const globalOptions = {
  size: 'mini',
  zIndex: 3000,
};
