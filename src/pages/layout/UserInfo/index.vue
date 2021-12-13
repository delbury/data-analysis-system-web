<template>
  <el-dropdown
    class="user-info"
    @command="handleCommand"
  >
    <div class="user-info_wrapper">
      <el-avatar
        size="medium"
        :icon="icons.Avatar"
      ></el-avatar>
      <span class="user-info-name">
        {{ userInfo?.name ?? '-' }}
      </span>
    </div>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="detail">
          查看信息
        </el-dropdown-item>
        <el-dropdown-item command="modify">
          修改密码
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
</template>

<script lang="ts">
import { defineComponent, computed, reactive, nextTick } from 'vue';
import { Avatar } from '@element-plus/icons';
import { useStore } from '~/store';
import UserInfoDetail from './UserInfoDetail.vue';
import ModifyPassword from './ModifyPassword.vue';
import { useRouter } from 'vue-router';
import { apis } from '~/service';
import { ElMessageBox } from 'element-plus';

const icons = { Avatar };

export default defineComponent({
  name: 'UserInfo',
  components: { UserInfoDetail, ModifyPassword },
  setup() {
    const store = useStore();
    const userInfo = computed(() => store.state.userInfo);
    const router = useRouter();

    const visibility = reactive({
      detail: false,
      modify: false,
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

    const handleCommand = (cmd: 'detail' | 'modify' | 'logout') => {
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
        default:
          return;
      }
    };

    return {
      icons,
      userInfo,
      handleCommand,
      visibility,
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
  }

  .user-info-name {
    margin-left: 0.5em;
    font-size: var(--el-font-size-base);
    color: #fff;
  }
}
</style>
