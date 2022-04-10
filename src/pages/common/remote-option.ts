/**
 * 远程搜索配置
 */

import { apis } from '~/service';
import { getRemoteSelectFormItemOptions } from '~/components/CompTable/util';
import { CustomSelectOption } from '~/components/CompTable/interface';
import { GROUP_TYPE_MAP, TRAINER_LEVEL_MAP } from './format-maps';


// 班组
export const GROUP_ID_REMOTE_OPTIONS: CustomSelectOption = {
  ...getRemoteSelectFormItemOptions(apis.basedata_teamgroup.get, {
    rebuildLabelField: 'group_name',
    rebuildValueField: 'group_id',
  }),
  optionRender: (item) => {
    const groupType = GROUP_TYPE_MAP[item.extra.type];
    const groupTypeLabel = typeof groupType === 'string' ? groupType : groupType.text;
    return [groupTypeLabel];
  },
};

// 权限
export const PERMISSION_REMOTE_OPTIONS: CustomSelectOption =
  getRemoteSelectFormItemOptions(apis.system_permission.get, {
    rebuildListField: 'permissions',
  });

// 角色
export const ROLE_REMOTE_OPTIONS: CustomSelectOption =
  getRemoteSelectFormItemOptions(apis.system_role.get, {
    rebuildListField: 'roles',
  });

// 人员
export const STAFF_ID_REMOTE_OPTIONS: CustomSelectOption = {
  ...getRemoteSelectFormItemOptions(apis.basedata_staff.get, {
    rebuildLabelField: 'staff_name',
    rebuildValueField: 'staff_id',
  }),
  optionRender: (item) => {
    const groupName = item.extra.group_name;
    const code = item.extra.code;
    return [code, groupName];
  },
};

// 培训师
export const TRAINER_ID_REMOTE_OPTIONS: CustomSelectOption = {
  ...getRemoteSelectFormItemOptions(apis.basedata_trainer.get, {
    rebuildLabelField: 'trainer_name',
    rebuildValueField: 'trainer_id',
  }),
  optionRender: (item) => {
    const level = TRAINER_LEVEL_MAP[item.extra.trainer_level];
    const code = item.extra.staff_code;
    return [code, level];
  },
};
