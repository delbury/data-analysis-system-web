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

// 保存到本地
export const saveToLocal = (key: string, data: Record<string, any>) => {
  window.localStorage.setItem(key, JSON.stringify(data));
};

// 从本地获取默认数据并合并
export const initWithLocal = <T = any>(key: string, initData: T) => {
  const text = window.localStorage.getItem(key);
  if(!text) return initData;

  try {
    const localData = JSON.parse(text) as T;
    const mergedData = { ...initData };
    // 本地设置覆盖默认设置
    for(const key in localData) {
      if(key in mergedData) {
        mergedData[key] = localData[key];
      }
    }
    return mergedData;
  } catch(e) {
    return initData;
  }
};
