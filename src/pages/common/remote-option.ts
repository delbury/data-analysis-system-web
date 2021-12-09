/**
 * 远程搜索配置
 */

import { apis } from '~/service';
import { getRemoteSelectFormItemOptions } from '~/components/CompTable/util';

// 班组
export const GROUP_ID_REMOTE_OPTIONS = getRemoteSelectFormItemOptions(apis.basedata_teamgroup.get, {
  rebuildLabelField: 'group_name',
  rebuildValueField: 'group_id',
});

// 权限
export const PERMISSION_REMOTE_OPTIONS = getRemoteSelectFormItemOptions(apis.system_permission.get, {
  rebuildListField: 'permissions',
});

// 角色
export const ROLE_REMOTE_OPTIONS = getRemoteSelectFormItemOptions(apis.system_role.get, {
  rebuildListField: 'roles',
});
