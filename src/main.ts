import { createApp } from 'vue';
import App from './App.vue';
import router from '/@/router';
import elements, { globalOptions } from './plugins/element-plus';
// 引入样式
import '/@/assets/style/index.scss';
// 自定义组件
import CompTable from '/@/components/CompTable/index.vue';
import CompDialog from '/@/components/CompDialog/index.vue';
// 引入自定义指令
import Directives from '/@/plugins/directives';

const app = createApp(App);

app.config.globalProperties.$ELEMENT = globalOptions;
app.use(elements).use(router).use(Directives);

app.component(CompTable.name, CompTable).component(CompDialog.name, CompDialog);

app.mount('#app');
