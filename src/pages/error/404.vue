<template>
  <div class="page page-404 flex-center-v">
    <h3>没有权限或者无效路径</h3>
    <el-button @click="goHome">
      返回首页
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageError404',
  setup() {
    const router = useRouter();
    return {
      goHome: () => {
        router.push('/');
      },
    };
  },
});
</script>
