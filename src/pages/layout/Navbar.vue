<template>
  <div class="navbar">
    <div class="logo">
      Data Analysis System
    </div>

    <template
      v-for="item in links"
      :key="item.path"
    >
      <router-link :to="item.path">
        {{ item.label }}
      </router-link>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageLayoutNavbar',
  setup() {
    return {
      links: [
        { label: '工作台', path: '/workbench' },
        { label: '信息管理', path: '/basedata' },
        { label: '系统管理', path: '/system' },
      ],
    };
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
