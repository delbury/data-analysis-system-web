import { apiCreater } from './tools';

// 登录
export const postLogin = apiCreater.post<{
  account: string;
  password: string;
}>('/auth/login');

// 登出
export const postLogout = apiCreater.post('/auth/logout');

// 获取用户信息
export const getUserInfo = apiCreater.get('/auth/info');
