<template>
  <CompDialog
    :model-value="value"
    :dialog-props="{
      title,
      ...dialogProps,
    }"
    :submit-action="submitAction"
    @closed="handleClosed"
  >
    <el-form
      ref="formRef"
      :model="form"
      class="comp-table__form"
    >
      <template
        v-for="(section, index) in formItems"
        :key="`${section.title}-${index}`"
      >
        <el-row class="comp-table__form-section">
          <el-col
            v-if="section.title"
            :span="24"
            class="comp-table__form-section-title"
          >
            {{ section.title }}
          </el-col>
          <template
            v-for="item in section.formItems"
            :key="item.prop"
          >
            <el-col :span="item.span ?? 6">
              <el-form-item
                v-bind="{ ...item, ref: void 0 }"
              >
                <template #label>
                  <el-tooltip
                    v-if="!!item.tip"
                    :content="item.tip"
                    placement="top"
                  >
                    <span>{{ formatLabel(item.label, item.tip) }}</span>
                  </el-tooltip>
                  <span v-else>{{ item.label }}</span>
                </template>

                <!-- 日期 -->
                <el-date-picker
                  v-if="item.customType === 'date'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="date"
                  placeholder="请选择日期"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-date-picker>
                <!-- 时间 -->
                <el-time-picker
                  v-else-if="item.customType === 'timerange'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  is-range
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-time-picker>
                <!-- 长文本 -->
                <el-input
                  v-else-if="item.customType === 'textarea'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  placeholder="请输入"
                ></el-input>
                <!-- 文本输入 -->
                <el-input
                  v-else
                  v-model="form[item.prop ?? '']"
                  placeholder="请输入"
                  :disabled="item.disabled"
                  :readonly="item.readonly"
                ></el-input>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </template>
    </el-form>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, ref } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { DialogStatus, FormItemSection } from './interface';
import { ElDialogProps } from '/@/components/CompDialog/interface';
import { ElForm } from 'element-plus';

type FormInstance = InstanceType<typeof ElForm>

export default defineComponent({
  props: {
    title: {
      type: String,
      default: '',
    },
    value: {
      type: Boolean,
      default: false,
    },
    formInitValues: {
      default: () => ({}),
      type: Object,
    },
    // 表单字段
    formItems: {
      default: () => [],
      type: Array as PropType<FormItemSection[]>,
    },
    dialogProps: {
      default: () => ({}),
      type: Object as PropType<ElDialogProps>,
    },
    confirmAction: {
      type: Function as PropType<(status: DialogStatus, data: any) => any>,
      default: null,
    },
    // 状态
    status: {
      type: String as PropType<DialogStatus>,
      default: 'create',
    },
  },
  setup(props) {
    const form = reactive(cloneDeep(props.formInitValues));
    const formRef = ref<FormInstance | null>(null);

    return {
      form,
      formRef,
      formatLabel: (label?: string, tip?: string) => {
        if(!tip) return label;
        return `${label}（${tip.length < 4 ? tip : tip.slice(0, 4) + '...'}）`;
      },
      submitAction: () => props?.confirmAction(props.status, form),
      handleClosed: () => {
        // 弹框关闭重置表单
        formRef.value?.resetFields();
      },
    };
  },
});
</script>

<style lang="scss" scoped>
  .comp-table__form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;

    :global(.el-form-item) {
      padding-right: 2em;
    }

    .comp-table__form-section {
      width: 100%;
      // margin-bottom: 10px;

      .comp-table__form-section-title {
        padding: 10px 0;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>
