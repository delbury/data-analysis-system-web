<template>
  <div class="page">
    <CompTable
      ref="tableRef"
      v-bind="tableConfig"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :dialog-props="{ width: '80%', top: '8vh' }"
      table-name="培训计划完成表"
      db-table="workbench"
      :row-btns="[
        {
          label: '完成',
          key: 'complete',
          disabled: (row, ps) => row.status !== 1,
          tip: '已完成',
        },
      ]"
      @btn="handleBtnClick"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { getColumns } from './columns';
import { apis } from '~/service';
import { FORM_INIT_VALUES, FORM_ITEMS } from './form';
import { ElMessageBox } from 'element-plus';
import { WorkbenchTable } from '~types/db-table-type';
import { CompTableInstance } from '~/components/CompTable/interface';
import { table } from 'console';

export default defineComponent({
  name: 'PageWorkbench',
  setup() {
    const tableRef = ref<CompTableInstance>();
    // table 参数
    const tableConfig = reactive({
      columns: getColumns(),
      apis: apis.workbench,
    });

    return {
      tableRef,
      tableConfig,
      formInitValues: FORM_INIT_VALUES,
      formItems: reactive(FORM_ITEMS),
      handleBtnClick: ({ key, record }: { key: string, record: WorkbenchTable }) => {
        if(key === 'complete') {
          ElMessageBox.confirm(
            '确认完成该项？',
            '提示',
            { type: 'warning' },
          ).then(async () => {
            // 请求并刷新
            await apis.workbench.postComplete({ id: record.id });
            tableRef.value?.table.refresh();
          }).catch(() => {});
        }
      },
    };
  },
});
</script>
