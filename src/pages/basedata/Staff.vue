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
import { apis } from '/@/service';
import { FormItemSection, ColumnProps } from '/@/components/CompTable/interface';
import { getFormItemInitValues, getRemoteSelectFormItemOptions } from '/@/components/CompTable/util';

export default defineComponent({
  name: 'PageBasedataTeamGroup',
  setup() {
    const columns: ColumnProps[] = [
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
        label: '班组',
        prop: 'group_name',
      },
      {
        label: '职系',
        prop: 'job',
      },
      {
        label: '是否取证',
        prop: 'has_cert',
        tip: '上岗资格证书',
        customType: 'bool',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '名称', prop: 'name', span: 12, ruleNames: ['required', 'normalLength'] },
          { label: '工号', prop: 'code', span: 12, ruleNames: ['required'] },
          { label: '手机号码', prop: 'phone', span: 12, ruleNames: ['required', 'phone'] },
          {
            label: '班组',
            prop: 'group_id',
            span: 12,
            ruleNames: ['required'],
            customType: 'remote-select',
            customOption: {
              ...getRemoteSelectFormItemOptions(apis.basedata_teamgroup.get, {
                rebuildLabelField: 'group_name',
                rebuildValueField: 'group_id',
              }),
            },
          },
          { label: '职系', prop: 'job', span: 12 },
          { label: '是否取证', info: '上岗资格证书', prop: 'has_cert', span: 12, customType: 'bool' },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.basedata_staff,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
