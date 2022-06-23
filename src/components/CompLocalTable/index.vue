<template>
  <div
    v-loading="loading"
    class="comp-local-table"
  >
    <el-table
      ref="tableRef"
      stripe
      border
      :data="currentData"
      :row-key="rowKey"
      v-bind="{ ...tableProps }"
      @selection-change="(...args) => $emit('selection-change', ...args)"
    >
      <!-- 多选列 -->
      <el-table-column
        v-if="hasSelection"
        type="selection"
        width="40px"
        align="center"
        reserve-selection
      ></el-table-column>

      <el-table-column
        label="序号"
        type="index"
        fixed="left"
        align="center"
        :width="60"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column
        v-if="showOperation"
        label="操作"
        align="center"
        :width="Array.isArray(showOperation) ? showOperation.length * 65 : 120"
      >
        <template #default="{ row, $index }">
          <el-space style="vertical-align: baseline;">
            <el-tag
              v-if="Array.isArray(showOperation) ? showOperation.includes('edit') : showOperation"
              class="cp"
              @click="handleEdit(row, $index)"
            >
              编辑
            </el-tag>
            <el-popconfirm
              v-if="Array.isArray(showOperation) ? showOperation.includes('delete') : showOperation"
              title="确认移除？"
              @confirm="handleDelete(row, $index)"
            >
              <template #reference>
                <el-tag
                  class="cp"
                >
                  删除
                </el-tag>
              </template>
            </el-popconfirm>
          </el-space>
        </template>
      </el-table-column>

      <slot name="column"></slot>

      <template
        v-for="(item, index) in columns"
        :key="(item.prop ?? item.label) + index"
      >
        <CompTableColumn
          :column-prop="{ ...item }"
          :children="item.subColumns"
        >
          <template #header-extra>
            <el-popover trigger="click" :hide-after="0" placement="top">
              <template #reference>
                <el-link
                  :icon="icons.Search"
                  :underline="false"
                  :style="filters[item.prop] ? { color: 'var(--el-link-default-active-color)' } : void 0"
                ></el-link>
              </template>

              <el-select-v2
                v-if="item.formatMap"
                v-model="filters[item.prop]"
                placeholder="请选择搜索条件"
                clearable
                :options="Object.entries(item.formatMap).map(([value, label]) => ({ label, value }))"
                :teleported="false"
              ></el-select-v2>
              <el-input
                v-else
                v-model="filters[item.prop]"
                placeholder="请输入搜索条件"
                clearable
              ></el-input>
            </el-popover>
          </template>
        </CompTableColumn>
      </template>
    </el-table>

    <div class="comp-local-table__pagination">
      <el-pagination
        v-model:page-size="table.pageSize"
        v-model:current-page="table.pageNumber"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredData.length"
        :default-page-size="table.pageSize"
        :page-sizes="[10, 20, 50]"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, ref, watch } from 'vue';
import ElTableColumn from 'element-plus/es/components/table/src/tableColumn';
import { TableProps } from 'element-plus/es/components/table/src/table/defaults';
import CompTableColumn from '~/components/CompTable/CompTableColumn.vue';
import { Search } from '@element-plus/icons';

export default defineComponent({
  name: 'CompLocalTable',
  components: { CompTableColumn },
  props: {
    data: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    columns: {
      type: Array as PropType<typeof ElTableColumn[]>,
      default: () => [],
    },
    tableProps: {
      type: Object as PropType<TableProps<any>>,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    showOperation: {
      type: [Boolean, Array] as PropType<boolean | ('edit' | 'delete')[]>,
      default: false,
    },
    showOverflowTooltip: {
      type: Boolean,
      default: true,
    },
    // 多选
    hasSelection: {
      type: Boolean,
      default: false,
    },
    // 主键
    rowKey: {
      type: String,
      default: 'id',
    },
  },
  emits: ['update:data', 'selection-change'],
  setup(props, ctx) {
    // 分页
    const table = reactive({
      pageSize: 10,
      pageNumber: 1,
    });

    // 查询条件
    const filters = reactive<Record<string, string>>({});

    // 当前页数据
    const filteredData = computed(() => {
      const filterKvs = Object.entries(filters).filter(([k, v]) => !!v).map(([k, v]) => [k, v.toLowerCase()]);
      return props.data.filter(item => {
        let flag = true;
        for(const [k, v] of filterKvs) {
          if(k in item && !`${item[k]}`.toLowerCase().includes(v)) {
            flag = false;
            break;
          }
        }
        return flag;
      });
    });
    const currentData = computed(() => {
      const start = (table.pageNumber - 1) * table.pageSize;
      const end = start + table.pageSize;
      return filteredData.value.slice(start, end);
    });

    const tableRef = ref();

    return {
      tableRef,
      table,
      currentData,
      filteredData,
      // 每页递增索引
      indexMethod: (index: number) => {
        return (table.pageNumber - 1) * table.pageSize + index + 1;
      },
      // 编辑行
      handleEdit: (row: any, index: number) => {
        const realindex = (table.pageNumber - 1) * table.pageSize + index;
        console.log(realindex);
      },
      // 删除行
      handleDelete: (row: any, index: number) => {
        const realindex = (table.pageNumber - 1) * table.pageSize + index;
        const newData = [...props.data];
        newData.splice(realindex, 1);
        ctx.emit('update:data', newData, row, index);
      },
      icons: { Search },
      filters,
    };
  },
});
</script>

<style lang="scss" scoped>
.comp-local-table {
  display: flex;
  flex-direction: column;

  .comp-local-table__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
}
</style>
