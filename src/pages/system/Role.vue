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
import { apis } from '/@/service';
import { FormItemSection, ColumnProps } from '/@/components/CompTable/interface';
import { getFormItemInitValues } from '/@/components/CompTable/util';
import common from '/@/pages/common';

export default defineComponent({
  name: 'PageBasedataTeamGroup',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '权限',
        prop: 'permissions',
        customType: 'list',
        listLabelKey: 'name',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = reactive([
      {
        formItems: [
          { label: '名称', prop: 'name', span: 24, ruleNames: ['required', 'normalLength'] },
          {
            label: '权限',
            prop: 'permissions',
            default: [],
            span: 24,
            ruleNames: ['required'],
            customType: 'remote-select-multi',
            customOption: {
              ...common.remote.PERMISSION_REMOTE_OPTIONS,
            },
            valueRebuildHandler: ({ value }) => {
              return {
                permissions: value ? value.map(it => it.id) : [],
              };
            },
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ]);

    return {
      apis: apis.system_role,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
