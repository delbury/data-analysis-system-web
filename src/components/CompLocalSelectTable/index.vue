<template>
  <el-tabs type="card" :model-value="activeTab" @tab-change="(v) => activeTab = v">
    <el-tab-pane label="全部列表" name="all">
      <CompLocalTable
        ref="listRef"
        :data="data"
        :columns="columns"
        :row-key="rowKey"
        has-selection
        @selection-change="handleSelectionChange"
      ></CompLocalTable>
    </el-tab-pane>

    <el-tab-pane label="已选列表" name="selected">
      <template #label>
        <span>已选列表</span>
        <span style="margin-left: 0.5em; color: var(--el-color-primary);">{{ selectedData.length }}</span>
      </template>

      <CompLocalTable
        :data="selectedData"
        :columns="columns"
        :show-operation="['delete']"
        @update:data="handleDelete"
      ></CompLocalTable>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType, shallowRef, ref } from 'vue';
import ElTableColumn from 'element-plus/es/components/table/src/tableColumn';

export default defineComponent({
  name: 'CompLocalSelectTable',
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<typeof ElTableColumn[]>,
      default: () => [],
    },
    // 主键
    rowKey: {
      type: String,
      default: 'id',
    },
  },
  emits: ['selection-change'],
  setup(props, ctx) {
    const activeTab = ref<'all' | 'selected'>('all');
    const listRef = ref();
    const selectedData = shallowRef<any[]>([]);

    return {
      activeTab,
      listRef,
      selectedData,
      handleSelectionChange: (selection: any[]) => {
        selectedData.value = selection;
        ctx.emit('selection-change', selectedData.value);
      },
      handleDelete: (newData: any[], row: any, index: number) => {
        if(listRef.value) {
          listRef.value.tableRef.toggleRowSelection(row, false);
        }
      },
      setRowsSelection: (rows: any[], flag = true) => {
        if(listRef.value) {
          for(const row of rows) {
            listRef.value.tableRef.toggleRowSelection(row, flag);
          }
        }
      },
      setRowsSelectionById: (ids: (number | string)[], flag: boolean) => {
        if(listRef.value) {
          const set = new Set(ids);
          const rows = props.data.filter(it => set.has(it[props.rowKey]));
          for(const row of rows) {
            listRef.value.tableRef.toggleRowSelection(row, flag);
          }
        }
      },
      // 切换到已选列表
      switchToSelected: () => {
        activeTab.value = 'selected';
      },
    };
  },
});
</script>
