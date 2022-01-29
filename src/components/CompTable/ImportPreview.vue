<template>
  <CompDialog
    :model-value="value"
    :title="title"
    :dialog-props="{ width: '90%' }"
    hidden-default-confirm-btn
  >
    <template #footer>
      <el-button v-if="currentStep !== 'upload'" key="prev" @click="handlePrev">
        上一步
      </el-button>
      <el-button v-if="currentStep !== 'upload'" key="next" type="primary" @click="handleNext">
        {{ currentStep === 'edit' ? '确定导入' : '下一步' }}
      </el-button>
    </template>

    <div v-loading="loading">
      <template v-if="currentStep === 'upload'">
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

      <template v-else>
        <div v-if="currentStep === 'preview'" class="flex-sb tools-row">
          <el-space class="flex-center-h">
            <el-radio-group :model-value="currentTableName" @change="handleTableChange">
              <el-radio-button v-for="item in tables" :key="item.name" :label="item.name"></el-radio-button>
            </el-radio-group>

            <el-checkbox v-model="isMergedCell">
              合并单元格
            </el-checkbox>
          </el-space>


          <span class="color-info fs-s">Tips：导入时默认过滤所有合并单元格存在的行/列，以及空行</span>
        </div>

        <comp-local-table
          v-if="currentStep === 'edit'"
          key="edit"
          v-model:data="editData"
          :columns="columns"
          show-operation
        >
        </comp-local-table>
        <comp-local-table
          v-else
          key="preview"
          ref="localTableRef"
          :data="currentTableData"
          :columns="columns"
          :table-props="{
            spanMethod,
            stripe: false,
          }"
        >
        </comp-local-table>
      </template>
    </div>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref, computed, nextTick } from 'vue';
import { Upload, Warning, ArrowLeft } from '@element-plus/icons';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type';
import { resolveFile, ResolvedTable } from './xlsx/import';
import { ElMessage, ElTable, ElMessageBox } from 'element-plus';
import _cloneDeep from 'lodash/cloneDeep';
type TableColumn = Partial<TableColumnCtx<Record<string, unknown>>>;
type TableInstance = InstanceType<typeof ElTable>;

export default defineComponent({
  components: { Warning },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const localTableRef = ref<{ tableRef: TableInstance }>();
    // 当前步骤
    // 上传文件(upload) -> 预览(preview) -> 编辑(preview)
    const currentStep = ref<'upload' | 'preview' | 'edit'>('upload');
    const loading = ref(false);
    // 是否合并单元格
    const isMergedCell = ref(true);
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
    const currentTableData = computed(() => currentTable.value?.data ?? []);
    const editData = shallowRef<ResolvedTable['data']>([]);

    // 单元格合并函数
    const spanMethod = computed(() => {
      // 过滤合并单元格
      if(!isMergedCell.value || currentStep.value !== 'preview') return;
      if(!currentTable.value?.mergesMap.size) return;

      const mergesMap = currentTable.value.mergesMap;
      return (params: { column: TableColumn; rowIndex: number; columnIndex: number; }) => {
        const { rowIndex, column } = params;
        const key = `${column.property},${rowIndex}`;
        return mergesMap.get(key);
      };
    });

    // 初始化
    const reset = () => {
      currentStep.value = 'upload';
      tables.value = [];
      currentTableName.value = '';
      isMergedCell.value = true;
      editData.value = [];
    };
    // 上一步
    const handlePrev = () => {
      if(currentStep.value === 'preview') {
        // 返回上传文件阶段
        reset();
      } else if(currentStep.value === 'edit') {
        editData.value = [];
        currentStep.value = 'preview';
      }
    };
      // 下一步
    const handleNext = async () => {
      if(currentStep.value === 'preview') {
        try {
          // await ElMessageBox.confirm(
          //   '将会过滤当前表中所有空行以及存在合并单元格的行、列，确定执行下一步？',
          //   '提示',
          //   { type: 'warning' },
          // );
          // 生成即将导入的数据
          const mergedRows = currentTable.value?.mergedRows;
          const willEditData = currentTableData.value.filter((row, index) =>
          // length > 1，因为至少存在一个 __rowNum__ 字段
            (!mergedRows?.size || !mergedRows.has(index)) && Object.keys(row).length > 1,
          );
          editData.value = _cloneDeep(willEditData);
          // 进入编辑阶段
          currentStep.value = 'edit';
        } catch(e) {
          //
        }
      }
    };

    return {
      localTableRef,
      currentStep,
      isMergedCell,
      loading,
      tables,
      currentTableName,
      editData,
      currentTableData,
      columns,
      Upload,
      ArrowLeft,
      handleFileChange: (file: UploadFile, fileList: UploadFile[]) => {
        fileList.length = 0;
        loading.value = true;
        nextTick(async () => {
          try {
            const resolvedTables = await resolveFile(file.raw);
            tables.value = resolvedTables;
            currentTableName.value = resolvedTables[0]?.name ?? '';
            currentStep.value = 'preview';
            // handleNext();
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
          localTableRef.value?.tableRef.doLayout();
        });
      },
      spanMethod,
      // 上一步
      handlePrev,
      // 下一步
      handleNext,
      title: computed(() => {
        switch(currentStep.value) {
          case 'upload':
            return '导入数据-选择文件';
          case 'preview':
            return '导入数据-预览';
          case 'edit':
            return '导入数据-编辑';
          default: return '导入数据';
        }
      }),
    };
  },
});
</script>

<style lang="scss" scoped>
.tools-row {
  margin-bottom: 10px;
}
</style>
