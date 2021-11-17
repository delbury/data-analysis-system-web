export interface Response {
  code: number;
}

// 返回列表
export interface ResponseList<T extends {} = any> extends Response{
  msg?: string;
  data: {
    total: number;
    list: T[];
  }
}
