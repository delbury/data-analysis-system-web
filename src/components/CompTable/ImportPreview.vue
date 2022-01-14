<template>
  <CompDialog
    :model-value="value"
    :title="title"
    :dialog-props="{ width: '90%' }"
    confirm-text="导入当前表"
  >
    <div v-loading="loading">
      <template v-if="data.length">
        <div class="flex-sb">
          <el-radio-group class="table-tabs" :model-value="currentTableName" @change="handleTableChange">
            <el-radio-button v-for="item in tables" :key="item.name" :label="item.name"></el-radio-button>
          </el-radio-group>

          <span class="color-info fs-s">Tips</span>
        </div>

        <comp-local-table
          ref="localTableRef"
          :data="data"
          :columns="columns"
          :table-props="{
            spanMethod,
            stripe: false,
          }"
        >
          <template v-if="false" #column>
            <el-table-column label="操作" :width="80">
              <template #default="{ row, column, $index }">
                <el-space>
                  <el-tag
                    class="cp"
                    checked
                    @click="handleEditRow(row, column, $index)"
                  >
                    编辑
                  </el-tag>
                </el-space>
              </template>
            </el-table-column>
          </template>
        </comp-local-table>
      </template>

      <template v-else>
        <el-empty>
          <el-upload
            action="/"
            accept=".xls, .xlsx"
            :auto-upload="false"
            :on-change="handleFileChange"
            :file-list="[]"
            :multiple="false"
            :limit="1"
          >
            <el-button type="primary" size="large" :icon="Upload">
              导入excel
            </el-button>
          </el-upload>
        </el-empty>
      </template>
    </div>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref, computed, nextTick } from 'vue';
import { Upload, Warning } from '@element-plus/icons';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type';
import { resolveFile, ResolvedTable } from './xlsx/import';
import { ElMessage, ElTable, ElMessageBox } from 'element-plus';
type TableColumn = Partial<TableColumnCtx<Record<string, unknown>>>;
type TableInstance = InstanceType<typeof ElTable>;

export default defineComponent({
  components: { Warning },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '导入预览',
    },
  },
  setup() {
    const localTableRef = ref<{ tableRef: TableInstance }>();
    const loading = ref(false);
    const tables = shallowRef<ResolvedTable[]>([]);
    const currentTableName = ref('');
    // 当前 table
    const currentTable = computed(() => tables.value.find(it => it.name === currentTableName.value));
    // 表头
    const columns = computed<TableColumn[]>(() => currentTable.value?.header.map(it => ({
      label: it,
      prop: it,
    })) ?? [],
    );
    // 数据
    const data = computed(() => currentTable.value?.data ?? []);

    // 单元格合并函数
    const spanMethod = computed(() => {
      if(!currentTable.value?.mergesMap.size) return void 0;

      const mergesMap = currentTable.value.mergesMap;
      return (params: { column: TableColumn; rowIndex: number; columnIndex: number; }) => {
        const { rowIndex, column } = params;
        const key = `${column.property},${rowIndex}`;
        return mergesMap.get(key);
      };
    });

    return {
      localTableRef,
      loading,
      tables,
      currentTableName,
      data,
      columns,
      Upload,
      handleFileChange: (file: UploadFile, fileList: UploadFile[]) => {
        fileList.length = 0;
        loading.value = true;
        nextTick(async () => {
          try {
            const resolvedTables = await resolveFile(file.raw);
            tables.value = resolvedTables;
            currentTableName.value = resolvedTables[0]?.name ?? '';
          } catch(e) {
            ElMessage.error('解析文件出错');
          } finally {
            loading.value = false;
          }
        });
      },
      handleTableChange: (tableName: string) => {
        currentTableName.value = tableName;
        nextTick(() => {
          console.log(data.value);
          localTableRef.value?.tableRef.doLayout();
        });
      },
      spanMethod,
      // 编辑行
      handleEditRow: (row: any, column: TableColumn, index: number) => {
        console.log(row);
        const newTables = [...tables.value];
        const currentTableIndex = newTables.findIndex(it => it.name === currentTableName.value);
        if(currentTableIndex > -1) {
          // 完整 list 中的 index
          const dataindex = row.__rowNum__;
        }

        // 更新源数据
        tables.value = newTables;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.table-tabs {
  margin-bottom: 10px;
}
</style>
