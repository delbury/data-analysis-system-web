<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :dialog-props="{ width: '600px' }"
      :form-props="{ labelWidth: '60px' }"
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
  name: 'PageBasedataTeamGroup',
  setup() {
    // table 参数
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'name',
      },
      {
        label: '类型',
        prop: 'type',
        formatMap: common.maps.GROUP_TYPE_MAP,
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
            label: '类型',
            prop: 'type',
            span: 24,
            customType: 'select',
            customOption: {
              options: common.opts.GROUP_TYPE_OPTIONS,
            },
            ruleNames: ['required'],
          },
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
      formInitValues: getFormItemInitValues(formItems),
      formItems,
    };
  },
});
</script>
