import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { AccountTable } from '~types/db-table-type/Account';
import { apis } from '~/service';
import { RouteNode } from './interface';

export interface IState {
  // 登录后的用户信息
  userInfo: Partial<AccountTable> | null;
  // 登录中
  userInfoLoading: boolean;
  // 全局 loading
  globalLoading: boolean;
  // 动态路由树
  routeTree: RouteNode[];
  // 权限列表
  permissionsSet: Set<string>;
}

export const key: InjectionKey<Store<IState>> = Symbol();

export const store = createStore<IState>({
  state: {
    userInfo: null,
    userInfoLoading: false,
    globalLoading: false,
    routeTree: [],
    permissionsSet: new Set(),
  },
  mutations: {
    clearUserInof(state) {
      state.userInfo = null;
      state.permissionsSet = new Set();
    },
    // 设置用户信息
    setUserInfo(state, payload: IState['userInfo']) {
      state.userInfo = payload;
      const ps = new Set(payload?.roles?.map(it => it.permissions).flat().map(it => it.tags).flat());
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
