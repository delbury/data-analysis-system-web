<template>
  <div
    v-loading="table.loadding"
    v-drag-scroll="'.el-table__body-wrapper'"
    class="comp-table"
  >
    <!-- 搜索条件 -->
    <TableSearch
      :columns="columns"
      @search="handleSearch"
    ></TableSearch>

    <div class="comp-table__table">
      <el-table
        :data="table.list"
        height="100%"
        stripe
        v-bind="$attrs"
        @sort-change="handleSortChange"
      >
        <!-- 序号列 -->
        <el-table-column
          v-if="showIndexColumn"
          label="序号"
          type="index"
          fixed="left"
          align="center"
          :width="60"
        >
          <template #header>
            <ColumnConfig></ColumnConfig>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="rowBtns?.length"
          label="操作"
          :width="rowBtns.length * 55"
          fixed="left"
        >
          <template #default="{ row, $index }">
            <el-space>
              <template
                v-for="btn in rowBtns"
                :key="btn.key"
              >
                <el-tooltip
                  v-if="btn.disabled === true || (btn.disabled && btn.disabled(row, permission))"
                  :content="typeof btn.tip === 'function' ? btn.tip(row, permission) : btn.tip"
                  :disabled="!btn.tip"
                >
                  <el-tag
                    type="info"
                    class="cna"
                  >
                    {{ btn.label }}
                  </el-tag>
                </el-tooltip>
                <el-tag
                  v-else
                  class="cp"
                  checked
                  @click="handleBtnClick(btn.key, row, $index)"
                >
                  {{ btn.label }}
                </el-tag>
              </template>
            </el-space>
          </template>
        </el-table-column>

        <el-table-column
          v-if="showId"
          label="ID"
          prop="id"
          width="50px"
        ></el-table-column>

        <template
          v-for="(item, index) in columns"
          :key="(item.prop ?? item.label) + index"
        >
          <CompTableColumn
            :column-prop="{ ...item }"
            :children="item.subColumns"
          ></CompTableColumn>
        </template>
      </el-table>
    </div>

    <div class="comp-table__pagination">
      <!-- 左下角插槽 -->
      <div class="comp-table__footer">
        <!-- 新增 -->
        <comp-button
          v-if="showCreateBtn"
          :icon="icons.Plus"
          :button-props="{ type: 'primary' }"
          tip="新增"
          @click="openDialog('create')"
        >
        </comp-button>

        <!-- 刷新 -->
        <comp-button
          :icon="icons.Refresh"
          tip="刷新"
          @click="table.refresh(void 0, true)"
        ></comp-button>

        <!-- 导入 -->
        <comp-button
          v-if="showImportBtn"
          :icon="icons.Upload"
          tip="导入"
        ></comp-button>

        <!-- 导出 -->
        <comp-button
          v-if="showExportBtn"
          :icon="icons.Download"
          tip="导出"
          :button-props="{ loading: table.exporting }"
          @click="handleExport"
        ></comp-button>

        <slot name="footer"></slot>
      </div>

      <!-- 分页器 -->
      <el-pagination
        v-model:page-size="table.pageSize"
        v-model:current-page="table.pageNumber"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.total"
        :default-page-size="table.pageSize"
        :page-sizes="[10, 20, 50]"
      ></el-pagination>
    </div>

    <!-- 表单弹框 -->
    <DialogForm
      v-if="dialog.visible"
      ref="dialogFormRef"
      v-model="dialog.visible"
      :title="dialogTitle"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :dialog-props="dialogProps"
      :status="dialog.status"
      :confirm-action="confirmAction"
      :loading="table.fetching"
      :form-props="formProps"
    ></DialogForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, reactive, computed, watch } from 'vue';
import { useTableFetcher, usePermission, PermissionType } from './hooks';
import { ColumnProps, FormItemSection, DialogStatus, ElFormProps, RowBtn } from './interface';
import CompTableColumn from './CompTableColumn.vue';
import { ElMessageBox } from 'element-plus';
import { Plus, Refresh, Upload, Download } from '@element-plus/icons';
import DialogForm from './DialogForm.vue';
import { ElDialogProps } from '~/components/CompDialog/interface';
import { FetchersType } from '~/service/tools';
import TableSearch from './TableSearch.vue';
import ColumnConfig from './ColumnConfig.vue';

const icons = {
  Plus, Refresh, Upload, Download,
};
type DialogFormInstance = InstanceType<typeof DialogForm>;

