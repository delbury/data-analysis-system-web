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
        label: '页面元素权限',
        prop: 'elms',
        customType: 'list',
        showOverflowTooltip: true,
      },
      {
        label: '接口权限',
        prop: 'apis',
        customType: 'list',
        showOverflowTooltip: true,
      },
      {
        label: '数据权限',
        prop: 'datas',
        customType: 'list',
        showOverflowTooltip: true,
      },
      {
        label: '备注',
        prop: 'remark',
        showOverflowTooltip: true,
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
            info: '有权限进入的页面路径，根路径"/"表示所有页面',
          },
          {
            label: '元素权限',
            prop: 'elms',
            default: [],
            span: 24,
            ruleNames: ['longerLength', 'tag'],
            customType: 'tags',
            info: '对应页面的额外元素权限',
          },
          {
            label: '接口权限',
            prop: 'apis',
            default: [],
            span: 24,
            ruleNames: ['required', 'longerLength', 'tag'],
            customType: 'tags',
            info: '对应数据表的操作权限，格式：table, table.read',
          },
          {
            label: '数据权限',
            prop: 'datas',
            default: [],
            span: 24,
            ruleNames: ['longerLength', 'tag'],
            customType: 'tags',
            info: '对应数据表对应字段及其值的数据权限，格式：table.field.value',
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
