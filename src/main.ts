import { createApp } from 'vue';
import App from './App.vue';
import router from '/@/router';
import elements, { globalOptions } from './plugins/element-plus';
import '/@/assets/style/index.scss';

const app = createApp(App);

app.config.globalProperties.$ELEMENT = globalOptions;
app.use(elements).use(router);

app.mount('#app');
