<template>
  <el-table-column
    header-align="left"
    v-bind="{ ...columnProp, ref: void 0 }"
    :label="(columnProp.label ?? '') + (columnProp.tip ? `（${columnProp.tip}）` : '')"
  >
    <template v-if="children?.length">
      <template
        v-for="item in children"
        :key="item.key"
      >
        <CompTableColumn
          :column-prop="item"
          :children="item.children"
        ></CompTableColumn>
      </template>
    </template>

    <template
      v-if="!children?.length"
      #default="{row, column}"
    >
      {{ row[column.property] ?? '-' }}
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import { ColumnProps } from './interface';

export default defineComponent({
  name: 'CompTableColumn',
  props: {
    children: {
      type: Array as PropType<ColumnProps[]>,
      default: null,
    },
    columnProp: {
      type: Object as PropType<ColumnProps>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return {
    };
  },
});
</script>