export default defineGenericComponent();
function defineGenericComponent<T = any>() {
  return defineComponent({
    name: 'CompTable',
    components: { CompTableColumn, DialogForm, TableSearch, ColumnConfig },
    props: {
      // 表名 label
      tableName: {
        type: String,
        default: void 0,
      },
      // 对应数据库的表名
      dbTable: {
        type: String,
        default: void 0,
      },
      // 表格列
      columns: {
        default: () => [],
        type: Array as PropType<ColumnProps[]>,
      },
      // 表操作 api
      apis: {
        default: null,
        type: Object as PropType<FetchersType>,
      },
      // 是否展示序号列
      showIndexColumn: {
        default: true,
        type: Boolean,
      },
      // 操作列配置
      rowBtns: {
        default: () => [
          { label: '详情', key: 'default-detail' },
          {
            label: '编辑',
            key: 'default-edit',
            disabled: (row: any, ps: PermissionType) => !!row.is_system || (ps && !ps.write),
            tip: (row: any, ps: PermissionType) =>
              row.is_system ? '系统创建，无法编辑' : ((ps && !ps.write) ? '没有权限' : void 0),
          },
          {
            label: '删除',
            key: 'default-delete',
            disabled: (row: any, ps: PermissionType) => !!row.is_system || (ps && !ps.write),
            tip: (row: any, ps: PermissionType) =>
              row.is_system ? '系统创建，无法删除' : ((ps && !ps.write) ? '没有权限' : void 0),
          },
        ],
        type: Array as PropType<RowBtn[] | null>,
      },
      // 表单初始值
      formInitValues: {
        default: () => ({}),
        type: Object,
      },
      // 表单字段
      formItems: {
        default: () => [],
        type: Array as PropType<FormItemSection[]>,
      },
      dialogProps: {
        default: () => ({}),
        type: Object as PropType<ElDialogProps>,
      },
      formProps: {
        default: () => ({}),
        type: Object as PropType<ElFormProps>,
      },
      // 展示创建按钮
      showCreateBtn: {
        default: true,
        type: Boolean,
      },
      showImportBtn: {
        default: false,
        type: Boolean,
      },
      showExportBtn: {
        default: true,
        type: Boolean,
      },
      // 是否展示 id 列
      showId: {
        default: false,
        type: Boolean,
      },
    },
    emits: ['btn'],
    setup(props, ctx) {
    // 表格
      const table = useTableFetcher(props.apis, { columns: props.columns, tableName: props.tableName });
      const dialogFormRef = ref<DialogFormInstance>();

      // 打开表单弹框
      const openDialog = async(status: DialogStatus, record?: any) => {
        dialog.status = status;
        dialog.visible = true;

        if(record && (status === 'detail' || status === 'edit')) {
        // 查询详情
          const res = await table.detail(record.id);
          dialogFormRef.value?.setFormValues(res);
        } else {
        }
      };

      // 操作按钮点击回调
      const handleBtnClick = (key: string, record: any, index: number) => {
        switch(key) {
          case 'default-detail':
            openDialog('detail', record);
            break;
          case 'default-edit':
            openDialog('edit', record);
            break;
          case 'default-delete':
            ElMessageBox.confirm(
              '确认删除该项？',
              '提示',
              { type: 'warning' },
            ).then(() => table.delete(record.id as string)).catch(() => {});
            break;
          default: break;
        }
        ctx.emit('btn', { key, record, index });
      };

      // 弹框
      const dialog = reactive<{ visible: boolean; status: DialogStatus}>({
        visible: false,
        status: 'create',
      });
      const dialogTitle = computed(() => {
        switch(dialog.status) {
          case 'create':
            return '新增';
          case 'edit':
            return '编辑';
          case 'detail':
            return '详情';
          default:
            return '';
        }
      });

      // 表单框确定
      const confirmAction = async(status: DialogStatus, data: any, id?: string) => {
        try {
          if(status === 'create') {
          // 创建
            await table.create(data);
          } else if(status === 'edit' && id !== void 0) {
          // 编辑
            await table.update(id, data);
          } else if(status === 'detail') {
          // 详情
          }
        } catch(e) {
          return false;
        }
      };

      // 表格排序
      const handleSortChange = ({ column, prop, order }) => {
        table.orderBy = prop;
        switch(order) {
          case 'descending':
            table.order = 'desc';
            break;
          case 'ascending':
            table.order = 'asc';
            break;
          default:
            table.orderBy = void 0;
            table.order = void 0;
            break;
        }
        table.refresh();
      };

      // 搜索
      const handleSearch = (params?: {}) => {
        table.searchParams = params;
        table.refresh(void 0, true);
      };

      // 导出 excel
      const handleExport = () => {
        table.export();
      };

      // 权限控制
      const permission = usePermission(props.dbTable);

      return {
        table,
        handleBtnClick,
        icons,
        dialog,
        dialogTitle,
        openDialog,
        confirmAction,
        dialogFormRef,
        handleSortChange,
        handleSearch,
        handleExport,
        permission,
      };
    },
  });
}
</script>

<style lang="scss" scoped>
.comp-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .comp-table__table {
    flex: 1;
  }

  .comp-table__pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
  }

  .comp-table__footer {
    display: flex;
  }
}
</style>
