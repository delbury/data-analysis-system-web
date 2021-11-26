<template>
  <el-tooltip
    placement="top"
    v-bind="tooltipProps"
    :disabled="disabled || !tip"
    :content="tip"
  >
    <el-button
      v-bind="buttonProps"
      :disabled="disabled"
      :icon="icon"
      @click="$emit('click')"
    ></el-button>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { ElTooltip, ElButton } from 'element-plus';

type ElButtonProps = InstanceType<typeof ElButton>['$props'];
type ElTooltipProps = InstanceType<typeof ElTooltip>['$props'];

export default defineComponent({
  name: 'CompButton',
  props: {
    tooltipProps: {
      type: Object as PropType<ElTooltipProps>,
      default: () => ({}),
    },
    buttonProps: {
      type: Object as PropType<ElButtonProps>,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    tip: {
      type: String,
      default: '',
    },
    icon: {
      type: Object as PropType<ElButtonProps['icon']>,
      default: void 0,
    },
  },
  emits: ['click'],
  setup() {

  },
});
</script>
