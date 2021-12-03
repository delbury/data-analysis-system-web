import { defineComponent, PropType } from 'vue';

export interface SubMenuOption {
  label: string;
  path: string;
  icon?: ReturnType<typeof defineComponent>;
}
