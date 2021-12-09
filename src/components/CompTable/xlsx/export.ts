/**
 * 导出成 excel
 */

import xlsx from 'xlsx';
import moment from 'moment';
import { ColumnProps } from '../interface';
import _pick from 'lodash/pick';

// 构造 headers
const createHeader = (columns: ColumnProps[]) => {
  // header 数组
  const list: string[] = [];
  // 插入的 header 展示行
  const row: Record<string, string> = {};
  // 列配置
  const cols: xlsx.ColInfo[] = [];

  // 递归
  const walk = (cols?: ColumnProps[]) => {
    if(!cols) return;
    cols.forEach(col => {
      if(col.prop) {
        list.push(col.prop);
        row[col.prop] = (col.label ?? '') + (col.tip ? `（${col.tip}）` : '');
      }
      walk(col.subColumns);
    });
  };
  walk(columns);
  return { list, row };
};

// 导出保存为 excel
export const saveFile = (
  // 数据源
  data: Record<string, string>[],
  // 列配置
  columns: ColumnProps[],
  // 表名
  tableName = '导出',
) => {
  // 导出的文件名
  const fileName = `${tableName}__${moment(Date.now()).format('YYYY-MM-DD_HH:mm:ss')}__.xlsx`;
  // 创建工作簿
  const workbook = xlsx.utils.book_new();
  // 构造表头
  const header = createHeader(columns);
  // 创建表
  const sheet = xlsx.utils.json_to_sheet(
    [
      header.row,
      ...data.map(item => _pick(item, header.list)),
    ],
    { header: header.list, skipHeader: true },
  );
  // 添加表到工作簿
  xlsx.utils.book_append_sheet(workbook, sheet, tableName);
  // 保存为文件
  xlsx.writeFile(workbook, fileName);
};
