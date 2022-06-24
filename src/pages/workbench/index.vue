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
        {
          label: '参训人员',
          key: 'record-staff',
        },
      ]"
      @btn="handleBtnClick"
    >
    </CompTable>

    <RecordStaff
      v-if="recordStaff.visible"
      v-model="recordStaff.visible"
      :detail="currentRow"
      @refresh="handleRefresh"
    ></RecordStaff>
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
import RecordStaff from './RecordStaff.vue';

export default defineComponent({
  name: 'PageWorkbench',
  components: { RecordStaff },
  setup() {
    const tableRef = ref<CompTableInstance>();
    // table 参数
    const tableConfig = reactive({
      columns: getColumns(),
      apis: apis.workbench,
    });

    // 当前行
    const currentRow = ref<WorkbenchTable>();

    // 录入参训人员
    const recordStaff = reactive({
      visible: false,
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
        } else if(key === 'record-staff') {
          // 录入人员
          recordStaff.visible = true;
          currentRow.value = record;
        }
      },
      recordStaff,
      currentRow,
      handleRefresh: () => {
        tableRef.value?.table.refresh();
      },
    };
  },
});
</script>
