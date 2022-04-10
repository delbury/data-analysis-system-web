<template>
  <!-- 开关 -->
  <el-switch
    v-if="item.customType === 'bool'"
    :disabled="formItemDisabled(item.disabled)"
    inline-prompt
    active-text="是"
    inactive-text="否"
    :active-value="1"
    :inactive-value="0"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-switch>
  <!-- 选择 -->
  <el-select-v2
    v-else-if="item.customType === 'select'"
    style="width: 100%;"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-select-v2>
  <!-- 远程选择 -->
  <el-select-v2
    v-else-if="item.customType === 'remote-select' || item.customType === 'remote-select-multi'"
    style="width: 100%;"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    filterable
    remote
    :multiple="item.customType === 'remote-select-multi'"
    v-bind="item.customOption ?? {}"
    :remote-method="(text) => item.customOption?.remoteMethod?.(text, item.customOption)"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
    @visible-change="(visible) => {
      if(visible) {
        item.customOption?.remoteMethod?.('', item.customOption)
      }
    }"
  >
    <template #default="{ item: it }">
      <div>{{ [it.label, ...(item.customOption?.optionRender?.(it) ?? [])].join(' | ') }}</div>
    </template>
  </el-select-v2>
  <!-- tags -->
  <el-select
    v-else-if="item.customType === 'tags'"
    style="width: 100%;"
    clearable
    allow-create
    filterable
    multiple
    default-first-option
    placeholder="请输入后按回车或选择确定"
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-select>
  <!-- 日期 -->
  <el-date-picker
    v-else-if="item.customType === 'date'"
    style="width: 100%;"
    type="date"
    :placeholder="readonly ? '' : '请选择日期'"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-date-picker>
  <!-- 时刻 -->
  <el-time-picker
    v-else-if="item.customType === 'time'"
    style="width: 100%;"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-time-picker>
  <!-- 时间范围 -->
  <el-time-picker
    v-else-if="item.customType === 'timerange'"
    style="width: 100%;"
    is-range
    :start-placeholder="readonly ? '' : '开始时间'"
    :end-placeholder="readonly ? '' : '结束时间'"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-time-picker>
  <!-- 整数 -->
  <el-input-number
    v-else-if="item.customType === 'int'"
    style="width: 100%;"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    :min="0"
    :step="1"
    step-strictly
    controls-position="right"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(Number(val) ?? 0)"
  ></el-input-number>
  <!-- 浮点数 -->
  <el-input-number
    v-else-if="item.customType === 'float'"
    style="width: 100%;"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    :min="0"
    :precision="2"
    controls-position="right"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(Number(val) ?? 0)"
  ></el-input-number>
  <!-- 长文本 -->
  <el-input
    v-else-if="item.customType === 'textarea'"
    style="width: 100%;"
    type="textarea"
    :autosize="{ minRows: 2 }"
    :placeholder="readonly ? '' : '请输入'"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-input>
  <!-- 文本输入 -->
  <el-input
    v-else
    :placeholder="readonly ? '' : '请输入'"
    clearable
    :disabled="formItemDisabled(item.disabled)"
    v-bind="item.customOption ?? {}"
    :model-value="modelValue"
    @update:model-value="val => handleChange(val)"
  ></el-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { FormItem } from '../interface';

export default defineComponent({
  props: {
    item: {
      type: Object as PropType<FormItem>,
      required: true,
    },
    form: {
      type: Object,
      default: void 0,
    },
    modelValue: {
      default: '',
      type: [Object, Number, String, Boolean, Array],
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    globalDisabled: {
      type: Boolean,
      default: void 0,
    },
  },
  emits: ['update:modelValue'],
  setup(props, ctx) {
    return {
      formItemDisabled: (itemDisabled: boolean | ((form: any) => boolean) = false) => {
        if(props.globalDisabled !== void 0) return props.globalDisabled;

        return typeof itemDisabled === 'boolean' ? itemDisabled : itemDisabled(props.form ?? {});
      },
      handleChange: (val: any) => {
        ctx.emit('update:modelValue', val);
      },
    };
  },
});
</script>
