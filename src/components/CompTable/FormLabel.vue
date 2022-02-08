<template>
  <span class="label-wrapper">
    <span>{{ item.label }}</span>

    <el-tooltip
      v-if="!!item.tip"
      :content="item.tip"
      :disabled="item.tip.length <= 4"
    >
      <span>{{ formatLabel(item.tip) }}</span>
    </el-tooltip>

    <span
      v-if="!!item.info"
      class="info"
    >
      <el-tooltip
        v-if="!!item.info"
        :content="item.info"
      >
        <el-icon class="info-icon"><warning /></el-icon>
      </el-tooltip>
    </span>
  </span>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormItem } from './interface';
import { Warning } from '@element-plus/icons';

export default defineComponent({
  components: { Warning },
  props: {
    item: {
      type: Object as PropType<FormItem>,
      default: () => {},
    },
  },
  setup() {
    return {
      formatLabel: (tip?: string) => {
        if(!tip) return '';
        return `(${tip.length < 4 ? tip : tip.slice(0, 4) + '...'})`;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.label-wrapper {
  display: inline-flex;
  align-items: center;
}

.info {
  display: inline-flex;
  align-items: center;

  .info-icon {
    padding-left: 0.5em;
  }
}
</style>
