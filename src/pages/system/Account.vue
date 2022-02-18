<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :form-props="{ labelWidth: '100px' }"
      :dialog-props="{ width: '600px' }"
      :show-import-btn="false"
      :show-export-btn="false"
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
  name: 'PageBasedataAccount',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '账号',
        prop: 'account',
      },
      {
        label: '密码',
        prop: 'password',
      },
      {
        label: '角色',
        prop: 'roles',
        customType: 'list',
        listLabelKey: 'name',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '名称', prop: 'name', span: 24, ruleNames: ['required', 'normalLength'] },
          { label: '账号', prop: 'account', span: 24, ruleNames: ['required', 'normalLength'] },
          { label: '密码', prop: 'password', span: 24, ruleNames: ['required', 'normalLength'] },
          {
            label: '角色',
            prop: 'roles',
            default: [],
            span: 24,
            ruleNames: ['required'],
            customType: 'remote-select-multi',
            customOption: {
              ...common.remote.ROLE_REMOTE_OPTIONS,
            },
            valueRebuildHandler: ({ value }) => {
              return {
                roles: value ? value.map(it => it.id) : [],
              };
            },
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.system_account,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
