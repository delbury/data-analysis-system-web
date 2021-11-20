import { reactive, onMounted, watch, toRef, nextTick } from 'vue';
import { FetcherType } from '/@/service/tools';

// 基本 table 的使用
interface TableResult {
  pageNumber: number;
  pageSize: number;
  list: any[];
  total: number;
  loadding: boolean;
  refresh: () => Promise<any>;
}
// 刷新表格节流
let willRefresh = false;
export const useTableFetcher = (fetcher: FetcherType) => {
  const table = reactive<TableResult>({
    pageSize: 20,
    pageNumber: 1,
    list: [],
    total: 0,
    loadding: false,
    refresh: async (params: {} = {}) => {
      try {
        table.loadding = true;
        const res = await fetcher({
          params: {
            pageSize: table.pageSize,
            pageNumber: table.pageNumber,
            ...params,
          },
        });
        table.list.length = 0;
        table.list.push(...res.data.data.list);
        table.total = res.data.data.total;
      } finally {
        table.loadding = false;
      }
    },
  });

  // 挂载时请求一次
  onMounted(() => {
    table.refresh();
  });

  const ps = toRef(table, 'pageSize');
  const pn = toRef(table, 'pageNumber');
  // 监听页数和每页条数
  watch([ps, pn], (vals, olds) => {
    if(!willRefresh) {
      willRefresh = true;
      nextTick(() => {
        table.refresh();
        willRefresh = false;
      });
    }
  });

  return table;
};
