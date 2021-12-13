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
        <transition
          name="fade"
          mode="out-in"
        >
          <!-- <keep-alive> -->
          <component
            :is="Component"
          ></component>
          <!-- </keep-alive> -->
        </transition>
      </router-view>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '~/store';

export default defineComponent({
  name: 'PageSubLayout',
  props: {
    rootPath: {
      type: String,
      default: '',
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const store = useStore();

    return {
      route,
      subs: computed(() => {
        const root = store.state.routeTree.find(it => it.path === props.rootPath);
        return root
          ? (root.subs ?? []).map(it => ({
            ...it,
            path: `${props.rootPath}/${it.path}`,
          }))
          : [];
      }),
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
