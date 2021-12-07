<template>
  <el-container class="page">
    <el-aside width="200px">
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
import { defineComponent, PropType } from 'vue';
import { useRoute } from 'vue-router';
import { SubMenuOption } from './interface';

export default defineComponent({
  name: 'PageSubLayout',
  props: {
    subs: {
      type: Array as PropType<SubMenuOption[]>,
      default: () => [],
    },
  },
  setup(props) {
    const route = useRoute();

    return {
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
