export interface MiddleAccountRoleTable {
  account_id: number;
  role_id: number;
  // 主键
  id: number;
  // 是否已删除
  is_delete: number;
  // 创建时间
  created_time: string;
  creater_id: number;
}
