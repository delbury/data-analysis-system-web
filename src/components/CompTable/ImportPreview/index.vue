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
            <el-button type="primary" size="large" :icon="icons.Upload">
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

          <!-- tips -->
          <div class="tips color-info fs-s">
            <div>导入时默认过滤所有合并单元格存在的行/列，以及空行</div>
            <div>
              当前表单需要字段数量：<span class="color-primary">{{ counts.total }}</span>个，未分配：
              <span class="color-error">{{ counts.unassigned }}</span>个，未分配必填：
              <span class="color-error">{{ counts.unassignedRequired }}</span>个

              <!-- 查看映射关系 -->
              <el-popover
                title="字段列映射详情"
                placement="left"
                trigger="click"
                width="fit-content"
              >
                <template #reference>
                  <el-button class="tip-btn" type="text">
                    查看
                  </el-button>
                </template>

                <ul class="popover-list">
                  <li
                    v-for="(it, index) in formItemFlatList"
                    :key="it.prop + index"
                    class="popover-list__item"
                  >
                    <span class="popover-list__label label" :class="{ required: isRequired(it) }">
                      <form-label :item="it"></form-label>
                    </span>
                    <span class="sym"><el-icon class="color-primary"><right /></el-icon></span>
                    <span class="info">
                      <el-select
                        v-model="formFieldColMap[it.prop]"
                        :teleported="false"
                        clearable
                        @change="(val) => handleFieldColMapChange(val, it.prop)"
                      >
                        <template v-for="col in columns" :key="col.prop">
                          <el-option :value="col.prop">
                            {{ col.label }}
                          </el-option>
                        </template>
                      </el-select>
                    </span>
                  </li>
                </ul>
              </el-popover>
            </div>
          </div>
        </div>

        <template
          v-if="currentStep === 'edit'"
        >
          <!-- 编辑预览 -->
          <comp-local-table
            key="edit"
            :data="editData"
            :columns="formItemFlatList"
            :show-operation="['delete']"
            :show-overflow-tooltip="false"
          >
            <template #column-header="config">
              <div class="flex-center-v">
                <span>{{ `(${formFieldColMap[config.column.property] ?? '-'})` }}</span>
                <span>{{ config.column.label }}</span>
              </div>
            </template>

            <template #column-content="config">
              <!-- 当前值 -->
              <el-tooltip
                :content="`${config.row[config.column.property]}`"
                placement="left"
                :enterable="false"
                :disabled="!config.row[config.column.property]"
              >
                <edit-cell
                  v-model="config.row[config.column.property]"
                  :data="config"
                  :form-item="formItemFlatMap[config.column.property]"
                  :col="formFieldColMap[config.column.property]"
                >
                </edit-cell>
              </el-tooltip>
            </template>
          </comp-local-table>
        </template>

        <template v-else>
          <!-- 导入预览 -->
          <comp-local-table

            key="preview"
            ref="localTableRef"
            :data="currentTableData"
            :columns="columns"
            :table-props="{
              spanMethod,
              stripe: false,
            }"
          >
            <template #column-header="config">
              <div class="flex-center-h">
                <span class="line label">{{ config.column.label }}</span>

                <el-popover
                  placement="bottom"
                  trigger="click"
                  width="fit-content"
                >
                  <template #reference>
                    <el-button
                      :class="[formColFieldsMap[config.column.property]?.length ? 'color-primary' : 'color-info']"
                      type="text"
                      :icon="icons.Link"
                    >
                      {{ formColFieldsMap[config.column.property]?.length }}
                    </el-button>
                  </template>

                  <el-select
                    v-model="formColFieldsMap[config.column.property]"
                    multiple
                    clearable
                    style="width: 240px;"
                    :teleported="false"
                    @change="(val) => handleColFieldsMapChange(val, config.column.property)"
                  >
                    <template v-for="item in formItemFlatList" :key="item.prop">
                      <el-option :value="item.prop" :label="item.label">
                        <span class="label fs-n" :class="{ required: isRequired(item) }">{{ item.label }}</span>
                      </el-option>
                    </template>
                  </el-select>
                </el-popover>
              </div>
            </template>
          </comp-local-table>
        </template>
      </template>
    </div>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, shallowRef, ref, computed, nextTick, PropType, reactive, watch } from 'vue';
