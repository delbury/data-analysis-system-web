import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { AccountTable } from '~types/db-table-type/Account';
import { apis } from '~/service';
import { RouteNode } from './interface';
import { saveToLocal, initWithLocal } from './utils';

export interface IState {
  // 登录后的用户信息
  userInfo: Partial<AccountTable> | null;
  // 登录中
  userInfoLoading: boolean;
  // 全局 loading
  globalLoading: boolean;
  // 动态路由树
  routeTree: RouteNode[];
  // 用户权限列表集合
  permissionsSet: Set<string>;
  // 默认客户端设置
  clientConfig: {
    // 表格可选分页 size
    tablePageSizes: number[];
    // 表格默认分页 size
    defaultTablePageSize: number;
  };
}

export const key: InjectionKey<Store<IState>> = Symbol();

export const store = createStore<IState>({
  state: {
    userInfo: null,
    userInfoLoading: false,
    globalLoading: false,
    routeTree: [],
    permissionsSet: new Set(),
    clientConfig: initWithLocal('clientConfig', {
      tablePageSizes: [10, 20, 50, 100],
      defaultTablePageSize: 20,
    }),
  },
  mutations: {
    clearUserInof(state) {
      state.userInfo = null;
      state.permissionsSet = new Set();
    },
    // 设置用户信息
    setUserInfo(state, payload: IState['userInfo']) {
      state.userInfo = payload;
      const ps = new Set(payload?.roles?.map(it => it.permissions).flat().map(it => it.apis).flat());
      state.permissionsSet = ps;
    },
    setUserInfoLoading(state, flag: boolean) {
      state.userInfoLoading = flag;
    },
    setGlobalLoading(state, flag: boolean) {
      state.globalLoading = flag;
    },
    setRouteTree(state, tree: RouteNode[]) {
      state.routeTree = tree;
    },
    setClientConfig(state, config: Partial<IState['clientConfig']>) {
      for(const key in config) {
        if(key in state.clientConfig) {
          state.clientConfig[key] = config[key];
        }
      }
      saveToLocal('clientConfig', state.clientConfig);
    },
  },
  actions: {
    // 获取用户信息
    async getUserInfo(store) {
      if(!store.state.userInfo) {
        try {
          store.commit('setUserInfoLoading', true);
          const logInfo = await apis.auth.getUserInfo();
          const userInfo = logInfo.data.data;
          store.commit('setUserInfo', userInfo);
        } finally {
          store.commit('setUserInfoLoading', false);
        }
      }
      return store.state.userInfo;
    },
  },
});

export const useStore = () => _useStore(key);
