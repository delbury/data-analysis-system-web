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
      >
        <template #header-extra="{ data }">
          <el-tooltip content="批量选择">
            <span>
              <el-link
                v-if="batchSelectFieldsSet.has(data.prop)"
                :icon="icons.DocumentAdd"
                @click="() => {
                  currentBatchKey = data.prop;
                  batchSelectVisible = true;
                }"
              >
              </el-link>
            </span>
          </el-tooltip>
        </template>
      </CompLocalTable>

      <TextInput v-model="batchSelectVisible" @confirm="handleBatchSelect"></TextInput>
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
        :need-delete-confirm="false"
        @update:data="handleDelete"
      ></CompLocalTable>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType, shallowRef, ref, computed } from 'vue';
import ElTableColumn from 'element-plus/es/components/table/src/tableColumn';
import { ElMessage } from 'element-plus';
import { DocumentAdd } from '@element-plus/icons';
import TextInput from './TextInput.vue';

export default defineComponent({
  name: 'CompLocalSelectTable',
  components: { TextInput },
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
    // 允许批量选择的字段
    batchSelectFields: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['selection-change'],
  setup(props, ctx) {
    const activeTab = ref<'all' | 'selected'>('all');
    const listRef = ref();
    const selectedData = shallowRef<any[]>([]);

    // 批量选择
    const batchSelectVisible = ref(false);
    // 批量选择对应的字段
    const currentBatchKey = ref<string>();

    return {
      batchSelectVisible,
      currentBatchKey,
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
      batchSelectFieldsSet: computed(() => new Set(props.batchSelectFields)),
      icons: {
        DocumentAdd,
      },
      // 批量选择
      handleBatchSelect: (valsSet: Set<string>) => {
        let count = 0;
        const prop = currentBatchKey.value;
        for(const row of props.data) {
          if(prop && row[prop] && valsSet.has(`${row[prop]}`)) {
            listRef.value.tableRef.toggleRowSelection(row, true);
            count++;
          }
        }
        ElMessage.success(`输入有效数据 ${valsSet.size} 条，匹配选中 ${count} 条`);
      },
    };
  },
});
</script>
