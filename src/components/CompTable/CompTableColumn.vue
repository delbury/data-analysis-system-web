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
        <span>
          {{ columnProp.label }}
          {{ formatTip(columnProp.tip) }}
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
          :children="item.children"
        ></CompTableColumn>
      </template>
    </template>

    <template
      v-if="!children?.length"
      #default="{row, column}"
    >
      <span
        v-if="columnProp.formatMap || columnProp.formatter"
        :class="resolveTextClassName(row[column.property], row)"
      >
        {{ formatCell(row[column.property], row) ?? '-' }}
      </span>
      <span
        v-else-if="columnProp.customType === 'bool'"
        :class="resolveTextClassName(row[column.property], row)"
      >
        {{ row[column.property] === 1 ? '是' : '否' }}
      </span>
      <span
        v-else-if="columnProp.customType === 'list'"
        :class="resolveTextClassName(row[column.property], row)"
      >
        {{ formatList(row[column.property], row) }}
      </span>
      <span
        v-else
        :class="resolveTextClassName(row[column.property], row)"
      >
        {{ row[column.property] ?? '-' }}
      </span>
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
      default: null,
    },
    columnProp: {
      type: Object as PropType<ColumnProps>,
      required: true,
    },
  },
  setup(props, { attrs }) {
    return {
      // 格式化显示单元格
      formatCell: (val: any, row: any) => {
        if(props.columnProp.formatMap) {
          const opt = props.columnProp.formatMap[val];
          if(opt !== void 0) return typeof opt === 'string' ? opt : opt.text;
        }
        return val;
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
      // 格式化 list
      formatList: (val: any, row: any) => {
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
      },
    };
  },
});
</script>
