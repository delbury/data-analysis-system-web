<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :row-btns="[
        { label: '编辑', key: 'default-edit' },
        { label: '删除', key: 'default-delete' },
      ]"
      :dialog-props="{ width: '600px' }"
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
    // table 参数
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

    const formInitValues = {};
    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '名称', prop: 'name', span: 24 },
          { label: '备注',
            prop: 'remark',
            span: 24,
            customType: 'textarea',
          },
        ],
      },
    ];

    return {
      apis: apis.basedata_teamgroup,
      columns,
      formInitValues,
      formItems,
    };
  },
});
</script>
