export interface Response<T = any> {
  code: number;
  msg?: string;
  data: T;
}

export interface Page<T = any> {
  total: number;
  list: T[];
}

// 返回列表
export type ResponseList<T extends {} = any> = Response<Page<T>>
