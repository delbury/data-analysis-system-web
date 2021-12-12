import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { AccountTable } from '~types/db-table-type/Account';
import { apis } from '~/service';

export interface IState {
  userInfo: Partial<AccountTable> | null;
  userInfoLoading: boolean;
  globalLoading: boolean;
}

export const key: InjectionKey<Store<IState>> = Symbol();

export const store = createStore<IState>({
  state: {
    userInfo: null,
    userInfoLoading: false,
    globalLoading: false,
  },
  mutations: {
    clearUserInof(state) {
      state.userInfo = null;
    },
    setUserInfo(state, payload: IState['userInfo']) {
      state.userInfo = payload;
    },
    setUserInfoLoading(state, flag: boolean) {
      state.userInfoLoading = flag;
    },
    setGlobalLoading(state, flag: boolean) {
      state.globalLoading = flag;
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
