import { CommonTable } from './Common';
import { StaffTable } from './Staff';

export interface TrainerTable extends CommonTable {
  // 关联的系统内的员工
  staff_id: number;
  staff_name: StaffTable['name'];
  staff_sex: StaffTable['sex'];
  staff_code: StaffTable['code'];
  staff_phone: StaffTable['phone'];
  group_id: StaffTable['group_id'];
  // 培训师星级
  level: number;
  remark: string;
  // 主键
  id: number;
  // 是否已删除
  is_delete: number;
  // 是否是系统创建的数据
  is_system: number;
  // 创建时间
  created_time: string;
  // 最后一次修改时间
  last_modified_time: string;
  // 创建者
  creater_id: number;
  // 最后一次修改者
  last_modified_account_id: number;
}
