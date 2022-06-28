<template>
  <comp-dialog
    title="运维操作"
    readonly
    :dialog-props="{ width: '500px' }"
  >
    <el-button :loading="loadings.backup" @click="handleBackup">
      数据库备份
    </el-button>
  </comp-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { apis } from '~/service';

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const loadings = reactive({
      backup: false,
    });

    return {
      loadings,
      // 备份
      handleBackup: async () => {
        try {
          loadings.backup = true;
          window.open('/api/env/backup');
        } finally {
          loadings.backup = false;
        }
      },
    };
  },
});
</script>
