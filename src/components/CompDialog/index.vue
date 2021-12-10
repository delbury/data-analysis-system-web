<template>
  <el-dialog
    v-bind="{ ...dialogProps, ref: void 0 }"
    :model-value="value"
    custom-class="comp-dialog"
    destroy-on-close
    @closed="handleClose()"
  >
    <template #title>
      <slot name="title"></slot>
    </template>
    <slot></slot>

    <template #footer>
      <slot name="footer">
        <el-button
          @click="close()"
        >
          {{ readonly ? '关闭' : '取消' }}
        </el-button>
        <el-button
          v-if="!readonly"
          type="primary"
          :loading="submitting"
          @click="handleSubmit"
        >
          确定
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { ElDialogProps } from './interface';

export default defineComponent({
  name: 'CompDialog',
  props: {
    dialogProps: {
      type: Object as PropType<ElDialogProps>,
      default: () => ({}),
    },
    value: {
      type: Boolean,
      default: false,
    },
    submitAction: {
      type: Function as PropType<(...args: any) => any>,
      default: null,
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const submitting = ref(false);
    const close = () => ctx.emit('update:modelValue', false);

    return {
      close,
      submitting,
      handleClose: () => close(),
      // 确定提交
      handleSubmit: async() => {
        if(props.submitAction) {
          try {
            submitting.value = true;
            const res = await props.submitAction();
            if(res !== false) {
              close();
            }
          } finally {
            submitting.value = false;
          }
        }
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.comp-dialog {
  .comp-dialog__footer {
    display: flex;
  }

  :global(.el-dialog__body) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
