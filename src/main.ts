import { createApp } from 'vue';
import App from './App.vue';
import router from '~/router';
import elements from './plugins/element-plus';
// 引入样式
import '~/assets/style/index.scss';
// 自定义组件
import CompTable from '~/components/CompTable';
import CompDialog from '~/components/CompDialog/index.vue';
import CompButton from '~/components/CompButton/index.vue';
import CompLocalTable from '~/components/CompLocalTable/index.vue';
// 引入自定义指令
import Directives from '~/plugins/directives';
// 引入状态管理
import { store, key } from '~/store';

const app = createApp(App);

app.use(elements).use(router).use(Directives).use(store, key);

// 注册组件
const comps = [
  CompTable,
  CompDialog,
  CompButton,
  CompLocalTable,
];
comps.forEach(comp => app.component(comp.name, comp));

app.mount('#app');
