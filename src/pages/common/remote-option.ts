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
type GetParams = Parameters<typeof getRemoteSelectFormItemOptions>[1]
export const getStaffIdRemoteOptions = (params?: GetParams, opt?: { showLevel?: boolean }): CustomSelectOption => ({
  ...getRemoteSelectFormItemOptions(apis.basedata_staff.getAllList, {
    rebuildLabelField: 'staff_name',
    rebuildValueField: 'staff_id',
    ...params,
  }),
  optionRender: (item) => {
    const groupName = item.extra.group_name;
    const code = item.extra.code;
    const level = TRAINER_LEVEL_MAP[item.extra.level];
    return opt?.showLevel ? [code, level, groupName] : [code, groupName];
  },
});
export const STAFF_ID_REMOTE_OPTIONS = getStaffIdRemoteOptions();
