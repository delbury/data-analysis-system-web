import { reactive, shallowRef, computed, watch } from 'vue';
import { FormItemSection, FormItem } from '../interface';
import _cloneDeep from 'lodash/cloneDeep';
import _difference from 'lodash/difference';

export const useConfigCol = (sections: FormItemSection[]) => {
  // 创建表单的所需要的字段列表
  // 数据字段(1) -> 表格列(1)，映射关系
  const formFieldColMap = reactive<Record<string, string>>({});
  const formFieldColMapBak = shallowRef<Record<string, string>>({});
  const backupFieldColMap = () => formFieldColMapBak.value = _cloneDeep(formFieldColMap);

  // 表格列(1) -> 数据字段(n)，映射关系
  const formColFieldsMap = reactive<Record<string, string[]>>({});
  const formColFieldsMapBak = shallowRef<Record<string, string[]>>({});
  const backupColFieldMap = () => formColFieldsMapBak.value = _cloneDeep(formColFieldsMap);

  // form-item 展平列表
  const formItemFlatList = computed(() => {
    // 将 importDefaultCol 类型为 Record 的列拆分
    const res = sections.flatMap(section =>
      section.formItems.map(item => {
        if(!item.importDefaultCol || typeof item.importDefaultCol === 'string') return item;
        return Object.entries(item.importDefaultCol).map(([fld, col]) => ({ ...item, prop: fld, importDefaultCol: col }));
      }),
    ).flat();
    return res;
  });

  // 设置默认值
  const setMap = (fld: string, col: string) => {
    formFieldColMap[fld] = col;
    if(formColFieldsMap[col]) {
      formColFieldsMap[col].push(fld);
    } else {
      formColFieldsMap[col] = [fld];
    }
  };
  watch(formItemFlatList, (list) => {
    if(!list) return;

    list.forEach(item => {
      if(!item.prop || !item.importDefaultCol) return;

      if(typeof item.importDefaultCol === 'string') {
        // 一对一关系，取 prop
        setMap(item.prop, item.importDefaultCol);
      } else {
        // 一对多，手动映射关系
        Object.entries(item.importDefaultCol).forEach(([fld, col]) => setMap(fld, col));
      }
    });
    backupFieldColMap();
    backupColFieldMap();
  }, { immediate: true });

  // 是否是必选的字段
  const isRequired = (item: FormItem): boolean => {
    if(item.ruleNames?.length && item.ruleNames.includes('required')) {
      return true;
    }
    if(item.rules) {
      if(Array.isArray(item.rules)) {
        return item.rules.findIndex(it => it.required) > -1;
      } else {
        return !!item.rules.required;
      }
    }
    return false;
  };

  return {
    // 计数信息
    counts: computed(() => {
      // 总数
      const total = formItemFlatList.value.length;
      // 必填
      let required = 0;
      // 已分配
      let assigned = 0;
      // 已分配必填
      let assignedRequired = 0;

      formItemFlatList.value.forEach(it => {
        if(!it.prop) return;

        const requiredFlag = isRequired(it);
        if(requiredFlag) required++;
        if(formFieldColMap[it.prop]) {
          assigned++;
          if(requiredFlag) assignedRequired++;
        }
      });

      Object.values(formFieldColMap).forEach(it => {
      });

      return {
        unassigned: total - assigned,
        unassignedRequired: required - assignedRequired,
        total,
      };
    }),
    formFieldColMap,
    formColFieldsMap,
    formItemFlatList,
    isRequired,
    // 数据字段 -> 表格列，改变时同步改变，表格列 -> 数据字段
    handleFieldColMapChange: (curVal: string, fld: string) => {
      // formFieldColMap --> formColFieldsMap
      const oldVal = formFieldColMapBak.value[fld];
      // 缓存
      backupFieldColMap();
      // 同步变更 formColFieldsMap
      if(formColFieldsMap[oldVal]) {
        formColFieldsMap[oldVal] = formColFieldsMap[oldVal].filter(it => it !== fld);
        backupColFieldMap();
      }
      if(formColFieldsMap[curVal]) {
        formColFieldsMap[curVal].push(fld);
      } else {
        formColFieldsMap[curVal] = [fld];
      }
    },
    // 表格列 -> 数据字段，改变时同步改变，数据字段 ->  表格列
    handleColFieldsMapChange: (curVal: string, col: string) => {
      // formColFieldsMap --> formFieldColMap
      const oldVal = formColFieldsMapBak.value[col] ?? [];
      const addList = _difference(curVal, oldVal);
      const removeList = _difference(oldVal, curVal);
      // 缓存
      backupColFieldMap();
      // 同步变更 formFieldColMap
      removeList.forEach(fld => Reflect.deleteProperty(formFieldColMap, fld));
      addList.forEach(fld => formFieldColMap[fld] = col);
      backupFieldColMap();
    },
  };
};
