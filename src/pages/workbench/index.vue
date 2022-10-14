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
      selectable
      @btn="handleBtnClick"
      @selection-change="handleSelectionChange"
    >
      <template #footer>
        <comp-button
          :tip="selected.length ? '批量导出参训人员' : '请选择需要导出的数据'"
          :button-props="{ loading: false }"
          :icon="icons.MessageBox"
          @click="handleBatchExport"
        ></comp-button>
      </template>
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
import { FORM_INIT_VALUES, FORM_ITEMS } from './form';
import { WorkbenchTable } from '~types/db-table-type';
import { CompTableInstance } from '~/components/CompTable/interface';
import RecordStaff from './RecordStaff.vue';
import CompleteModal from './CompleteModal.vue';
import { MessageBox } from '@element-plus/icons';
import { ElMessage } from 'element-plus';
import { apis } from '~/service';
import { SafeStaffInfo } from '~/service/basedata_staff';
import { saveSheetsFile } from '~/components/CompTable/xlsx/export';
import { recordStaffColumns } from './columns';

const exportColumns = (() => {
  const res: typeof recordStaffColumns = [];
  ['code', 'name', 'position'].forEach(key => {
    recordStaffColumns.forEach(it => {
      if(it.prop === key) {
        res.push(it);
      }
    });
  });
  return res;
})();

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

    // 已选择
    const selected = ref<WorkbenchTable[]>([]);

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
      selected,
      handleSelectionChange: (selection: WorkbenchTable[]) => {
        selected.value = selection;
      },
      handleBatchExport: async() => {
        if(!selected.value.length) {
          return ElMessage.warning('请选择需要导出的数据');
        }
        // 获取全量人员列表
        const res = await apis.basedata_staff.getAllList();
        const allStaffListMap: Record<number, SafeStaffInfo> = {};
        res.data.data.list?.forEach(item => allStaffListMap[item.id] = item);

        // 循环生成 sheets
        const sheets = selected.value.map(record => {
          const staffList = record.trained_staffs?.map(id => allStaffListMap[id]) ?? [];
          return {
            data: staffList,
            columns: exportColumns,
            tableName: `${record.project_code}`,
            // tableName: `${record.project_code}__${record.train_project_name}`,
            extra: {
              extraFontRows: [[
                { data: `培训项目名称及课程(${record.project_code})` },
                { data: record.train_project_name },
                { data: record.train_course_name },
              ]],
            },
          };
        });

        // 生成并下载文件
        saveSheetsFile(sheets, {
          fileName: '培训课程参训人员',
          mergeAllSheets: true,
        });
      },
      icons: {
        MessageBox,
      },
    };
  },
});
</script>
