/**
 * 导出成 excel
 */

import xlsx from 'xlsx';
import moment from 'moment';
import { ColumnProps } from '../interface';
import pick from 'lodash/pick';
import mapValues from 'lodash/mapValues';
import invert from 'lodash/invert';

// 构造 headers
const createHeader = (columns: ColumnProps[]) => {
  // header 数组
  const list: string[] = [];
  // 插入的 header 展示行
  const row: Record<string, string> = {};
  // 需要格式化的数据
  const formatterMap: Record<string, NonNullable<ColumnProps['customFormatter']>> = {};

  // 递归
  const walk = (cols?: ColumnProps[]) => {
    if(!cols) return;
    cols.forEach(col => {
      if(col.prop) {
        list.push(col.prop);
        row[col.prop] = (col.label ?? '') + (col.tip ? `（${col.tip}）` : '');

        // 记录需要格式化的字段及其函数
        if(col.customFormatter) {
          formatterMap[col.prop] = col.customFormatter;
        }
      }
      walk(col.subColumns);
    });
  };
  walk(columns);
  return { list, row, formatterMap };
};

// 统计字符长度
const FAT_CHAR_REG = /[A-Z]/;
const calcCountByLang = (str: string) => {
  let count = 0;
  for(const c of str) {
    // ASCII除了大写字母算作 1 个，其他算两个
    count += ((FAT_CHAR_REG.test(c) || c.charCodeAt(0) > 127) ? 2 : 1);
  }
  return count;
};
const calcStringCount = (str: string, curCount = 0, maxCount = 50, minCounst = 8) => {
  const length = str ? calcCountByLang(String(str)) : 0;
  const newCount = Math.min(Math.max(length, minCounst), maxCount);
  return Math.max(newCount, curCount);
};


// 导出保存为 excel
interface ExtraFontRow {
  data: string;
  // 合并主体数据的列数
  fullMerge?: boolean;
}
export const saveFile = (
  // 数据源
  data: {}[],
  // 列配置
  columns: ColumnProps[],
  // 表名
  tableName = '导出',
  // 额外参数
  extra?: {
    // 额外的附加在头部的数据
    extraFontRows?: (string | ExtraFontRow)[][],
    // 文件名不需要时间
    hideExportTime?: boolean;
  },
) => {
  // 导出的文件名
  const fileName = extra?.hideExportTime ? `${tableName}.xlsx` : `${tableName}__${moment(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;
  // 创建工作簿
  const workbook = xlsx.utils.book_new();
  // 构造表头
  const header = createHeader(columns);

  // 数据字段对应到 excel 列的 index，用来记录对应的列配置
  const headerIndexMap = invert(header.list);
  // 每列的最大字符长度
  const headerColStringMaxCounts: number[] = [];

  // 额外的头部数据
  const extraFontRowsMerges: xlsx.Range[] = [];
  const extraFontRows = extra?.extraFontRows?.map((rows, rIndex) => {
    const obj = {};
    rows.forEach((r, cIndex) => {
      const rData = typeof r === 'string' ? r : r.data;

      if(header.list[cIndex]) {
        obj[header.list[cIndex]] = rData;
      } else {
        // 超出主体数据长度的额外数据，自定义临时 key
        const key = `__extra_col_${cIndex}`;
        obj[key] = rData;
      }

      // 是否有合并单元格
      if(typeof r !== 'string' && r.fullMerge) {
        extraFontRowsMerges.push({
          s: {
            c: cIndex,
            r: rIndex,
          },
          e: {
            c: cIndex + header.list.length - 1,
            r: rIndex,
          },
        });
      }
    });
    return obj;
  }) ?? [];

  // 创建表
  const sheet = xlsx.utils.json_to_sheet(
    [
      ...extraFontRows,
      header.row,
      ...data.map(item =>
        // 格式化导出数据
        mapValues(
          // 过滤导出数据字段
          pick(item, header.list),
          (val: any, key) => {
            // 实际导出的数据
            const formattedVal = header.formatterMap[key] ? header.formatterMap[key](val, item) : val;
            const index = headerIndexMap[key];
            headerColStringMaxCounts[index] = calcStringCount(formattedVal, headerColStringMaxCounts[index]);
            return formattedVal;
          },
        ),
      ),
    ],
    { header: header.list, skipHeader: true },
  );

  // 列宽
  const colInfos: xlsx.ColInfo[] = headerColStringMaxCounts.map(it => ({ wch: it + 2 }));
  sheet['!cols'] = colInfos;
  // 列合并
  sheet['!merges'] = extraFontRowsMerges;

  // 添加表到工作簿
  xlsx.utils.book_append_sheet(workbook, sheet, tableName);
  // 保存为文件
  xlsx.writeFile(workbook, fileName);
};
