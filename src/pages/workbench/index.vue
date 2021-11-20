<template>
  <div class="page">
    <CompTable v-bind="tableConfig"></CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { getColumns } from './columns';
import { apis } from '/@/service';

export default defineComponent({
  name: 'PageWorkbench',
  setup() {
    // table 参数
    const tableConfig = reactive({
      columns: getColumns(),
      apis: apis.workbench,
    });

    return {
      tableConfig,
    };
  },
});
</script>
