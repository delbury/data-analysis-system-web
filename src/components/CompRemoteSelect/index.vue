<template>
  <el-select-v2
    v-model="selected"
    style="width: 100%;"
    clearable
    filterable
    remote
    :remote-method="handleSearch"
    :options="options"
    :teleported="false"
    @change="val => handleChange(val)"
    @visible-change="handleVisibleChange"
  >
    <template #default="data">
      <slot name="option" v-bind="data">
        {{ data.item.label }}
      </slot>
    </template>
  </el-select-v2>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { FetchersGetType } from '~/service/tools';

export default defineComponent({
  name: 'CompRemoteSelect',
  props: {
    api: {
      type: Function as PropType<FetchersGetType>,
      required: true,
    },
    modelValue: {
      type: String,
    },
  },
  emits: ['change'],
  setup(props, ctx) {
    const options = ref<any[]>([]);

    const handleSearch = async (text: string) => {
      const data = await props.api({ name: text });
      options.value = data.data.data.list.map(it => ({
        ...it,
        label: it.name,
        value: it.id,
      }));
    };

    return {
      selected: ref(''),
      options,
      handleSearch,
      handleVisibleChange: (visible: boolean) => {
        if(!options.value.length && visible) {
          handleSearch('');
        }
      },
      handleChange: (val?: string) => {
        ctx.emit('change', val, options.value.find(it => it.id === val));
      },
    };
  },
});
</script>