import { Upload, Warning, Right, Link } from '@element-plus/icons';
import { TableColumnCtx } from 'element-plus/es/components/table/src/table-column/defaults';
import { UploadFile } from 'element-plus/es/components/upload/src/upload.type';
import { resolveFile, ResolvedTable } from '../xlsx/import';
import { ElMessage, ElTable, ElMessageBox } from 'element-plus';
import { FormItemSection, FormItem } from '../interface';
import FormLabel from '../FormLabel.vue';
import { useConfigCol, createEditData } from './useConfigCol';
import EditCell from './EditCell.vue';
import _cloneDeep from 'lodash/cloneDeep';
type TableColumn = Partial<TableColumnCtx<Record<string, unknown>>>;
type TableInstance = InstanceType<typeof ElTable>;

const icons = {
  Upload,
  Link,
};

export default defineComponent({
  name: 'ImportPreview',
  components: { Warning, Right, FormLabel, EditCell },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    // 表单字段
    formItems: {
      default: () => [],
      type: Array as PropType<FormItemSection[]>,
    },
  },
  setup(props) {
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
      minWidth: 120,
    })) ?? []);
    // 数据
    const currentTableData = computed(() => currentTable.value?.data ?? []);
    // 正在编辑中的数据
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
          // 处理映射关系
          editData.value = createEditData(willEditData, formConfig.formColFieldsMap);

          // 进入编辑阶段
          currentStep.value = 'edit';
        } catch(e) {
          //
        }
      }
    };

    const formConfig = useConfigCol(props.formItems);

    return {
      ...formConfig,
      localTableRef,
      currentStep,
      isMergedCell,
      loading,
      tables,
      currentTableName,
      editData,
      currentTableData,
      columns,
      icons,
      // 导入文件
      handleFileChange: (file: UploadFile, fileList: UploadFile[]) => {
        fileList.length = 0;
        loading.value = true;
        // 延迟展示 loading 图标
        setTimeout(async () => {
          try {
            const resolvedTables = await resolveFile(file.raw);
            tables.value = resolvedTables;
            currentTableName.value = resolvedTables[0]?.name ?? '';
            currentStep.value = 'preview';
            handleNext();
          } catch(e) {
            ElMessage.error('解析文件出错');
          } finally {
            window.requestIdleCallback(() => {
              loading.value = false;
            });
          }
        }, 100);
      },
      handleTableChange: (tableName: string) => {
        loading.value = true;
        // 延迟展示 loading 图标
        setTimeout(() => {
          currentTableName.value = tableName;
          localTableRef.value?.tableRef.doLayout();
          window.requestIdleCallback(() => {
            loading.value = false;
          });
        }, 100);
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
      handleReset: (config) => {
        console.log(config);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.tools-row {
  margin-bottom: $gap-n;
}

.tips {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;

  > * {
    display: flex;
    align-items: center;
  }

  .tip-btn {
    height: unset;
    padding: 0 !important;
    margin-left: 5px;
  }
}

.label {
  position: relative;
  padding-left: 0.75em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.required::before {
    position: absolute;
    left: 0;
    color: var(--el-color-danger);
    content: '*';
  }
}

.popover-list {
  max-height: 75vh;
  padding-right: 1em;
  overflow-y: auto;
  font-size: $fs-s;

  .btn-close {
    position: absolute;
    right: 12px;
    width: 1em;
    height: 1em;
    padding: 0 !important;
    font-size: 16px;
    color: var(--el-color-info);
    background: 0 0;
    border-width: 0;
    outline: none;
    transform: translateY(-28px);
  }

  .popover-list__item {
    display: flex;
    align-items: center;
    padding: 2px 0;
    border-top: var(--el-border-base);

    &:last-of-type {
      border-bottom: var(--el-border-base);
    }

    &:hover {
      background: var(--el-bg-color);
    }
  }

  .popover-list__label {
    display: inline-flex;
    flex: 3;
  }

  .sym {
    display: inline-flex;
    margin: 0 1em;
  }

  .info {
    display: inline-flex;
    justify-content: flex-end;
    width: 100px;
  }
}
</style>
