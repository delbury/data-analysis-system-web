import { RouteRecordRaw } from 'vue-router';
import { SetUp, Key, Open, User, OfficeBuilding } from '@element-plus/icons';

// 构造动态路由
export const filterRoute = (routes: RouteRecordRaw[], allowPaths: string[]): RouteRecordRaw[] => {
  const allowPathsSet = new Set(allowPaths);
  if(allowPathsSet.has('/')) {
    return routes;
  }

  const walk = (rs: RouteRecordRaw[], parent?: string) => {
    const list: RouteRecordRaw[] = [];
    rs.forEach(item => {
      const path = parent ? `${parent}/${item.path}` : item.path;

      if(allowPathsSet.has(path)) {
        // 全量配置
        list.push(item);
      } else if(item.children?.length) {
        // 非全量，且拥有子页面
        if(item.children.some(it => allowPathsSet.has(`${path}/${it.path}`))) {
          const temp = { ...item };
          temp.children = walk(item.children, path);
          temp.redirect = temp.children?.length ? `${path}/${temp.children[0].path}` : void 0;
          list.push(temp);
        }
      }
    });
    return list;
  };
  return walk(routes);
};

// 动态路由部分
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/workbench',
    component: () => import('~/pages/workbench/index.vue'),
    meta: {
      label: '工作台',
    },
  },
  {
    path: '/basedata',
    component: () => import('~/pages/basedata/index.vue'),
    redirect: '/basedata/staff',
    meta: {
      label: '信息管理',
    },
    children: [
      {
        path: 'staff',
        component: () => import('~/pages/basedata/Staff.vue'),
        meta: {
          label: '人员管理',
          icon: User,
        },
      },
      {
        path: 'trainer',
        component: () => import('~/pages/basedata/Trainer.vue'),
        meta: {
          label: '培训师管理',
          icon: User,
        },
      },
      {
        path: 'teamgroup',
        component: () => import('~/pages/basedata/TeamGroup.vue'),
        meta: {
          label: '班组管理',
          icon: OfficeBuilding,
        },
      },
    ],
  },
  {
    path: '/system',
    component: () => import('~/pages/system/index.vue'),
    redirect: '/system/permission',
    meta: {
      label: '系统管理',
    },
    children: [
      {
        path: 'permission',
        component: () => import('~/pages/system/Permission.vue'),
        meta: {
          label: '权限管理',
          icon: Open,
        },
      },
      {
        path: 'role',
        component: () => import('~/pages/system/Role.vue'),
        meta: {
          label: '角色管理',
          icon: SetUp,
        },
      },
      {
        path: 'account',
        component: () => import('~/pages/system/Account.vue'),
        meta: {
          label: '账号管理',
          icon: Key,
        },
      },
    ],
  },
];
