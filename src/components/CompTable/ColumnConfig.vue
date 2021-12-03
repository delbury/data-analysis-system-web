<template>
  <!-- <el-button
    :icon="icons.Setting"
    type="text"
  ></el-button> -->
  序号
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Setting } from '@element-plus/icons';

const icons = { Setting };

export default defineComponent({
  setup() {
    return {
      icons,
    };
  },
});
</script>
