<template>
  <CompDialog
    :model-value="value"
    :dialog-props="{
      title,
      ...dialogProps,
    }"
    :submit-action="submitAction"
    :readonly="readonly"
    @open="handleOpen"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <el-form
      v-bind="formProps"
      ref="formRef"
      v-loading="loading"
      :model="form"
      class="comp-table__form"
      :class="{ readonly: readonly }"
      :disabled="readonly"
      :show-message="!readonly"
    >
      <template
        v-for="(section, index) in formItems"
        :key="`${section.title}-${index}`"
      >
        <el-row
          v-if="!section.sectionDisabled || !section.sectionDisabled(detail)"
          class="comp-table__form-section"
        >
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
                  ...(Array.isArray(item.rules) ? item.rules : (item.rules ? [item.rules] : [])).map(it => {
                    // 传入 form
                    if(it.validatorWithForm) {
                      it.validator = it.validatorWithForm(form)
                    }
                    return it;
                  }),
                  ...(item.ruleNames ?? []).map(name => defaultFormRules[name]).filter(it => it),
                ]"
              >
                <template #label>
                  <form-label :item="item"></form-label>
                </template>

                <!-- 开关 -->
                <el-switch
                  v-if="item.customType === 'bool'"
                  v-model="form[item.prop ?? '']"
                  :disabled="formItemDisabled(item.disabled)"
                  inline-prompt
                  active-text="是"
                  inactive-text="否"
                  :active-value="1"
                  :inactive-value="0"
                  v-bind="item.customOption ?? {}"
                ></el-switch>
                <!-- 选择 -->
                <el-select-v2
                  v-else-if="item.customType === 'select'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
                  v-bind="item.customOption ?? {}"
                ></el-select-v2>
                <!-- 远程选择 -->
                <el-select-v2
                  v-else-if="item.customType === 'remote-select' || item.customType === 'remote-select-multi'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
                  filterable
                  remote
                  :multiple="item.customType === 'remote-select-multi'"
                  v-bind="item.customOption ?? {}"
                  :remote-method="(text) => item.customOption?.remoteMethod?.(text, item.customOption)"
                  @visible-change="(visible) => {
                    if(visible) {
                      item.customOption?.remoteMethod?.('', item.customOption)
                    }
                  }"
                ></el-select-v2>
                <!-- tags -->
                <el-select
                  v-else-if="item.customType === 'tags'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  allow-create
                  filterable
                  multiple
                  default-first-option
                  placeholder="请输入后按回车或选择确定"
                  :disabled="formItemDisabled(item.disabled)"
                  v-bind="item.customOption ?? {}"
                ></el-select>
                <!-- 日期 -->
                <el-date-picker
                  v-else-if="item.customType === 'date'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="date"
                  :placeholder="readonly ? '' : '请选择日期'"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
                  v-bind="item.customOption ?? {}"
                ></el-date-picker>
                <!-- 时间 -->
                <el-time-picker
                  v-else-if="item.customType === 'timerange'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  is-range
                  :start-placeholder="readonly ? '' : '开始时间'"
                  :end-placeholder="readonly ? '' : '结束时间'"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
                  v-bind="item.customOption ?? {}"
                ></el-time-picker>
                <!-- 整数 -->
                <el-input-number
                  v-else-if="item.customType === 'int'"
                  v-model.number="form[item.prop ?? '']"
                  style="width: 100%;"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
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
                  :disabled="formItemDisabled(item.disabled)"
                  :min="0"
                  :precision="2"
                  controls-position="right"
                  v-bind="item.customOption ?? {}"
                ></el-input-number>
                <!-- 长文本 -->
                <el-input
                  v-else-if="item.customType === 'textarea'"
                  v-model="form[item.prop ?? '']"
                  style="width: 100%;"
                  type="textarea"
                  :autosize="{ minRows: 2 }"
                  :placeholder="readonly ? '' : '请输入'"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
                  v-bind="item.customOption ?? {}"
                ></el-input>
                <!-- 文本输入 -->
                <el-input
                  v-else
                  v-model="form[item.prop ?? '']"
                  :placeholder="readonly ? '' : '请输入'"
                  clearable
                  :disabled="formItemDisabled(item.disabled)"
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
import { defineComponent, reactive, PropType, ref, computed, watch, nextTick, shallowReactive, toRef } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { DialogStatus, FormItemSection, FormInstance, ElFormProps, FormItem } from './interface';
import { ElDialogProps } from '~/components/CompDialog/interface';
import { formRules } from './form-rules';
import FormLabel from './FormLabel.vue';

