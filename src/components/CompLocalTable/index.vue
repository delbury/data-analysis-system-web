<template>
  <div
    v-loading="loading"
    class="comp-local-table"
  >
    <el-table
      ref="tableRef"
      stripe
      border
      v-bind="{ ...tableProps }"
      :data="currentData"
    >
      <el-table-column
        label="序号"
        type="index"
        fixed="left"
        align="center"
        :width="60"
        :index="indexMethod"
      >
      </el-table-column>

      <el-table-column v-if="showOperation" label="操作" :width="120">
        <template #default="{ row, $index }">
          <el-space style="vertical-align: baseline;">
            <el-tag
              class="cp"
              @click="handleEdit(row, $index)"
            >
              编辑
            </el-tag>
            <el-popconfirm title="确认移除？" @confirm="handleDelete(row, $index)">
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

      <template v-for="(col, ind) in columns" :key="col.prop + ind">
        <el-table-column
          show-overflow-tooltip
          v-bind="col"
        >
        </el-table-column>
      </template>
    </el-table>

    <div class="comp-local-table__pagination">
      <el-pagination
        v-model:page-size="table.pageSize"
        v-model:current-page="table.pageNumber"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="data.length"
        :default-page-size="table.pageSize"
        :page-sizes="[10, 20, 50]"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, reactive, computed, ref } from 'vue';
import ElTableColumn from 'element-plus/es/components/table/src/tableColumn';
import { TableProps } from 'element-plus/es/components/table/src/table/defaults';

export default defineComponent({
  name: 'CompLocalTable',
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
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:data'],
  setup(props, ctx) {
    const table = reactive({
      pageSize: 10,
      pageNumber: 1,
    });

    // 当前页数据
    const currentData = computed(() => {
      const start = (table.pageNumber - 1) * table.pageSize;
      const end = start + table.pageSize;
      return props.data.slice(start, end);
    });

    const tableRef = ref();

    return {
      tableRef,
      table,
      currentData,
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
        ctx.emit('update:data', newData);
      },
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
