<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :form-props="{ labelWidth: '100px' }"
    >
    </CompTable>
  </div>
</template>

<script lang="ts">
import { customRef, defineComponent, reactive } from 'vue';
import { apis } from '~/service';
import { FormItemSection, ColumnProps } from '~/components/CompTable/interface';
import { getFormItemInitValues } from '~/components/CompTable/util';
import common from '~/pages/common';
import moment from 'moment';

export default defineComponent({
  name: 'PageBasedataStaff',
  setup() {
    const columns: ColumnProps[] = [
      {
        label: '姓名',
        prop: 'name',
        search: true,
      },
      {
        label: '性别',
        prop: 'sex',
        formatMap: common.maps.STAFF_SEX_MAP,
        search: true,
      },
      {
        label: '工号',
        prop: 'code',
        search: true,
      },
      {
        label: '手机号码',
        prop: 'phone',
      },
      {
        label: '班组',
        prop: 'group_name',
        search: 'remote',
        searchProp: 'group_id',
        searchAttach: {
          ...common.remote.GROUP_ID_REMOTE_OPTIONS,
        },
      },
      {
        label: '班组类型',
        prop: 'group_type',
        formatMap: common.maps.GROUP_TYPE_MAP,
        search: true,
      },
      {
        label: '是否取证',
        prop: 'has_cert',
        tip: '上岗资格证书',
        customType: 'bool',
      },
      {
        label: '人员状态',
        prop: 'status',
        formatMap: common.maps.STAFF_STATUS_MAP,
        search: true,
      },
      {
        label: '入职时间',
        prop: 'join_date',
        customType: 'date',
      },
      {
        label: '离职时间',
        prop: 'quit_date',
        customType: 'date',
      },
      {
        label: '备注',
        prop: 'remark',
      },
    ];

    const formItems: FormItemSection[] = [
      {
        formItems: [
          { label: '名称', prop: 'name', span: 12, ruleNames: ['required', 'normalLength'] },
          {
            label: '性别',
            prop: 'sex',
            span: 12,
            ruleNames: ['required'],
            customType: 'select',
            customOption: {
              options: common.opts.STAFF_SEX_OPTIONS,
            },
          },
          { label: '工号', prop: 'code', span: 12, ruleNames: ['required'] },
          { label: '手机号码', prop: 'phone', span: 12, ruleNames: ['required', 'phone'] },
          {
            label: '班组',
            prop: 'group_id',
            span: 12,
            ruleNames: ['required'],
            customType: 'remote-select',
            customOption: {
              ...common.remote.GROUP_ID_REMOTE_OPTIONS,
            },
          },
          { label: '是否取证', info: '上岗资格证书', prop: 'has_cert', span: 12, customType: 'bool' },
          {
            label: '状态',
            prop: 'status',
            span: 12,
            ruleNames: ['required'],
            customType: 'select',
            customOption: {
              options: common.opts.STAFF_STATUS_OPTIONS,
            },
          },
          {
            label: '入职时间',
            prop: 'join_date',
            span: 12,
            customType: 'date',
            valueSubmitHandler: ({ value }) => {
              return {
                join_date: value ? moment(value).format('YYYY-MM-DD') : value,
              };
            },
          },
          {
            label: '离职时间',
            prop: 'quit_date',
            span: 12,
            customType: 'date',
            valueSubmitHandler: ({ value }) => {
              return {
                quit_date: value ? moment(value).format('YYYY-MM-DD') : value,
              };
            },
          },
          { label: '备注', prop: 'remark', span: 24, customType: 'textarea' },
        ],
      },
    ];

    return {
      apis: apis.basedata_staff,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
    };
  },
});
</script>
