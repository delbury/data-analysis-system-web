<template>
  <el-container class="page">
    <el-aside>
      <el-menu
        mode="vertical"
        class="sub-menu"
        router
        :default-active="route.path"
      >
        <template
          v-for="item in subs"
          :key="item.path"
        >
          <el-menu-item
            :index="item.path"
          >
            <el-icon v-if="item.icon">
              <component :is="item.icon"></component>
            </el-icon>
            {{ item.label }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-main class="main">
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <component
          :is="Component"
        ></component>
        <!-- </keep-alive> -->
      </router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive, shallowRef } from 'vue';
import { useRoute } from 'vue-router';
import { User, OfficeBuilding } from '@element-plus/icons';

interface SubMenuOption {
  label: string;
  path: string;
  icon?: ReturnType<typeof defineComponent>;
}

export default defineComponent({
  name: 'PageBasedata',
  setup() {
    const route = useRoute();

    const subs = reactive<SubMenuOption[]>([
      { label: '人员管理', path: '/basedata/staff', icon: shallowRef(User) },
      { label: '班组管理', path: '/basedata/teamgroup', icon: shallowRef(OfficeBuilding) },
      // { label: '权限管理', path: '/basedata/auth' },
    ]);

    return {
      subs,
      route,
    };
  },
});
</script>

<style lang="scss" scoped>
.sub-menu {
  height: 100%;
}

.main {
  padding: 0;
}
</style>
