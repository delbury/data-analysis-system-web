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
  name: 'PageSystemConfig',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '名称',
        prop: 'label',
        search: true,
      },
      {
        label: '类型',
        prop: 'type',
        formatMap: common.maps.CONFIG_TYPE_MAP,
        search: true,
      },
      {
        label: '键',
        prop: 'key',
      },
      {
        label: '值',
        prop: 'value',
      },

      {
        label: '备注',
        prop: 'remark',
        showOverflowTooltip: true,
      },
    ];

    const formItems: FormItemSection[] = reactive([
      {
        formItems: [
          { label: '名称', prop: 'label', span: 24, ruleNames: ['required', 'normalLength'] },
          {
            label: '类型',
            prop: 'type',
            span: 24,
            ruleNames: ['required'],
            customType: 'select',
            customOption: {
              options: common.opts.CONFIG_TYPE_OPTIONS,
            },
          },
          { label: '键', prop: 'key', span: 24, ruleNames: ['required', 'normalLength'] },
          {
            label: '值',
            prop: 'value',
            span: 24,
            ruleNames: ['required', 'normalLength'],
            rules: [{
              validatorWithForm: (form) => (r, val, cb) => {
                if(form.type === 1) {
                  // int
                  if(Number.isNaN(+val) || Math.trunc(val) !== +val) {
                    return cb('必须为 int 类型的值');
                  }
                } else if(form.type === 2) {
                  // float
                  if(Number.isNaN(+val)) {
                    return cb('必须为 float 类型的值');
                  }
                }
                return cb();
              },
            }],
            systemEditable: true,
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ]);

    return {
      apis: apis.system_config,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
