import { reactive, onMounted, watch, toRef, nextTick, ref } from 'vue';
import { FetchersType } from '/@/service/tools';
import { ElMessage } from 'element-plus';

// 基本 table 的使用
interface TableResult {
  pageNumber: number;
  pageSize: number;
  list: any[];
  total: number;
  loadding: boolean; // 获取table数据加载中
  fetching: boolean; // 获取详情加载中
  submitting: boolean; // 提交
  refresh: (params?: {}) => Promise<any>;
  delete: (id: string) => Promise<any>,
  create: (id: string) => Promise<any>,
  detail: (id: string) => Promise<any>,
  update: (id: string, data: any) => Promise<any>,
}

// 初始设置
const INIT_PARAMS = {
  pageSize: 20,
  pageNumber: 1,
};
// 刷新表格节流
// let willRefresh = false;
export const useTableFetcher = (fetchers: FetchersType) => {
  // 刷新表格节流
  const willRefresh = ref(false);

  const table = reactive<TableResult>({
    pageSize: INIT_PARAMS.pageSize,
    pageNumber: INIT_PARAMS.pageNumber,
    list: [],
    total: 0,
    loadding: false,
    fetching: false,
    submitting: false,
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
          pageSize: table.pageSize,
          pageNumber: table.pageNumber,
          ...params,
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
        table.submitting = true;
        const res = await fetchers.delete(id);
        table.refresh();
        ElMessage.success('删除成功');
        return res;
      } finally {
        table.submitting = false;
      }
    },
    // 新增
    create: async (data: any) => {
      try {
        table.submitting = true;
        const res = await fetchers.post(data);
        table.refresh();
        return res;
      } finally {
        table.submitting = false;
      }
    },
    // 详情
    detail: async (id: string) => {
      try {
        table.fetching = true;
        const res = await fetchers.getById(id);
        return res.data.data;
      } finally {
        table.fetching = false;
      }
    },
    // 修改
    update: async (id: string, data: any) => {
      try {
        table.submitting = true;
        const res = await fetchers.put(id, data);
        table.refresh();
        return res;
      } finally {
        table.submitting = false;
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
