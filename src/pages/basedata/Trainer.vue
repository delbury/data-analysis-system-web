<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :form-props="{ labelWidth: '100px' }"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { apis } from '~/service';
import { FormItemSection, ColumnProps } from '~/components/CompTable/interface';
import { getFormItemInitValues } from '~/components/CompTable/util';
import common from '~/pages/common';

export default defineComponent({
  name: 'PageBasedataTrainer',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '所属单位',
        prop: 'company',
      },
      {
        label: '姓名',
        prop: 'name',
      },
      {
        label: '工号',
        prop: 'code',
      },
      {
        label: '手机号码',
        prop: 'phone',
      },
      {
        label: '类型',
        prop: 'type', // 1：内部，2：外部
        formatMap: common.maps.TRAINER_TYPE_MAP,
      },
      {
        label: '星级',
        prop: 'level',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '所属单位', prop: 'company', span: 12, ruleNames: ['required', 'normalLength'] },
          { label: '名称', prop: 'name', span: 12, ruleNames: ['required', 'normalLength'] },
          { label: '工号', prop: 'code', span: 12, ruleNames: ['required'] },
          { label: '手机号码', prop: 'phone', span: 12, ruleNames: ['required', 'phone'] },
          {
            label: '类型',
            prop: 'type',
            span: 12,
            customType: 'select',
            customOption: {
              options: common.opts.TRAINER_TYPE_OPTIONS,
            },
            ruleNames: ['required'],
          },
          {
            label: '星级',
            prop: 'level',
            span: 12,
            customType: 'select',
            customOption: {
              options: common.opts.TRAINER_LEVEL_OPTIONS,
            },
            ruleNames: ['required'],
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.basedata_trainer,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
