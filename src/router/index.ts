import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/workbench',
    component: () => import('/@/pages/layout/index.vue'),
    children: [
      {
        path: '/workbench',
        component: () => import('/@/pages/workbench/index.vue'),
      },
      {
        path: '/basedata',
        component: () => import('/@/pages/basedata/index.vue'),
        redirect: '/basedata/staff',
        children: [
          {
            path: 'teamgroup',
            component: () => import('/@/pages/basedata/TeamGroup.vue'),
          },
          {
            path: 'staff',
            component: () => import('/@/pages/basedata/Staff.vue'),
          },
        ],
      },
      {
        path: '/system',
        component: () => import('/@/pages/system/index.vue'),
        redirect: '/system/role',
        children: [
          {
            path: 'role',
            component: () => import('/@/pages/system/Role.vue'),
          },
          {
            path: 'permission',
            component: () => import('/@/pages/system/Permission.vue'),
          },
          {
            path: 'account',
            component: () => import('/@/pages/system/Account.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/:notfound(.*)',
    redirect: '/',
  },
];


export default createRouter({
  history: createWebHistory('/'),
  routes,
});
