import { InjectionKey } from 'vue';
import { createStore, Store, useStore as _useStore } from 'vuex';
import { AccountTable } from '~types/db-table-type/Account';

export interface IState {
  userInfo: Partial<AccountTable> | null;
}

export const key: InjectionKey<Store<IState>> = Symbol();

export const store = createStore<IState>({
  state: {
    userInfo: null,
  },
  mutations: {
    setUserInfo(state, payload) {
      state.userInfo = payload;
    },
  },
});

export const useStore = () => _useStore(key);
