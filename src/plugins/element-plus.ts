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
  // ElMessageBox,
  ElForm,
  ElFormItem,
  ElCalendar,
  ElTooltip,
  ElDialog,
  ElLoading,
  ElPopconfirm,
  ElCheckTag,
  ElPagination,
  ElTimePicker,
  ElSpace,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElContainer,
  ElAside,
  ElInputNumber,
  ElIcon,
  ElSwitch,
  ElSelectV2,
} from 'element-plus';

// import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/el-message-box.css';

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
  // ElMessageBox,
  ElForm,
  ElFormItem,
  ElCalendar,
  ElTooltip,
  ElDialog,
  ElLoading,
  ElPopconfirm,
  ElCheckTag,
  ElPagination,
  ElTimePicker,
  ElSpace,
  ElMenu,
  ElMenuItem,
  ElSubMenu,
  ElContainer,
  ElAside,
  ElInputNumber,
  ElIcon,
  ElSwitch,
  ElSelectV2,
];

// 设置组件默认值
ElTooltip.props.effect.default = 'light';
ElTooltip.props.showAfter.default = 400;
ElTooltip.props.placement.default = 'top';

const plugin: Plugin = {
  install: (app) => {
    Coms.forEach(Com => app.use(Com));
    // app.use(ElementPlus);
  },
};
export default plugin;

export const globalOptions = {
  size: 'mini',
  zIndex: 3000,
};
