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

// 保存为 excel 文件
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
    // 只生成并 return sheet
    onlyEmitSheet?: boolean;
  },
) => {
  // 导出的文件名
  const fileName = extra?.hideExportTime ? `${tableName}.xlsx` : `${tableName}__${moment(Date.now()).format('YYYY-MM-DD_HH-mm-ss')}.xlsx`;

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

  if(extra?.onlyEmitSheet) {
    return { sheet, sheetName: fileName };
  }

  // 创建工作簿
  const workbook = xlsx.utils.book_new();
  // 添加表到工作簿
  xlsx.utils.book_append_sheet(workbook, sheet, tableName);
  // 保存为文件
  xlsx.writeFile(workbook, fileName);
};

// 合并多个 sheet 为一个
export const mergeSheets = (sheets: xlsx.Sheet[]) => {

};

type SaveFileParameters = Parameters<typeof saveFile>;
// 创建多个工作簿到一个 excel 文件
export const saveSheetsFile = (sheetParams: {
  // 数据源
  data: SaveFileParameters[0],
  // 列配置
  columns: SaveFileParameters[1],
  // 表名
  tableName: SaveFileParameters[2],
  // 额外参数
  extra: SaveFileParameters[3],
}[], saveOption?: {
  // 生成的文件名
  fileName?: string;
  // 是否合并所有生成的 sheet
  mergeAllSheets?: boolean;
  // 合并生成的 sheet 表名
  mergedSheetName?: string;
  // 合并生成的 sheet 之间的间隔行数，默认为 1 行
  mergedSheetGapRow?: number;
}) => {
  const exportTime = moment(Date.now()).format('YYYY-MM-DD_HH-mm-ss');
  const fileName = `${saveOption?.fileName ?? '导出'}__${exportTime}.xlsx`;

  // 创建工作簿
  const workbook = xlsx.utils.book_new();

  sheetParams.forEach(params => {
    const sheet = saveFile(params.data, params.columns, params.tableName, {
      ...params.extra,
      hideExportTime: true,
      onlyEmitSheet: true,
    });

    // 添加表到工作簿
    if(sheet) {
      xlsx.utils.book_append_sheet(workbook, sheet.sheet, sheet.sheetName);
    }
  });

  // 讲生成的多个 sheet 合成到一个 sheet 中
  if(saveOption?.mergeAllSheets) {
    const mergedSheetName = saveOption.mergedSheetName ?? '合并总表';
    const mergedSheet = xlsx.utils.json_to_sheet([]);

    const colInfo: xlsx.ColInfo[] = [];
    const sheetJson = workbook.SheetNames.reduce((arr, sn) => {
      const sheet = workbook.Sheets[sn];
      arr.push(...xlsx.utils.sheet_to_json(sheet, { header: 'A' }));
      for(let i = 0; i < (saveOption?.mergedSheetGapRow ?? 1); i++) {
        arr.push([]);
      }

      // 计算合并后的列宽
      sheet['!cols']?.forEach((col, index) => {
        if(!colInfo[index]) {
          colInfo[index] = col;
        } else {
          // 全字段比较合并
          Object.entries(col).forEach(([k, v]) => {
            if(colInfo[index][k] === void 0 || v > colInfo[index][k]) {
              colInfo[index][k] = v;
            }
          });
        }
      });

      return arr;
    }, [] as any[]);
    xlsx.utils.sheet_add_json(mergedSheet, sheetJson, { skipHeader: true });
    mergedSheet['!cols'] = colInfo;

    xlsx.utils.book_append_sheet(workbook, mergedSheet, mergedSheetName);
    // 调整合并后的表为第一张表
    const temp = workbook.SheetNames.pop();
    !!temp && workbook.SheetNames.unshift(temp);
  }

  // 保存为文件
  xlsx.writeFile(workbook, fileName);
};
