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
