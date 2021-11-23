<template>
  <div class="layout">
    <div class="layout-navbar">
      <Navbar></Navbar>
    </div>

    <div class="layout-content">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component
            :is="Component"
            :key="route.path"
          ></component>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './Navbar.vue';

export default defineComponent({
  name: 'PageLayout',
  components: { Navbar },
  setup() {},
});
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .layout-navbar {
    z-index: 10;
    height: 60px;
    background-color: $bg-blue-10;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  }

  .layout-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
