import { ColumnProps, FormItemSection } from './interface';
import { FetchersGetType } from '/@/service/tools';

// 处理一些预设配置
export const walkColumnConfig = (columns: ColumnProps[]): ColumnProps[] => {
  return columns.map((col) => {
    if(!col.minWidth && !col.width) {
      if(col.customType) {
        switch(col.customType) {
          case 'date':
            col.minWidth = 100;
            break;
          case 'datetime':
            col.minWidth = 150;
            break;
          case 'time':
            col.minWidth = 100;
            break;
          default:
            break;
        }
      }

      if(!col.minWidth) {
        col.minWidth = 20 * Math.min(col.label?.length ?? 6, 6);
      }
    }

    if(col.customType === 'int' || col.customType === 'float') {
      (col as any).align = 'right';
    }

    if(Array.isArray(col.children)) {
      walkColumnConfig(col.children);
    }

    return col;
  });
};

// 创建远程选择表单项的配置
interface FormItemOptionsConfig {
  labelField?: string;
  valueField?: string;
  rebuildLabelField: string; // 返回数据的label字段
  rebuildValueField: string; // 返回数据的value字段
}
export const getRemoteSelectFormItemOptions = (
  fetcher: FetchersGetType, config: FormItemOptionsConfig,
) => {
  const {
    labelField = 'name',
    valueField = 'id',
    rebuildLabelField,
    rebuildValueField,
  } = config;

  return {
    remoteMethod: async (text: string, record: any) => {
      // 缓存请求
      if(!text && record.options?.length && !record.lastSearchedText) return;

      try {
        record.loading = true;
        const res = await fetcher({ all: 1 });
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
    },
  };
};
