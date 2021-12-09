<template>
  <div class="page">
    <CompTable
      v-bind="tableConfig"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :dialog-props="{ width: '80%', top: '8vh' }"
      table-name="培训计划完成表"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { getColumns } from './columns';
import { apis } from '~/service';
import { FORM_INIT_VALUES, FORM_ITEMS } from './form';

export default defineComponent({
  name: 'PageWorkbench',
  setup() {
    // table 参数
    const tableConfig = reactive({
      columns: getColumns(),
      apis: apis.workbench,
    });

    return {
      tableConfig,
      formInitValues: FORM_INIT_VALUES,
      formItems: reactive(FORM_ITEMS),
    };
  },
});
</script>
