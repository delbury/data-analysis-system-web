import { RouteRecordRaw } from 'vue-router';
import { RouteNode } from './interface';
import { shallowRef } from 'vue';

// 生成路由 link
export const createLinks = (routes: RouteRecordRaw[]): RouteNode[] => {
  const walk = (rs: RouteRecordRaw[], parent?: string) => {
    const nodes: RouteNode[] = [];
    rs.forEach(r => {
      const path = parent ? `${parent}/${r.path}` : r.path;
      nodes.push({
        label: (r.meta?.label ?? '') as string,
        icon: r.meta?.icon ? shallowRef(r.meta?.icon) : void 0,
        path,
        subs: r.children?.length ? walk(r.children) : void 0,
      });
    });
    return nodes;
  };
  return walk(routes);
};
