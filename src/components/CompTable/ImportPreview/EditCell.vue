<template>
  <div class="cell-row">
    <el-icon class="color-primary" @click="visible = true">
      <edit></edit>
    </el-icon>
    <span v-if="eachValue != null || eachValue !== ''" class="text-ell">{{ eachValue }}</span>
    <span v-else class="text-ell color-info">-</span>

    <comp-dialog
      v-model="visible"
      confirm-text="修改"
      :dialog-props="{ appendToBody: true, title, width: 400 }"
      :submit-action="submitAction"
    >
      <template v-if="formItem && visible">
        <div class="flex-center-v">
          <div class="color-info fs-s mg-b full-w">
            初始值：{{ initValue }}
          </div>
          <div class="color-info fs-s mg-b full-w">
            当前值：{{ eachValue }}
          </div>
          <dialog-form-item
            v-model="currentValue"
            :item="formItem"
            :global-disabled="false"
          ></dialog-form-item>
        </div>
      </template>
    </comp-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, ref, watch } from 'vue';
import { FormItem } from '~/components/CompTable/interface';
import DialogFormItem from '~/components/CompTable/DialogForm/DialogFormItem.vue';
import { RenderRowData } from 'element-plus/es/components/table/src/table/defaults';
import { Edit } from '@element-plus/icons';
import moment from 'moment';
import { DEFAULT_DATE } from '~/components/CompTable/util';

const getInitValue = (val: any, { column, row }: RenderRowData<Record<string, any>>, item?: FormItem) => {
  if(!item) return val;
  switch(item.customType) {
    case 'int':
    case 'float':
      return Number(val);
    case 'date':
      return new Date(val);
    case 'time':
      return new Date(`${DEFAULT_DATE} ${val}`);
    case 'timerange':
      const start = row[item.importMergeCols?.[0] ?? ''];
      const end = row[item.importMergeCols?.[1] ?? ''];
      if(!start || !end) return [];
      return [`${DEFAULT_DATE} ${start}`, `${DEFAULT_DATE} ${end}`];
    default:
      return val;
  }
};

export default defineComponent({
  components: { DialogFormItem, Edit },
  props: {
    data: {
      type: Object as PropType<RenderRowData<Record<string, any>>>,
      required: true,
    },
    formItem: {
      type: Object as PropType<FormItem>,
      default: void 0,
    },
    col: {
      type: String,
    },
    modelValue: {
      type: [Object, Array, String, Number, Boolean],
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    const visible = ref(false);
    const eachValue = computed(() => props.data.row[props.data.column.property]);
    const initValue = eachValue.value;
    const currentValue = ref<any>();

    watch(visible, (val) => {
      if(val) {
        currentValue.value = getInitValue(eachValue.value, props.data, props.formItem);
      }
    });

    return {
      visible,
      title: computed(() => `修改：${props.col ?? '(?)'}${props.data.$index + 1} - ${props.data.column.label}`),
      initValue,
      eachValue,
      currentValue,
      // 修改
      submitAction: () => {
        visible.value = false;
        if(!props.formItem) {
          ctx.emit('update:modelValue', currentValue.value);
          return;
        }
        let newValue: any = currentValue.value;
        switch(props.formItem.customType) {
          case 'date':
            newValue = moment(newValue).format('YYYY-MM-DD');
            break;
          case 'time':
            newValue = moment(newValue).format('HH:mm:ss');
            break;
          default: break;
        }
        ctx.emit('update:modelValue', newValue);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.cell-row {
  display: inline-flex;
  align-items: center;
  width: 100%;

  >:deep.el-icon {
    margin-right: 5px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
