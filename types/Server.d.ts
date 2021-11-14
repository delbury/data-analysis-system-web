export interface ResponseList<T extends {} = any> {
  code: number;
  msg?: string;
  data: {
    total: number;
    list: T[];
  }
}
