<template>
  <el-table-column
    header-align="left"
    v-bind="{ ...columnProp, ref: void 0 }"
  >
    <template #header>
      <el-tooltip
        :content="columnProp.tip"
        :disabled="!columnProp.tip || columnProp.tip.length <= 4"
      >
        <span class="comp-table-column__header">
          {{ columnProp.label }}
          {{ formatTip(columnProp.tip) }}
          <slot name="header-extra"></slot>
        </span>
      </el-tooltip>
    </template>

    <template v-if="children?.length">
      <template
        v-for="item in children"
        :key="item.key"
      >
        <CompTableColumn
          :column-prop="item"
          :children="item.subColumns"
          @cell-click="(...args) => $emit('cell-click', ...args)"
        ></CompTableColumn>
      </template>
    </template>

    <template
      v-if="!children?.length"
      #default="{ row, column, $index }"
    >
      <template v-if="resolveTextClassName(row[column.property], row)">
        <span :class="resolveTextClassName(row[column.property], row)">
          <el-link
            v-if="columnProp.clickKey"
            type="primary"
            @click="() => $emit('cell-click', columnProp.clickKey, row, $index)"
          >
            {{ formatCell(row[column.property], row) }}
          </el-link>
          <span v-else>
            {{ formatCell(row[column.property], row) }}
          </span>
        </span>
      </template>
      <template v-else>
        <el-link
          v-if="columnProp.clickKey"
          type="primary"
          @click="() => $emit('cell-click', columnProp.clickKey, row, $index)"
        >
          {{ formatCell(row[column.property], row) }}
        </el-link>
        <span v-else>
          {{ formatCell(row[column.property], row) }}
        </span>
      </template>
    </template>
  </el-table-column>
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType } from 'vue';
import { ColumnProps } from './interface';
import { Warning } from '@element-plus/icons';

export default defineComponent({
  name: 'CompTableColumn',
  components: { Warning },
  props: {
    children: {
      type: Array as PropType<ColumnProps[]>,
      default: void 0,
    },
    columnProp: {
      type: Object as PropType<ColumnProps>,
      required: true,
    },
  },
  emits: ['cell-click'],
  setup(props, ctx) {
    return {
      // 格式化显示单元格
      formatCell: (val: any, row: any) => {
        if(props.columnProp.customFormatter) {
          return props.columnProp.customFormatter(val, row) ?? '-';
        }

        if(props.columnProp.formatMap) {
          const opt = props.columnProp.formatMap[val];
          if(opt !== void 0) {
            return typeof opt === 'string' ? opt : opt.text;
          }
        } else if(props.columnProp.customType === 'bool') {
          return val === 1 ? '是' : '否';
        } else if(props.columnProp.customType === 'list') {
          if(Array.isArray(val)) {
            const lk = props.columnProp.listLabelKey;
            if(lk) {
              return val.map(it => it[lk]).join(', ');

            } else {
              return val.join(', ');
            }
          } else {
            return (val ?? '-');
          }
        }
        return val ?? '-';
      },
      // text 的 class
      resolveTextClassName: (val: any, row: any) => {
        if(props.columnProp.formatMap) {
          const opt = props.columnProp.formatMap[val];
          if(typeof opt !== 'string' && opt?.className) return opt.className;
        }
      },
      // 格式化 title tip
      formatTip: (tip?: string) => {
        if(!tip) return '';
        return `(${tip.length <= 4 ? tip : (tip.slice(0, 4) + '...')})`;
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.comp-table-column__header {
  display: flex;
  gap: 0.5em;
  align-items: center;
}
</style>
