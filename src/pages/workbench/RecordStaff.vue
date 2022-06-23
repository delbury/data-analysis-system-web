<template>
  <CompDialog title="录入参训人员" :submit-action="submitAction">
    <CompLocalSelectTable
      ref="selectRef"
      :data="tableData"
      :columns="columns"
      :batch-select-fields="['name', 'code']"
      @selection-change="handleSelectionChange"
    ></CompLocalSelectTable>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, shallowRef, PropType, watch, toRef, ref, nextTick } from 'vue';
import { apis } from '~/service';
import { ColumnProps } from '~/components/CompTable/interface';
import { SafeStaffInfo } from '~/service/basedata_staff';
import common from '~/pages/common';
import { WorkbenchTable } from '~types/db-table-type';

const columns: ColumnProps[] = [
  {
    label: '姓名',
    prop: 'name',
  },
  {
    label: '工号',
    prop: 'code',
  },
  {
    label: '性别',
    prop: 'sex',
    formatMap: common.maps.STAFF_SEX_MAP,
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
    const selectRef = ref();
    const tableData = shallowRef<SafeStaffInfo[]>([]);
    const selectedData = shallowRef<SafeStaffInfo[]>([]);

    onMounted(async () => {
      const res = await apis.basedata_staff.getAllList();
      tableData.value = res.data.data.list;
    });

    const visible = toRef(ctx.attrs, 'modelValue');
    watch(visible, (newVal) => {
      if(newVal) {
        // 勾选
        nextTick(() => {
          const ids = props.detail?.trained_staffs;
          selectRef.value?.setRowsSelectionById(ids, true);
          !!ids?.length && selectRef.value?.switchToSelected();
        });
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
    };
  },
});
</script>
