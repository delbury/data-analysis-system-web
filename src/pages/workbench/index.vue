<template>
  <div>
    <el-table :data="table.data">
      <template
        v-for="(item, index) in columns"
        :key="(item.prop ?? item.label) + index"
      >
        <el-table-column
          show-overflow-tooltip
          v-bind="item"
        ></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { getColumns } from './columns';
import { useTableFetcher } from '/@/utils/hooks';
import { apis } from '/@/service';

export default defineComponent({
  name: 'PageWorkbench',
  setup() {
    const columns = getColumns();
    const table = useTableFetcher(apis.workbench.get);

    return {
      columns,
      table,
    };
  },
});
</script>
