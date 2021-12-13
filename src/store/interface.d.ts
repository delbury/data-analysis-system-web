import { defineComponent, PropType } from 'vue';

export type RouteNode = {
  label: string;
  path: string;
  icon?: ReturnType<typeof defineComponent>;
  subs?: RouteNode[];
};
