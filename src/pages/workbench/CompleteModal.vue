<template>
  <DialogForm
    ref="dialogFormRef"
    title="完成情况"
    :form-init-values="formInitValues"
    :form-items="formItems"
    status="create"
    :confirm-action="confirmAction"
    :col-span="8"
    :dialog-props="{ width: '1200px' }"
  >
    <template #info>
      <el-row class="train-info">
        培训信息
      </el-row>
      <el-row class="fs-s mg-b">
        <el-col :span="6">
          培训师：{{ detail?.trainer_name }}
        </el-col>
        <el-col :span="6">
          培训师工号：{{ detail?.trainer_code }}
        </el-col>
        <el-col :span="6">
          <FormLabel :item="{ label: '培训师星级', info: levelInfo }"></FormLabel>
          ：{{ getLevelInfo(detail?.trainer_level) }}
        </el-col>
        <el-col :span="6">
          培训总课时：{{ detail?.trained_hours_total }}
        </el-col>
      </el-row>
    </template>
  </DialogForm>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType } from 'vue';
import DialogForm from '~/components/CompTable/DialogForm/index.vue';
import { WorkbenchTable } from '~types/db-table-type';
import { FORM_ITEMS, TRAINER_LEVEL_SALARY_MAP } from './form';
import { getFormItemInitValues } from '~/components/CompTable/util';
import pick from 'lodash/pick';
import { apis } from '~/service';
import common from '~/pages/common';
import FormLabel from '~/components/CompTable/FormLabel.vue';

// 完成情况需要填写的表单信息
const COMPLETE_FORM_ITEMS = FORM_ITEMS
  .filter(it => it.key === 'complete')
  .map(it => ({ ...it, sectionDisabled: void 0 }));
const FORM_INIT_VALUES = getFormItemInitValues(COMPLETE_FORM_ITEMS);
const LEVEL_INFOS = [
  '培训课酬系数：',
  ...Object.entries(TRAINER_LEVEL_SALARY_MAP)
    .map(([k, v]) => `${common.maps.TRAINER_LEVEL_MAP[k]}：${v}`),
];

export default defineComponent({
  components: { DialogForm, FormLabel },
  props: {
    detail: {
      type: Object as PropType<WorkbenchTable>,
    },
  },
  emits: ['refresh'],
  setup(props, ctx) {

    return {
      formInitValues: pick(props.detail, [...Object.keys(FORM_INIT_VALUES)]),
      confirmAction: async (status: string, form: Partial<WorkbenchTable>) => {
        await apis.workbench.putComplete({ id: props.detail?.id, ...form });
        ctx.emit('refresh');
      },
      formItems: reactive(COMPLETE_FORM_ITEMS),
      getLevelInfo: (val: number) => {
        const map = common.maps.TRAINER_LEVEL_MAP;
        return map[val] ?? val;
      },
      levelInfo: LEVEL_INFOS,
    };
  },
});
</script>

<style lang="scss" scoped>
.train-info {
  padding: $gap-n 0;
  font-size: $fs-l;
  font-weight: bold;
}
</style>
