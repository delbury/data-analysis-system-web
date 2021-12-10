import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { store } from '~/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workbench',
    component: () => import('~/pages/layout/index.vue'),
    children: [
      {
        path: '/workbench',
        component: () => import('~/pages/workbench/index.vue'),
      },
      {
        path: '/basedata',
        component: () => import('~/pages/basedata/index.vue'),
        redirect: '/basedata/staff',
        children: [
          {
            path: 'teamgroup',
            component: () => import('~/pages/basedata/TeamGroup.vue'),
          },
          {
            path: 'staff',
            component: () => import('~/pages/basedata/Staff.vue'),
          },
        ],
      },
      {
        path: '/system',
        component: () => import('~/pages/system/index.vue'),
        redirect: '/system/permission',
        children: [
          {
            path: 'role',
            component: () => import('~/pages/system/Role.vue'),
          },
          {
            path: 'permission',
            component: () => import('~/pages/system/Permission.vue'),
          },
          {
            path: 'account',
            component: () => import('~/pages/system/Account.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('~/pages/login/index.vue'),
  },
  {
    path: '/:notfound(.*)',
    redirect: '/',
  },
];

// 创建路由
const router = createRouter({
  history: createWebHistory('/'),
  routes,
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  // 判断是否已经登录
  let isLogin = !!store.state.userInfo;

  if(!isLogin) {
    // 请求登录信息
    isLogin = !!(await store.dispatch('getUserInfo'));
  }

  // 已经登录并且进入登录页面则跳到首页
  if(isLogin && to.path === '/login') return next('/');
  if(!isLogin && to.path !== '/login') return next('/login');

  next();
});

export default router;
