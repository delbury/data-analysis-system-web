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
            :index="'/basedata' + item.path"
          >
            {{ item.label }}
          </el-menu-item>
        </template>
      </el-menu>
    </el-aside>

    <el-main class="main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'PageBasedata',
  setup() {
    const route = useRoute();

    const subs = reactive([
      { label: '班组管理', path: '/teamgroup' },
      { label: '人员管理', path: '/people' },
      { label: '其他管理', path: '/other' },
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
