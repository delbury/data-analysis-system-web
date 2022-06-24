<template>
  <comp-dialog
    :model-value="value"
    title="客户端配置"
    :dialog-props="{ width: '500px' }"
    :submit-action="submitAction"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="120px"
    >
      <el-form-item
        label="默认表格页大小"
        prop="defaultTablePageSize"
        :rules="[formRules.required]"
      >
        <el-select-v2
          v-model="form.defaultTablePageSize"
          style="width: 100%;"
          :options="tablePageSizes"
        ></el-select-v2>
      </el-form-item>
    </el-form>
  </comp-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, unref } from 'vue';
import { FormInstance, FormItemRule } from '~/components/CompTable/interface';
import { formRules } from '~/components/CompTable/DialogForm/form-rules';
import { useStore } from '~/store';

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore();

    const form = reactive({
      defaultTablePageSize: unref(store.state.clientConfig.defaultTablePageSize),
    });
    const formRef = ref<FormInstance>();

    return {
      form,
      formRef,
      formRules,
      submitAction: async () => {
        await formRef.value?.validate();
        store.commit('setClientConfig', { ...form });
      },
      tablePageSizes: computed(() => store.state.clientConfig.tablePageSizes.map(it => ({
        label: it,
        value: it,
      }))),
    };
  },
});
</script>
