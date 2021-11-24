<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :row-btns="[
        { label: '详情', key: 'default-detail' },
        { label: '编辑', key: 'default-edit' },
        { label: '删除', key: 'default-delete' },
      ]"
      :dialog-props="{ width: '600px' }"
      :form-props="{ labelWidth: '60px' }"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { apis } from '/@/service';
import { FormItemSection, ColumnProps } from '/@/components/CompTable/interface';

export default defineComponent({
  name: 'PageBasedataTeamGroup',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formInitValues = {
      name: '',
      remark: '',
    };
    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '名称', prop: 'name', span: 24, ruleNames: ['required', 'normalLength'] },
          { label: '备注',
            prop: 'remark',
            span: 24,
            customType: 'textarea',
          },
        ],
      },
    ];

    return {
      apis: apis.basedata_staff,
      columns,
      formInitValues,
      formItems,
    };
  },
});
</script>
