import { ColumnProps } from './interface';

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
      } else {
        col.minWidth = 100;
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
