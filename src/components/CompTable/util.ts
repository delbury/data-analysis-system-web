import { ColumnProps, FormItemSection } from './interface';
import { FetchersGetType } from '/@/service/tools';

// 处理一些预设配置
export const walkColumnConfig = (columns: ColumnProps[]): ColumnProps[] => {
  return columns.map((col) => {
    // 当没有设置列宽度时，设置默认宽度
    if(!col.minWidth && !col.width) {
      let minWidth: number | undefined = void 0;
      // 设置自定义类型为日期时间时的默认宽度
      if(col.customType) {
        switch(col.customType) {
          case 'date':
            minWidth = 100;
            break;
          case 'datetime':
            minWidth = 150;
            break;
          case 'time':
            minWidth = 100;
            break;
          default:
            break;
        }
      }
      // 默认最小宽度
      if(!minWidth) {
        minWidth = 20 * Math.min(col.label?.length ?? 6, 6);
      }
      // 有排序按钮的增加默认宽度
      // if(col.sortable === 'custom') {
      //   minWidth += 24;
      // }

      col.minWidth = minWidth;
    }

    // 当自定义类型为数字类型时，右对齐
    if(col.customType === 'int' || col.customType === 'float') {
      col.align = 'right';
    }
    // 遍历嵌套列配置
    if(Array.isArray(col.children)) {
      walkColumnConfig(col.children);
    }

    return col;
  });
};

// 创建远程选择表单项的配置
interface FormItemOptionsConfig {
  labelField?: string; // 查询的可选数据的label字段
  valueField?: string; // 查询的可选数据的value字段
  rebuildLabelField?: string; // 返回数据的label字段
  rebuildValueField?: string; // 返回数据的value字段
  rebuildListField?: string; // 返回list数据的字段
}
export const getRemoteSelectFormItemOptions = (
  fetcher: FetchersGetType, config?: FormItemOptionsConfig,
) => {
  const {
    labelField = 'name',
    valueField = 'id',
    rebuildListField,
    rebuildLabelField = 'name',
    rebuildValueField = 'id',
  } = config ?? {};

  return {
    remoteMethod: async (text: string, record: any) => {
      // 缓存请求
      if(!text && record.options?.length && !record.lastSearchedText) return;

      try {
        record.loading = true;
        const res = await fetcher({ all: 1, [labelField]: text });
        record.options = (res.data.data.list ?? []).map((it) => ({ label: it[labelField], value: it[valueField] }));
      } finally {
        record.loading = false;
      }
      record.lastSearchedText = text;
    },
    options: [],
    loading: false,
    lastSearchedText: '',
    rebuildField: {
      label: rebuildLabelField,
      value: rebuildValueField,
      listField: rebuildListField,
    },
  };
};


// 生成表单默认值 map
export const getFormItemInitValues = (sections: FormItemSection[]) => {
  const res: Record<string, any> = {};
  sections.forEach(section => {
    section.formItems.forEach(item => {
      if(!item.prop) return;

      if(item.default === void 0) {
        // 根据不同类型设置缺少默认值时的默认值
        let val: any = '';
        switch(item.customType) {
          case 'timerange':
            val = [];
            break;
          case 'int':
          case 'float':
          case 'bool':
            val = 0;
            break;
          default:
            break;
        }
        res[item.prop] = val;
      } else {
        res[item.prop] = item.default;
      }
    });
  });

  return res;
};

// 生成搜索条件配置列表
export const getSearchConfigs = (columns: ColumnProps[]) => {
  // 搜索配置列表
  const configs: ColumnProps[] = [];
  // 搜索字段对象
  const fields: Record<string, any> = {};
  // date类型的字段
  const dateFieldSet: Set<string> = new Set();

  const walk = (cols?: ColumnProps[]) => {
    if(!cols) return;
    cols.forEach(item => {
      if((item.prop || item.searchProp) && item.search) {
        // 搜索条件
        const temp: ColumnProps = {
          ...item,
          searchProp: item.searchProp ?? item.prop,
        };
        // 构造选择项
        if(item.searchOptions) {
          temp.searchOptions = item.searchOptions;
        } else if(item.formatMap) {
          temp.searchOptions = Object.entries(item.formatMap).map(([key, val]) => ({
            value: Number.isNaN(Number(key)) ? key : Number(key),
            label: typeof val === 'string' ? val : val.text,
          }));
        }

        configs.push(temp);
        fields[temp.searchProp as string] = '';
        if(item.customType === 'date' || item.customType === 'datetime') {
          dateFieldSet.add(temp.searchProp as string);
        }
      }

      walk(item.children);
    });
  };
  walk(columns);
  return { configs, fields, dateFieldSet };
};
