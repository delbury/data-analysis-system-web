<template>
  <SubLayout :subs="subs"></SubLayout>
</template>

<script lang="ts">
import { defineComponent, reactive, shallowRef } from 'vue';
import { User, OfficeBuilding } from '@element-plus/icons';
import SubLayout from '~/pages/layout/SubLayout.vue';
import { SubMenuOption } from '~/pages/layout/interface';


export default defineComponent({
  name: 'PageBasedata',
  components: { SubLayout },
  setup() {
    const subs = reactive<SubMenuOption[]>([
      { label: '人员管理', path: '/basedata/staff', icon: shallowRef(User) },
      { label: '班组管理', path: '/basedata/teamgroup', icon: shallowRef(OfficeBuilding) },
    ]);

    return {
      subs,
    };
  },
});
</script>
