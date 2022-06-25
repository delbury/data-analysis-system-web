<template>
  <CompDialog
    title="录入参训人员"
    :submit-action="submitAction"
    :dialog-props="{ width: '1000px' }"
  >
    <CompLocalSelectTable
      ref="selectRef"
      :data="tableData"
      :columns="columns"
      :batch-select-fields="['name', 'code']"
      height="40vh"
      :loading="loading"
      :export-file-name="exportFileName"
      :need-export-fields="['name', 'code', 'position']"
      @selection-change="handleSelectionChange"
    ></CompLocalSelectTable>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, shallowRef, PropType, ref, nextTick, computed } from 'vue';
import { apis } from '~/service';
import { ColumnProps } from '~/components/CompTable/interface';
import { SafeStaffInfo } from '~/service/basedata_staff';
import common from '~/pages/common';
import { WorkbenchTable } from '~types/db-table-type';

const columns: ColumnProps[] = [
  {
    label: '姓名',
    prop: 'name',
    width: '100px',
  },
  {
    label: '工号',
    prop: 'code',
    width: '100px',
  },
  {
    label: '性别',
    prop: 'sex',
    formatMap: common.maps.STAFF_SEX_MAP,
    width: '100px',
  },
  {
    label: '岗位',
    prop: 'position',
  },
  {
    label: '班组类型',
    prop: 'group_type',
    width: '100px',
    formatMap: common.maps.GROUP_TYPE_MAP,
  },
  {
    label: '班组',
    prop: 'group_name',
  },
];

export default defineComponent({
  props: {
    detail: {
      type: Object as PropType<WorkbenchTable>,
    },
  },
  emits: ['refresh'],
  setup(props, ctx) {
    const loading = ref(false);
    const selectRef = ref();
    const tableData = shallowRef<SafeStaffInfo[]>([]);
    const selectedData = shallowRef<SafeStaffInfo[]>([]);

    onMounted(async () => {
      try {
        loading.value = true;
        const res = await apis.basedata_staff.getAllList();
        tableData.value = res.data.data.list;

        // 勾选
        nextTick(() => {
          const ids = props.detail?.trained_staffs;
          selectRef.value?.setRowsSelectionById(ids, true);
          !!ids?.length && selectRef.value?.switchToSelected();
        });
      } finally {
        loading.value = false;
      }
    });

    return {
      columns,
      tableData,
      handleSelectionChange: (vals: SafeStaffInfo[]) => {
        selectedData.value = vals;
      },
      submitAction: async () => {
        const ids = selectedData.value.map(it => it.id);
        await apis.workbench.putTrainedStaffs({ trained_staffs: ids, id: props.detail?.id });
        ctx.emit('refresh');
      },
      selectRef,
      loading,
      exportFileName: computed(() => `${props.detail?.project_code ?? ''}_参训人员名单`),
    };
  },
});
</script>