export default defineComponent({
  components: { FormLabel },
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
  setup(props, ctx) {
    // 是否加载了详情
    const isInited = ref(false);
    const form = reactive(cloneDeep(props.formInitValues));
    const formRef = ref<FormInstance | null>(null);
    // 编辑时的数据id
    const dataId = ref<number>();
    // 是否只读
    const readonly = computed(() => props.status === 'detail');
    // 已有数据的详情
    const detail = ref<Record<string, any>>();

    // 表单配置预处理
    const formItemsConfig = computed(() => {
      // 表单 item 配置的 map
      const map: Record<string, FormItem> = {};
      // // 表单 item 的回调列表
      const cbs: {
        cb: NonNullable<FormItem['formValueChangeHandler']>;
        prop?: string;
        config: FormItem;
      }[] = [];

      props.formItems.forEach(item => {
        item.formItems.forEach(it => {
          map[it.prop ?? ''] = it;

          if(it.formValueChangeHandler) {
            cbs.push({
              prop: it.prop,
              cb: it.formValueChangeHandler,
              config: it,
            });
          }
        });
      });
      return { map, cbs };
    });

    // 监听
    const unwatchers = shallowReactive<(() => void)[]>([]);
    watch(formItemsConfig, (current, old) => {
      // 解除旧的监听
      unwatchers.forEach(unwatch => unwatch());
      unwatchers.length = 0;

      // 详情不做计算
      if(props.status === 'detail') return;

      // 新增监听
      current.cbs.forEach(({ cb, prop, config }) => {
        if(prop && (prop in form)) {
          const unwatch = watch(toRef(form, prop), (newVal, oldVal) => {
            if(isInited.value) {
              const opts = config.customOption?.options;
              cb(newVal, form, opts?.find(it => it.value === newVal));
            }
          }, { immediate: config.immediate });
          unwatchers.push(unwatch);
        }
      });
    }, {
      immediate: true,
    });

    // 表单数据处理
    const resolveForm = (form: Record<string, any>) => {
      const temp: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        const formatter = formItemsConfig.value.map[key]?.valueSubmitHandler;
        if(formatter) {
          Object.assign(temp, formatter({ value: val, key, form }));
        } else if(val !== null && val !== void 0 && val !== '') {
          temp[key] = val;
        }
      });
      return temp;
    };

    // 设置表单的值
    const setFormValues = (params: Record<string, any>) => {
      // 设置详情数据
      detail.value = params;

      dataId.value = params.id;
      Object.keys(form).forEach(key => {
        const config = formItemsConfig.value.map[key];
        const formatter = config?.valueRebuildHandler;
        if(formatter) {
          const temp = formatter({
            value: params[key], key, params,
          });
          if(temp) {
            Object.entries(temp).forEach(([key, val]) => {
              if(key in form) {
                form[key] = val;
              }
            });
          }
        } else {
          form[key] = params[key] ?? '';
        }

        // 远程搜索，构造初始选项
        if(config?.customType === 'remote-select' && config.customOption) {
          config.customOption.lastSearchedText = '_inited';
          config.customOption.options = [
            {
              label: params[config.customOption?.rebuildField?.label ?? ''],
              value: params[config.customOption?.rebuildField?.value ?? ''],
            },
          ];
        } else if(config?.customType === 'remote-select-multi' && config.customOption) {
          config.customOption.lastSearchedText = '_inited';
          const list = params[config.customOption?.rebuildField?.listField ?? ''];
          if(list?.length) {
            config.customOption.options = list.map(it => ({
              label: it[config.customOption?.rebuildField?.label ?? ''],
              value: it[config.customOption?.rebuildField?.value ?? ''],
            }));
          }
        }
      });
      // 初始化完成
      nextTick(() => {
        isInited.value = true;
      });
    };

    return {
      readonly,
      form,
      formRef,
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
      handleOpen: () => {
        nextTick(() => {
          formRef.value?.clearValidate();
        });
      },
      handleOpened: () => {
        nextTick(() => {
          if(props.status === 'create') {
            isInited.value = true;
          }
        });
      },
      handleClosed: () => {
        // 弹框关闭重置表单
        formRef.value?.resetFields();
        dataId.value = void 0;
        detail.value = void 0;
        isInited.value = false;
      },
      setFormValues,
      defaultFormRules: formRules,
      detail,
      formItemDisabled: (itemDisabled: boolean | ((form: any) => boolean) = false) => {
        return typeof itemDisabled === 'boolean' ? itemDisabled : itemDisabled(form);
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

    :global(.is-disabled > *:not(.el-input__prefix):not(.el-input__suffix)),
    :global(.comp-table__form.readonly .el-select-v2__wrapper) {
      color: var(--el-input-font-color, var(--el-text-color-regular)) !important;
      cursor: not-allowed;
      // background-color: #fff !important;
      background-color: var(--el-disabled-bg-color) !important;
      border-color: var(--el-disabled-border-color);
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

    .label-wrapper {
      display: inline-flex;
      align-items: center;
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
