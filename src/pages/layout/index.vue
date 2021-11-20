<template>
  <div class="layout">
    <div class="layout-navbar"></div>

    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageLayout',
  setup() {},
});
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .layout-navbar {
    height: 60px;
    background-color: $bg-blue-10;
  }

  .layout-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
