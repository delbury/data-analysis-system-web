import { defineComponent } from 'vue';
import { useLocale, useLocaleProps } from 'element-plus';
import locale from 'element-plus/lib/locale/lang/zh-cn';
import 'dayjs/locale/zh-cn';

export default defineComponent({
  name: 'LocaleProvider',
  props: {
    // ...useLocaleProps,
    locale: {
      type: Object,
      default: locale,
    },
  },
  setup(props, ctx) {
    useLocale();
    return ctx.slots.default;
  },
});
