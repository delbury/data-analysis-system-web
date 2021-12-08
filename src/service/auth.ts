import { apiCreater } from './tools';

export const postLogin = apiCreater.post<{
  account: string;
  password: string;
}>('/auth/login');
