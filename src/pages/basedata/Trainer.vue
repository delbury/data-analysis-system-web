<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis.basedata_trainer"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :form-props="{ labelWidth: '100px' }"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, watch } from 'vue';
import { apis } from '~/service';
import { FormItemSection, ColumnProps } from '~/components/CompTable/interface';
import { getFormItemInitValues } from '~/components/CompTable/util';
import common from '~/pages/common';
import CompRemoteSelect from '~/components/CompRemoteSelect/index.vue';
import { StaffTable, TrainerTable } from '~types/db-table-type';

export default defineComponent({
  name: 'PageBasedataTrainer',
  components: { CompRemoteSelect },
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '姓名',
        prop: 'staff_name',
        search: true,
      },
      {
        label: '工号',
        prop: 'staff_code',
        search: true,
      },
      {
        label: '手机号码',
        prop: 'staff_phone',
      },
      {
        label: '班组',
        prop: 'group_name',
      },
      {
        label: '班组类型',
        prop: 'group_type',
        formatMap: common.maps.GROUP_TYPE_MAP,
        search: true,
      },
      {
        label: '星级',
        prop: 'level',
        formatMap: common.maps.TRAINER_LEVEL_MAP,
        search: true,
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = [
      {
        formItems: [
          {
            label: '员工',
            prop: 'staff_id',
            span: 12,
            ruleNames: ['required'],
            customType: 'remote-select',
            customOption: {
              ...common.remote.STAFF_ID_REMOTE_OPTIONS,
            },
          },
          {
            label: '星级',
            prop: 'level',
            span: 12,
            customType: 'select',
            customOption: {
              options: common.opts.TRAINER_LEVEL_OPTIONS,
            },
            ruleNames: ['required'],
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
