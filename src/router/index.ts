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
        redirect: '/basedata/teamgroup',
        children: [
          {
            path: 'teamgroup',
            component: () => import('/@/pages/basedata/TeamGroup.vue'),
          },
        ],
      },
      {
        path: '/auth',
        component: () => import('/@/pages/auth/index.vue'),
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
