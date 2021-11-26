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

        // 记录元素的宽度
        const selfWidth = window.parseInt(window.getComputedStyle(elm).width);
        let childWidth = selfWidth;
        Array.from(elm.children).forEach(child => {
          childWidth = Math.max(window.parseInt(window.getComputedStyle(child).width));
        });

        // 横向比例滚动
        const scaleWidth = selfWidth < childWidth ? (childWidth - selfWidth) / 500 : 1;

        // 滚动事件
        const fnMove = (ev: MouseEvent) => {
          const { screenX: cx, screenY: cy } = ev;
          const dx = (cx - ox) * scaleWidth;
          const dy = cy - oy;
          elm.scrollTo(osl - dx, ost - dy);
        };
        // 滚动结束
        const fnUp = (ev: MouseEvent) => {
          document.removeEventListener('mousemove', fnMove);
          document.removeEventListener('mouseup', fnUp);
          document.body.classList.remove('grabbing');
        };
        document.body.classList.add('grabbing');
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
