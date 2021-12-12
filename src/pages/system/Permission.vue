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

export default defineComponent({
  name: 'PageSystemPermission',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '路径',
        prop: 'path',
      },
      {
        label: '接口权限',
        prop: 'tags',
        customType: 'list',
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
          {
            label: '路径',
            prop: 'path',
            span: 24,
            ruleNames: ['required', 'normalLength', 'path'],
            customOption: {
              placeholder: '请输入路径，e.g. /xxx/yyy',
            },
          },
          {
            label: '接口权限',
            prop: 'tags',
            default: [],
            span: 24,
            ruleNames: ['required', 'longerLength', 'tag'],
            customType: 'tags',
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.system_permission,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
