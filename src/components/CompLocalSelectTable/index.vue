<template>
  <el-tabs
    v-loading="loading"
    type="card"
    :model-value="activeTab"
    @tab-change="(v) => activeTab = v"
  >
    <el-tab-pane label="全部列表" name="all">
      <CompLocalTable
        ref="listRef"
        :data="data"
        :columns="columns"
        :row-key="rowKey"
        has-selection
        :table-props="{ height: height }"
        @selection-change="handleSelectionChange"
      >
        <template #header-extra="{ data: da }">
          <el-tooltip content="批量选择">
            <span>
              <el-link
                v-if="batchSelectFieldsSet.has(da.prop)"
                :icon="icons.DocumentAdd"
                @click="() => {
                  currentBatchKey = da.prop;
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
        :table-props="{ height: height }"
        @update:data="handleDelete"
      >
        <template #footer>
          <div>
            <comp-button
              :icon="icons.Download"
              tip="导出已选列表"
              :button-props="{ loading: loadings.export }"
              @click="handleExport"
            ></comp-button>
          </div>
        </template>
      </CompLocalTable>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { defineComponent, PropType, shallowRef, ref, computed, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { DocumentAdd, Download } from '@element-plus/icons';
import TextInput from './TextInput.vue';
import { getColumnRenderMap } from '~/components/CompTable/hooks';
import { ColumnProps } from '~/components/CompTable/interface';
import { saveFile } from '~/components/CompTable/xlsx/export';

export default defineComponent({
  name: 'CompLocalSelectTable',
  components: { TextInput },
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<ColumnProps[]>,
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
    height: {
      type: [Number, String],
    },
    loading: {
      type: Boolean,
      default: false,
    },
    // 导出文件名称
    exportFileName: {
      type: String,
    },
  },
  emits: ['selection-change'],
  setup(props, ctx) {
    const activeTab = ref<'all' | 'selected'>('all');
    const listRef = ref();
    const selectedData = shallowRef<Record<string, any>[]>([]);
    const loadings = reactive({
      export: false,
    });

    // 批量选择
    const batchSelectVisible = ref(false);
    // 批量选择对应的字段
    const currentBatchKey = ref<string>();

    return {
      loadings,
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
        Download,
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
      // 导出已选名单
      handleExport: async () => {
        loadings.export = true;
        const list = selectedData.value;
        const columnRenderMap = getColumnRenderMap(props.columns);

        // 数据处理，自定义渲染
        if(columnRenderMap) {
          list.forEach((item) => {
            Object.entries(item).forEach(([key, val]) => {
              const config = columnRenderMap[key];
              if(!config) return;

              if(config.formatMap) {
                const v = config.formatMap[val];
                item[key] = typeof v === 'string' ? v : v.text;
              }
            });
          });
        }
        try {
          // 保存文件
          await saveFile(list, props.columns, props.exportFileName ?? '已选列表');
        } finally {
          loadings.export = false;
        }
      },
    };
  },
});
</script>
