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
      v-bind="formProps"
      ref="formRef"
      v-loading="loading"
      :model="form"
      class="comp-table__form"
      :class="{ readonly: disabled }"
      :disabled="disabled"
      :show-message="!disabled"
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
                :rules="[
                  ...(item.rules ?? []),
                  ...(item.ruleNames ?? []).map(name => defaultFormRules[name]).filter(it => it)
                ]"
              >
                <template #label>
                  <el-tooltip
                    v-if="!!item.tip"
                    :content="item.tip"
                    placement="top"
                  >
                    <span>{{ formatLabel(item.label, item.tip) }}</span>
                  </el-tooltip>

                  <span
                    v-else
                    class="info"
                  >
                    {{ item.label }}
                    <el-tooltip
                      v-if="!!item.info"
                      :content="item.info"
                      placement="top"
                    >
                      <el-icon class="info-icon"><warning /></el-icon>
                    </el-tooltip>
                  </span>
                </template>

                <!-- 开关 -->
                <el-switch
                  v-if="item.customType === 'bool'"
                  v-model="form[item.prop ?? '']"
                  :disabled="item.disabled"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                  v-bind="item.customOption ?? {}"
                ></el-switch>
                <el-select-v2
                  v-else-if="item.customType === 'remote-select'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="item.disabled || disabled"
                  filterable
                  remote
                  v-bind="item.customOption ?? {}"
                  :remote-method="(text) => item.customOption?.remoteMethod(text, item.customOption)"
                  @visible-change="(visible) => {
                    if(visible) {
                      item.customOption?.remoteMethod('', item.customOption)
                    }
                  }"
                ></el-select-v2>
                <!-- 日期 -->
                <el-date-picker
                  v-else-if="item.customType === 'date'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="date"
                  :placeholder="disabled ? '' : '请选择日期'"
                  clearable
                  :disabled="item.disabled"
                  v-bind="item.customOption ?? {}"
                ></el-date-picker>
                <!-- 时间 -->
                <el-time-picker
                  v-else-if="item.customType === 'timerange'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  is-range
                  :start-placeholder="disabled ? '' : '开始时间'"
                  :end-placeholder="disabled ? '' : '结束时间'"
                  clearable
                  :disabled="item.disabled"
                  v-bind="item.customOption ?? {}"
                ></el-time-picker>
                <!-- 整数 -->
                <el-input-number
                  v-else-if="item.customType === 'int'"
                  v-model.number="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="item.disabled"
                  :min="0"
                  :step="1"
                  step-strictly
                  controls-position="right"
                  v-bind="item.customOption ?? {}"
                ></el-input-number>
                <!-- 浮点数 -->
                <el-input-number
                  v-else-if="item.customType === 'float'"
                  v-model.number="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="item.disabled"
                  :min="0"
                  :controls="false"
                  v-bind="item.customOption ?? {}"
                ></el-input-number>
                <!-- 长文本 -->
                <el-input
                  v-else-if="item.customType === 'textarea'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  :placeholder="disabled ? '' : '请输入'"
                  clearable
                  :disabled="item.disabled"
                  v-bind="item.customOption ?? {}"
                ></el-input>
                <!-- 文本输入 -->
                <el-input
                  v-else
                  v-model="form[item.prop ?? '']"
                  :placeholder="disabled ? '' : '请输入'"
                  clearable
                  :disabled="item.disabled"
                  v-bind="item.customOption ?? {}"
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
import { defineComponent, reactive, PropType, ref, computed, onMounted } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { DialogStatus, FormItemSection, FormInstance, ElFormProps, FormItem } from './interface';
import { ElDialogProps } from '/@/components/CompDialog/interface';
import { formRules } from './form-rules';
import { Warning } from '@element-plus/icons';

export default defineComponent({
  components: { Warning },
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
    formProps: {
      default: () => ({}),
      type: Object as PropType<ElFormProps>,
    },
    confirmAction: {
      type: Function as PropType<(status: DialogStatus, data: any, id?: number) => any>,
      default: null,
    },
    // 状态
    status: {
      type: String as PropType<DialogStatus>,
      default: 'create',
    },
    // 请求中
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const form = reactive(cloneDeep(props.formInitValues));
    const formRef = ref<FormInstance | null>(null);
    // 编辑时的数据id
    const dataId = ref<number>();
    // 是否只读
    const disabled = computed(() => props.status === 'detail');

    // 表单配置map
    const formItemsMap = computed(() => {
      const map: Record<string, FormItem> = {};
      props.formItems.forEach(item => {
        item.formItems.forEach(it => {
          map[it.prop ?? ''] = it;
        });
      });
      return map;
    });
    // 表单数据处理
    const resolveForm = (form: Record<string, any>) => {
      const temp: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        const formatter = formItemsMap.value[key]?.valueSubmitHandler;
        if(formatter) {
          Object.assign(temp, formatter(val, key, form));
        } else if(val !== null && val !== void 0 && val !== '') {
          temp[key] = val;
        }
      });
      return temp;
    };

    // 设置表单的值
    const setFormValues = (params: Record<string, any>) => {
      dataId.value = params.id;
      Object.keys(form).forEach(key => {
        const formatter = formItemsMap.value[key]?.valueRebuildHandler;
        if(formatter) {
          const temp = formatter(params[key], key, params);
          Object.entries(temp).forEach(([key, val]) => {
            if(key in form) {
              form[key] = val;
            }
          });

        } else {
          form[key] = params[key] ?? '';
        }
      });
    };

    return {
      disabled,
      form,
      formRef,
      formatLabel: (label?: string, tip?: string) => {
        if(!tip) return label;
        return `${label}（${tip.length < 4 ? tip : tip.slice(0, 4) + '...'}）`;
      },
      submitAction: async() => {
        try {
          if(props.status !== 'detail') {
            await formRef.value?.validate();
            return await props?.confirmAction(props.status, resolveForm(form), dataId.value);
          }
        } catch(e) {
          return false;
        }
      },
      handleClosed: () => {
        // 弹框关闭重置表单
        formRef.value?.resetFields();
        dataId.value = void 0;
      },
      setFormValues,
      defaultFormRules: formRules,
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

    &.readonly {
      :global(.is-disabled *) {
        color: var(--el-input-font-color, var(--el-text-color-regular)) !important;
        // background-color: #fff !important;
      }
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

    .info {
      display: inline-flex;
      align-items: center;

      .info-icon {
        padding-left: 0.5em;
      }
    }
  }
</style>
