<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :row-btns="[]"
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

export default defineComponent({
  name: 'PageBasedataTeamGroup',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: 'Tag',
        prop: 'tag',
      },
      {
        label: '权限',
        prop: 'permission',
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
          { label: 'Tag', prop: 'tag', span: 24, ruleNames: ['required', 'normalLength'] },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.role,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
