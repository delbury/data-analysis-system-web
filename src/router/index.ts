import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { store } from '~/store';
import { AccountTable } from '~types/db-table-type/Account';
import { dynamicRoutes, filterRoute } from './dynamic-routes';
import { createLinks } from '~/store/utils';

const ROOT_ROUTE_NAME = 'root';
const rootRoute: RouteRecordRaw = {
  path: '/',
  name: ROOT_ROUTE_NAME,
  component: () => import('~/pages/layout/index.vue'),
};
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('~/pages/login/index.vue'),
  },
  {
    path: '/:notfound(.*)',
    component: () => import('~/pages/error/404.vue'),
  },
];

// 创建路由
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

// 路由守卫
let hasInitRoute = false; // 是否已经初始化路由
router.beforeEach(async (to, from, next) => {
  if(to.path === '/login') {
    return next();
  }

  // 判断是否已经登录
  let info = store.state.userInfo;
  let isLogin = !!info;

  if(!isLogin) {
    // 请求用户信息
    info = await store.dispatch('getUserInfo') as AccountTable;
    isLogin = !!info;
  }

  if(isLogin && !hasInitRoute && info) {
    hasInitRoute = true;
    // 构造路由
    const paths = info.roles?.map(it => it.permissions).flat().map(it => it.path) ?? [];

    // 现有静态 routes 配置根据返回权限转换成动态 routes，设置到 store
    // 计算顶部 navbar 的导航栏数据及其子页面的导航栏数据
    const routes = filterRoute(dynamicRoutes, paths);
    const routeTree = createLinks(routes);
    // 设置根路由
    rootRoute.redirect = routeTree[0]?.path ?? '';
    router.addRoute(rootRoute);
    routes.forEach(rt => router.addRoute(ROOT_ROUTE_NAME, rt));
    // 设置路由树
    store.commit('setRouteTree', routeTree);
    return next(to.fullPath);
  }

  // 已经登录并且进入登录页面则跳到首页
  if(!isLogin) {
    return next('/login');
  }

  next();
});

export default router;
