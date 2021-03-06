import { markRaw, shallowReactive, onMounted, watch, toRef, nextTick, ref } from 'vue';
import { FetchersType } from '~/service/tools';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ColumnProps } from './interface';
import { saveFile } from './xlsx/export';
import { useStore } from '~/store';
import { computed } from 'vue';

// 获取 table 权限
export type PermissionType = { read?: boolean; write?: boolean; export?: boolean; import?: boolean; } | null;
export const usePermission = (dbTable?: string) => {
  const store = useStore();
  return computed((): PermissionType => {
    if(!dbTable) return null;
    const set = store.state.permissionsSet;
    const write = set.has('all') || set.has(dbTable);
    const read = set.has(`${dbTable}.read`) || write || set.has('all.read');
    // 默认有导出的权限
    const exp = true;
    // 默认只有管理员有权限
    const imp = set.has('all');

    return {
      read,
      write,
      export: exp,
      import: imp,
    };
  });
};


// 基本 table 的使用
interface TableResult {
  pageNumber: number;
  pageSize: number;
  list: any[];
  total: number;
  loading: boolean; // 获取table数据加载中
  fetching: boolean; // 获取详情加载中
  submitting: boolean; // 提交
  exporting: boolean; // 导出中
  order?: 'desc' | 'asc';
  orderBy?: string;
  searchParams?: {};
  refresh: (params?: {}, reset?: boolean) => Promise<any>;
  delete: (id: string) => Promise<any>,
  create: (id: string) => Promise<any>,
  detail: (id: string) => Promise<any>,
  update: (id: string, data: any) => Promise<any>,
  export: () => void;
}

// 初始设置
const INIT_PARAMS = {
  pageSize: 10,
  pageNumber: 1,
};
// 获取有自定义渲染配置的列
const getColumnRenderMap = (columns?: ColumnProps[]) => {
  if(!columns) return null;

  const temp: Record<string, ColumnProps> = {};
  // 递归
  const walk = (cols?: ColumnProps[]) => {
    if(!cols) return;
    cols.forEach(col => {
      if(col.formatMap && col.prop) {
        temp[col.prop] = col;
      }
      walk(col.subColumns);
    });
  };
  walk(columns);
  return Object.keys(temp).length ? temp : null;
};

// hook
type HookConfig = { columns: ColumnProps[]; tableName?: string };
export const useTableFetcher = (fetchers: FetchersType, config: HookConfig) => {
  const { columns, tableName } = config;
  // 刷新表格节流
  const willRefresh = ref(false);

  // 列渲染配置
  const columnRenderMap = getColumnRenderMap(columns);

  // 获取数据
  const fetch = async (params?: {}) => {
    return (await fetchers.get({
      pageSize: table.pageSize,
      pageNumber: table.pageNumber,
      order: table.order,
      orderBy: table.orderBy,
      ...(params ?? {}),
      ...(table.searchParams ?? {}),
    })).data.data;
  };

  const table = shallowReactive<TableResult>({
    pageSize: INIT_PARAMS.pageSize,
    pageNumber: INIT_PARAMS.pageNumber,
    list: [],
    total: 0,
    loading: false,
    fetching: false,
    exporting: false,
    submitting: false,
    orderBy: void 0,
    order: void 0,
    searchParams: void 0,
    // 刷新表格，是否完全刷新
    refresh: markRaw(async (params?: {}, reset?: boolean) => {
      // 是否刷新到第一页
      if((reset || params) && table.pageNumber !== INIT_PARAMS.pageNumber) {
        table.pageNumber = INIT_PARAMS.pageNumber;
        return;
      }
      try {
        table.loading = true;
        const res = await fetch(params);
        table.list = res.list;
        table.total = res.total;
      } finally {
        table.loading = false;
      }
    }),
    // 删除
    delete: markRaw(async (id: string) => {
      try {
        table.submitting = true;
        const res = await fetchers.delete(id);
        table.refresh();
        ElMessage.success('删除成功');
        return res;
      } finally {
        table.submitting = false;
      }
    }),
    // 新增
    create: markRaw(async (data: any) => {
      try {
        table.submitting = true;
        const res = await fetchers.post(data);
        table.refresh();
        return res;
      } finally {
        table.submitting = false;
      }
    }),
    // 详情
    detail: markRaw(async (id: string) => {
      try {
        table.fetching = true;
        const res = await fetchers.getById(id);
        return res.data.data;
      } finally {
        table.fetching = false;
      }
    }),
    // 修改
    update: markRaw(async (id: string, data: any) => {
      try {
        table.submitting = true;
        const res = await fetchers.put(id, data);
        table.refresh();
        return res;
      } finally {
        table.submitting = false;
      }
    }),
    // 导出
    export: markRaw(() => {
      ElMessageBox.confirm(
        '确认导出？（将会根据筛选条件导出所有数据）',
        '导出',
        {
          type: 'warning',
          callback: async(action) => {
            if(action !== 'confirm') return;
            // 导出
            try {
              table.exporting = true;
              const list = (await fetch()).list as Record<string, string>[];

              // 数据处理，自定义渲染
              if(columnRenderMap) {
                list.forEach((item) => {
                  Object.entries(item).forEach(([key, val]) => {
                    const config = columnRenderMap[key];
                    if(!config) return;

                    if(config.formatMap) {
                      const v = config.formatMap[val];
                      item[key] = typeof v === 'string' ? v : v.text;
                    }
                  });
                });
              }
              // 保存文件
              await saveFile(list, columns, tableName);
            } finally {
              table.exporting = false;
            }
          },
        },
      );
    }),
  });

  // 挂载时请求一次
  onMounted(() => {
    table.refresh();
  });

  const ps = toRef(table, 'pageSize');
  const pn = toRef(table, 'pageNumber');
  // 监听页数和每页条数
  watch([ps, pn], (vals, olds) => {
    if(!willRefresh.value) {
      willRefresh.value = true;
      nextTick(() => {
        console.log('watch');
        table.refresh();
        willRefresh.value = false;
      });
    }
  });

  return table;
};
