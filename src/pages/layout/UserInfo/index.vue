<template>
  <el-dropdown
    class="user-info"
    @command="handleCommand"
  >
    <div class="user-info_wrapper">
      <el-avatar
        size="small"
        :icon="icons.Avatar"
      ></el-avatar>
      <span class="user-info-name">
        {{ userInfo?.name ?? '-' }}
      </span>
      <el-icon>
        <arrow-down />
      </el-icon>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="detail">
          查看信息
        </el-dropdown-item>
        <el-dropdown-item command="config">
          客户端配置
        </el-dropdown-item>

        <el-dropdown-item v-if="isAdmin" command="devops" divided>
          运维操作
        </el-dropdown-item>

        <el-dropdown-item command="modify" divided>
          修改密码
        </el-dropdown-item>
        <el-dropdown-item command="switch">
          切换账号
        </el-dropdown-item>
        <el-dropdown-item command="logout">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <!-- 详情 -->
  <UserInfoDetail
    v-if="visibility.detail"
    v-model="visibility.detail"
    :user-info="userInfo"
  ></UserInfoDetail>

  <!-- 修改密码 -->
  <ModifyPassword
    v-if="visibility.modify"
    v-model="visibility.modify"
    :user-info="userInfo"
  ></ModifyPassword>

  <!-- 客户端配置 -->
  <ModifyClientConfig
    v-if="visibility.config"
    v-model="visibility.config"
  ></ModifyClientConfig>

  <!-- 运维操作 -->
  <DevOps v-if="visibility.devops" v-model="visibility.devops"></DevOps>
</template>

<script lang="ts">
import { defineComponent, computed, reactive, nextTick } from 'vue';
import { Avatar, ArrowDown } from '@element-plus/icons';
import { useStore } from '~/store';
import UserInfoDetail from './UserInfoDetail.vue';
import ModifyPassword from './ModifyPassword.vue';
import ModifyClientConfig from './ModifyClientConfig.vue';
import DevOps from './DevOps.vue';
import { useRouter } from 'vue-router';
import { apis } from '~/service';
import { ElMessageBox } from 'element-plus';

const icons = { Avatar };

type Cmds = 'detail' | 'modify' | 'logout' | 'config' | 'devops' | 'switch';

export default defineComponent({
  name: 'UserInfo',
  components: { UserInfoDetail, ModifyPassword, ArrowDown, ModifyClientConfig, DevOps },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.state.userInfo);
    const isAdmin = computed(() => store.state.permissionsSet.has('all'));
    const router = useRouter();

    const visibility = reactive({
      detail: false,
      modify: false,
      config: false,
      devops: false,
    });

    // 登出
    const logout = async() => {
      try {
        await ElMessageBox.confirm(
          '确认退出登录？',
          '提示',
          { type: 'warning' },
        );
        store.commit('setGlobalLoading', true);
        await apis.auth.postLogout();
        store.commit('clearUserInof');
        window.location.reload();
      } finally {
        store.commit('setGlobalLoading', false);
      }
    };

    const handleCommand = (cmd: Cmds) => {
      switch(cmd) {
        case 'detail':
          visibility.detail = true;
          break;
        case 'modify':
          visibility.modify = true;
          break;
        case 'logout':
          logout();
          break;
        case 'config':
          visibility.config = true;
          break;
        case 'devops':
          visibility.devops = true;
          break;
        case 'switch':
          router.push('/login');
          break;
        default:
          return;
      }
    };

    return {
      icons,
      userInfo,
      handleCommand,
      visibility,
      isAdmin,
    };
  },
});
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;

  .user-info_wrapper {
    display: flex;
    align-items: center;
    color: #fff;
  }

  .user-info-name {
    margin-left: 0.5em;
    font-size: var(--el-font-size-base);
  }
}
</style>
