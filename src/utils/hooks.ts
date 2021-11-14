import { ref, reactive, onMounted } from 'vue';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ResponseList } from '/@types/Server';

export const useTableFetcher = (fetcher: (...arg: any) => Promise<AxiosResponse<ResponseList>>) => {
  const data = reactive<any>([]);
  const loadding = ref(false);
  const wrapperFetcher = async (...arg: any) => {
    try {
      loadding.value = true;
      const res = await fetcher(...arg);
      data.length = 0;
      data.push(...res.data.data.list);
    } finally {
      loadding.value = false;
    }
  };

  // 挂载时请求一次
  onMounted(() => {
    wrapperFetcher();
  });

  return {
    data,
    loadding,
    fetcher: wrapperFetcher,
  };
};
