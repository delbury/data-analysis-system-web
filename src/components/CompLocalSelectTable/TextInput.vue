<template>
  <CompDialog title="批量选择" :submit-action="submitAction">
    <el-input
      v-model="text"
      type="textarea"
      placeholder="请输入需要批量选择的数据，每一行一条数据"
      :autosize="{ minRows: 10, maxRows: 20 }"
    ></el-input>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, ref, toRef, watch } from 'vue';

export default defineComponent({
  emits: ['confirm'],
  setup(props, ctx) {
    const text = ref('');
    watch(toRef(ctx.attrs, 'modelValue'), (newVal) => {
      if(!newVal) {
        text.value = '';
      }
    });

    return {
      text,
      submitAction: () => {
        // 处理输入值
        const vals = text.value.split('\n').map(it => it.trim()).filter(it => it);
        const set = new Set(vals);
        ctx.emit('confirm', set);
      },
    };
  },
});
</script>
