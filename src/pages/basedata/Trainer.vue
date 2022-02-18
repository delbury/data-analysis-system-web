<template>
  <div class="page">
    <CompTable
      :columns="columns"
      :apis="apis.basedata_trainer"
      :form-init-values="formInitValues"
      :form-items="formItems"
      :form-props="{ labelWidth: '100px' }"
    >
      <template #form-footer-left="{ readonly, form }">
        <template v-if="!readonly">
          <el-popover
            v-model:visible="selectVisible"
            title="选择人员信息"
            placement="top-start"
            trigger="click"
            width="300px"
          >
            <template #reference>
              <el-button @click="selectVisible = !selectVisible">
                选择人员
              </el-button>
            </template>

            <comp-remote-select
              :api="apis.basedata_staff.get"
              @change="handleSelectChange"
            >
              <template #option="{ item }">
                {{ item.label }} / {{ item.code }} / {{ item.phone }}
              </template>
            </comp-remote-select>
            <div class="flex-end mg-t">
              <el-button @click="selectVisible = false">
                取消
              </el-button>
              <el-button type="primary" @click="() => selectAction(form)">
                确定
              </el-button>
            </div>
          </el-popover>
        </template>
      </template>
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
        label: '所属单位',
        prop: 'company',
      },
      {
        label: '姓名',
        prop: 'name',
      },
      {
        label: '工号',
        prop: 'code',
      },
      {
        label: '手机号码',
        prop: 'phone',
      },
      {
        label: '类型',
        prop: 'type', // 1：内部，2：外部
        formatMap: common.maps.TRAINER_TYPE_MAP,
      },
      {
        label: '星级',
        prop: 'level',
        formatMap: common.maps.TRAINER_LEVEL_MAP,
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
            label: '所属单位',
            prop: 'company',
            span: 12,
            ruleNames: ['required', 'normalLength'],
          },
          { label: '名称', prop: 'name', span: 12, ruleNames: ['required', 'normalLength'] },
          { label: '工号', prop: 'code', span: 12, ruleNames: ['required'] },
          { label: '手机号码', prop: 'phone', span: 12, ruleNames: ['required', 'phone'] },
          {
            label: '类型',
            prop: 'type',
            span: 12,
            customType: 'select',
            customOption: {
              options: common.opts.TRAINER_TYPE_OPTIONS,
            },
            ruleNames: ['required'],
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

    // 当前选中的人员
    const selectVisible = ref(false);
    const currentPerson = ref<StaffTable>();
    watch(selectVisible, (val) => {
      if(!val) {
        currentPerson.value = void 0;
      }
    });

    return {
      apis,
      columns,
      formInitValues: getFormItemInitValues(formItems),
      formItems: reactive(formItems),
      selectVisible,
      selectAction: (form: Partial<TrainerTable>) => {
        const cp = currentPerson.value;
        if(cp) {
          form.name = cp.name;
          form.code = cp.code;
          form.phone = cp.phone;
          form.type = cp.group_type;
        }
        selectVisible.value = false;
      },
      handleSelectChange: (val?: string, opt?: StaffTable) => {
        currentPerson.value = opt;
      },
    };
  },
});
</script>
