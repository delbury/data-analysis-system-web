<template>
  <CompDialog title="编辑录入参训人员">
    <CompLocalTable></CompLocalTable>
  </CompDialog>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { apis } from '~/service';

export default defineComponent({
  setup() {
    onMounted(async () => {
      const res = await apis.basedata_staff.getAllList();
    });
  },
});
</script>
