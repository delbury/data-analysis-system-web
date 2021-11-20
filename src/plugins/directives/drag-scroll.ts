/**
 * 鼠标右键滚动视窗
 */

import { Directive } from 'vue';

const directive: Directive = {
  created(el: HTMLElement, binding) {
    const query = binding.value;
    const elm = el.querySelector(query) as HTMLElement;

    // 阻止右键菜单
    elm.addEventListener('contextmenu', ev => {
      ev.preventDefault();
    });

    // 开始拖拽滚动
    elm.addEventListener('mousedown', ev => {
      // 右键
      if(ev.button === 2) {
        ev.preventDefault();

        // 记录起始位置
        const { screenX: ox, screenY: oy } = ev;
        const { scrollLeft: osl, scrollTop: ost } = elm;

        // 滚动事件
        const fnMove = (ev: MouseEvent) => {
          const { screenX: cx, screenY: cy } = ev;
          const dx = cx - ox;
          const dy = cy - oy;
          elm.scrollTo(osl + dx, ost + dy);
        };
        // 滚动结束
        const fnUp = (ev: MouseEvent) => {
          document.removeEventListener('mousemove', fnMove);
          document.removeEventListener('mouseup', fnUp);
        };
        document.addEventListener('mousemove', fnMove);
        document.addEventListener('mouseup', fnUp);
      }
    });
  },
};

export default {
  name: 'drag-scroll',
  directive,
};
