<template>
  <div class="layout">
    <div class="layout-navbar">
      <Navbar></Navbar>
      <UserInfo></UserInfo>
    </div>

    <div class="layout-content">
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <transition
          name="fade"
          mode="out-in"
        >
          <component
            :is="Component"
          ></component>
        </transition>
        <!-- </keep-alive> -->
      </router-view>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from './Navbar.vue';
import UserInfo from './UserInfo/index.vue';

export default defineComponent({
  name: 'PageLayout',
  components: { Navbar, UserInfo },
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
    display: flex;
    justify-content: space-between;
    height: 60px;
    padding: 0 50px;
    background-color: $bg-blue-10;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  }

  .layout-content {
    flex: 1;
    overflow: auto;
  }
}
</style>
