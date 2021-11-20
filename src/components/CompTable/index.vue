<template>
  <div
    v-loading="table.loadding"
    v-drag-scroll="'.el-table__body-wrapper'"
    class="comp-table"
  >
    <div class="comp-table__table">
      <el-table
        :data="table.list"
        height="100%"
        stripe
        v-bind="$attrs"
      >
        <!-- 序号列 -->
        <el-table-column
          v-if="showIndexColumn"
          label="序号"
          type="index"
          fixed="left"
          align="center"
        ></el-table-column>

        <!-- 操作列 -->
        <el-table-column
          v-if="rowBtns?.length"
          label="操作"
          :min-width="rowBtns.length * 55"
          fixed="left"
        >
          <template #default="{ row, $index }">
            <el-space>
              <template
                v-for="btn in rowBtns"
                :key="btn.key"
              >
                <el-tag
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

        <template
          v-for="(item, index) in columns"
          :key="(item.prop ?? item.label) + index"
        >
          <CompTableColumn
            :column-prop="{ ...item, children: void 0 }"
            :children="item.children"
          ></CompTableColumn>
        </template>
      </el-table>
    </div>

    <div class="comp-table__pagination">
      <el-pagination
        v-model:page-size="table.pageSize"
        v-model:current-page="table.pageNumber"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="table.total"
        :default-page-size="table.pageSize"
        :page-sizes="[10, 20, 50, 100]"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, reactive } from 'vue';
import { useTableFetcher } from '/@/utils/hooks';
import { ColumnProps } from './interface';
import CompTableColumn from './CompTableColumn.vue';

export default defineComponent({
  name: 'CompTable',
  components: { CompTableColumn },
  props: {
    // 表格列
    columns: {
      default: () => [],
      type: Array as PropType<ColumnProps[]>,
    },
    // 表操作 api
    apis: {
      default: null,
      type: Object as PropType<Record<'get' | 'getById' | 'post' | 'put' | 'delete', (...args: any) => Promise<any>>>,
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
        { label: '编辑', key: 'default-edit' },
        { label: '删除', key: 'default-delete' },
      ],
      type: Array as PropType<{ label: string; key: string }[] | null>,
    },
  },
  setup(props) {
    const table = useTableFetcher(props.apis.get);
    const handleBtnClick = (key: string, record: any, index: number) => {};

    return {
      table,
      handleBtnClick,
    };
  },
});
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
    justify-content: flex-end;
    padding: 20px;
  }
}
</style>
