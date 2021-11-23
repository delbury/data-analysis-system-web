import { reactive, onMounted, watch, toRef, nextTick } from 'vue';
import { FetchersType } from '/@/service/tools';
import { ElMessage } from 'element-plus';

// 基本 table 的使用
interface TableResult {
  pageNumber: number;
  pageSize: number;
  list: any[];
  total: number;
  loadding: boolean;
  refresh: (params?: {}) => Promise<any>;
  delete: (id: string) => Promise<any>,
  create: (id: string) => Promise<any>,
}

// 初始设置
const INIT_PARAMS = {
  pageSize: 20,
  pageNumber: 1,
};
// 刷新表格节流
let willRefresh = false;
export const useTableFetcher = (fetchers: FetchersType) => {
  const table = reactive<TableResult>({
    pageSize: INIT_PARAMS.pageSize,
    pageNumber: INIT_PARAMS.pageNumber,
    list: [],
    total: 0,
    loadding: false,
    // 刷新表格，是否完全刷新
    refresh: async (params: {} = {}, reset = false) => {
      // 是否刷新到第一页
      if(reset && table.pageNumber !== INIT_PARAMS.pageNumber) {
        table.pageNumber = INIT_PARAMS.pageNumber;
        return;
      }
      try {
        table.loadding = true;
        const res = await fetchers.get({
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
    // 删除
    delete: async (id: string) => {
      try {
        table.loadding = true;
        await fetchers.delete(id);

        table.refresh();
        ElMessage.success('删除成功');
      } catch(e) {
        ElMessage.error('删除失败');
      } finally {
        table.loadding = false;
      }
    },
    // 新增
    create: async (data: any) => {
      try {
        table.loadding = true;
        await fetchers.post(data);

        table.refresh();
        ElMessage.success('新增成功');
      } catch(e) {
        ElMessage.error('新增失败');
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
