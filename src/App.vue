<template>
  <el-config-provider :locale="locale" size="small">
    <div
      v-show="loading"
      v-loading="loading"
      class="loading-wrapper"
    >
    </div>
    <router-view
      v-show="!loading"
      v-loading="globalLoading"
    ></router-view>
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import { useStore } from '~/store';

export default defineComponent({
  name: 'App',
  components: {
    ElConfigProvider,
  },
  setup() {
    const store = useStore();

    return {
      locale: zhCn,
      loading: computed(() => store.state.userInfoLoading),
      globalLoading: computed(() => store.state.globalLoading),
    };
  },
});
</script>

<style lang="scss" scoped>
.loading-wrapper {
  height: 100vh;
}
</style>
