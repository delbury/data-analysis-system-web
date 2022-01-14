/**
 * excel 导入
 */

import xlsx from 'xlsx';

// 解析工作表
const resolveSheet = (workbook: xlsx.WorkBook, sheetName: string) => {
  const sheet = workbook.Sheets[sheetName];
  // 表头行
  const range = xlsx.utils.decode_range(sheet['!ref'] ?? '');
  const header = Array.from({ length: range.e.c - range.s.c + 1 }, (v, k) => xlsx.utils.encode_col(k));

  // 数据行
  const data = xlsx.utils.sheet_to_json(sheet, { header: 'A' }) as Record<string, string>[];

  // 处理合并单元格
  const mergesMap = new Map<string, { colkey: string, rowindex: number, rowspan: number; colspan: number; }>();
  sheet['!merges']?.forEach(rg => {
    // hash：列 key，行 index
    const colkey = xlsx.utils.encode_col(rg.s.c);

    // 合并的单元格
    mergesMap.set(`${colkey},${rg.s.r}`, {
      colkey,
      rowindex: rg.s.r,
      // 行合并数
      rowspan: rg.e.r - rg.s.r + 1,
      // 列合并数
      colspan: rg.e.c - rg.s.c + 1,
    });

    // 移除的单元格
    for(let col = rg.s.c; col <= rg.e.c; col++) {
      for(let row = rg.s.r; row <= rg.e.r; row++) {
        // 跳过当前单元格
        if(col === rg.s.c && row === rg.s.r) continue;

        const ck = xlsx.utils.encode_col(col);
        mergesMap.set(`${ck},${row}`, {
          colkey: ck,
          rowindex: row,
          rowspan: 0,
          colspan: 0,
        });
      }
    }
  }) ?? null;

  return {
    name: sheetName,
    header,
    data,
    mergesMap,
  };
};

// 解析文件
export const resolveFile = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();
  const workbook = xlsx.read(fileBuffer, {});
  const tables = workbook.SheetNames.map(name => resolveSheet(workbook, name));
  return tables;
};

export type ResolvedTable = ReturnType<typeof resolveSheet>;
