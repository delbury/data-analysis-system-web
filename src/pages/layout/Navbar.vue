<template>
  <div class="navbar">
    <div class="logo">
      Data Analysis System
    </div>

    <router-link to="/workbench">
      工作台
    </router-link>
    <router-link to="/basedata">
      信息管理
    </router-link>
    <router-link to="/auth">
      权限管理
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageLayoutNavbar',
  setup() {

  },
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  user-select: none;

  .logo {
    padding: 0 50px;
    font-size: 24px;
    color: inherit;
  }

  > a {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    height: 100%;
    color: inherit;
    text-decoration: none;
    border-bottom: 3px solid transparent;

    &:not(:last-of-type) {
      margin-right: 2em;
    }

    :global(.router-link-active) {
      border-bottom: 3px solid currentColor !important;
    }
  }
}
</style>
