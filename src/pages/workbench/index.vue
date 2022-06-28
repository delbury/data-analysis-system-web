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
      v-if="visibility.staffs"
      v-model="visibility.staffs"
      :detail="currentRow"
      @refresh="handleRefresh"
    ></RecordStaff>

    <CompleteModal
      v-if="visibility.complete"
      v-model="visibility.complete"
      :detail="currentRow"
      @refresh="handleRefresh"
    ></CompleteModal>
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
import CompleteModal from './CompleteModal.vue';

export default defineComponent({
  name: 'PageWorkbench',
  components: { RecordStaff, CompleteModal },
  setup() {
    const tableRef = ref<CompTableInstance>();
    // table 参数
    const tableConfig = reactive({
      columns: getColumns(),
      apis: apis.workbench,
    });

    // 当前行
    const currentRow = ref<WorkbenchTable>();

    const visibility = reactive({
      // 录入参训人员
      staffs: false,
      // 完成情况
      complete: false,
    });

    return {
      tableRef,
      tableConfig,
      formInitValues: FORM_INIT_VALUES,
      formItems: reactive(FORM_ITEMS),
      handleBtnClick: ({ key, record }: { key: string, record: WorkbenchTable }) => {
        currentRow.value = record;
        if(key === 'complete') {
          // 完成信息
          visibility.complete = true;
        } else if(key === 'record-staff') {
          // 录入人员
          visibility.staffs = true;
        }
      },
      visibility,
      currentRow,
      handleRefresh: () => {
        tableRef.value?.table.refresh();
      },
    };
  },
});
</script>
