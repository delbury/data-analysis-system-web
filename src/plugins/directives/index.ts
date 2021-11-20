import { Plugin } from 'vue';
import DragScroll from './drag-scroll';

const plugin: Plugin = {
  install: (app) => {
    app.directive(DragScroll.name, DragScroll.directive);
  },
};

export default plugin;
