<template>
  <el-form
    v-if="configs?.length"
    ref="formRef"
    class="comp-table_table-search"
    :model="form"
    inline
  >
    <template
      v-for="item in configs"
      :key="item.searchProp"
    >
      <el-form-item
        :label="item.label"
        :prop="item.searchProp"
      >
        <!-- 选择 -->
        <!-- TODO 可创建选项时，组件存在样式问题，后期可以考虑变更为可创建选项 -->
        <el-select
          v-if="item.searchOptions"
          v-model="form[item.searchProp ?? '']"
          style="width: 200px;"
          clearable
          multiple
          collapse-tags
          :allow-create="false"
          :filterable="false"
          @change="handleChange"
        >
          <template
            v-for="opt in item.searchOptions"
            :key="opt.value"
          >
            <el-option
              :label="opt.label"
              :value="opt.value"
            ></el-option>
          </template>
        </el-select>
        <!-- 远程选择 -->
        <!-- TODO 多选时，组件存在样式问题，后期可以考虑变更为多选 -->
        <el-select-v2
          v-else-if="item.search === 'remote'"
          v-model="form[item.searchProp ?? '']"
          clearable
          filterable
          remote
          :multiple="false"
          :collapse-tags="false"
          placeholder="请搜索选择"
          v-bind="item.searchAttach ?? {}"
          :remote-method="(text) => item.searchAttach?.remoteMethod(text, item.searchAttach)"
          @visible-change="(visible) => {
            if(visible) {
              item.searchAttach?.remoteMethod('', item.searchAttach)
            }
          }"
          @change="handleChange"
        ></el-select-v2>
        <!-- 日期范围 -->
        <el-date-picker
          v-else-if="item.customType === 'date' || item.customType === 'datetime'"
          v-model="form[item.searchProp ?? '']"
          clearable
          value-format="YYYY-MM-DD"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px;"
          type="daterange"
          :shortcuts="shortcuts"
          @change="handleChange"
        ></el-date-picker>
        <!-- 文本输入 -->
        <el-input
          v-else
          v-model="form[item.searchProp ?? '']"
          clearable
          placeholder="请输入"
          @change="handleChange"
        ></el-input>
      </el-form-item>
    </template>

    <el-form-item>
      <el-button
        type="primary"
        @click="handleSearch()"
      >
        查询
      </el-button>
      <el-button @click="handleReset">
        重置
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { defineComponent, reactive, PropType, ref } from 'vue';
import { ColumnProps, FormInstance } from './interface';
import { getSearchConfigs } from './util';

export default defineComponent({
  props: {
    columns: {
      default: () => [],
      type: Array as PropType<ColumnProps[]>,
    },
  },
  emits: ['search'],
  setup(props, ctx) {
    // 搜索条件
    const search = getSearchConfigs(props.columns);
    const configs = reactive(search.configs);
    const form = reactive(search.fields);
    const formRef = ref<FormInstance>();

    // 日期范围快捷选项
    const shortcuts: { text: string; value: () => [Date, Date]; }[] = [
      {
        text: '当天',
        value: () => [new Date(), new Date()],
      },
      {
        text: '当月',
        value: () => {
          const start = new Date();
          start.setDate(1);
          let end = new Date(start);
          end.setMonth(start.getMonth() + 1);
          end = new Date(end.valueOf() - 24 * 3600 * 1000);
          return [start, end];
        },
      },
      {
        text: '上一个月',
        value: () => {
          const start = new Date();
          start.setMonth(start.getMonth() - 1);
          start.setDate(1);
          let end = new Date(start);
          end.setMonth(start.getMonth() + 1);
          end = new Date(end.valueOf() - 24 * 3600 * 1000);
          return [start, end];
        },
      },
    ];

    // 搜索
    const handleSearch = (reset = false) => {
      if(reset) {
        ctx.emit('search', void 0);
        return;
      }

      // 处理参数
      const temp: Record<string, any> = {};
      Object.entries(form).forEach(([key, val]) => {
        if(search.dateFieldSet.has(key) && val?.length >= 2) {
          // 范围类型
          temp[`_start_${key}`] = val[0] + ' 00:00:00';
          temp[`_end_${key}`] = val[1] + ' 23:59:59';
        } else {
          temp[key] = val;
        }
      });
      ctx.emit('search', temp);
    };

    return {
      formRef,
      form,
      configs,
      shortcuts,
      handleSearch,
      // 值改变
      handleChange: () => {
        handleSearch();
      },
      // 重置搜索条件
      handleReset: () => {
        formRef.value?.resetFields();
        handleSearch(true);
      },
    };
  },
});
</script>

<style lang="scss" scoped>
.comp-table_table-search {
  padding: $gap-n $gap-l;
  padding-bottom: 0;

  .el-form-item {
    padding-right: 0;
    margin-bottom: $gap-n;
  }
}
</style>
