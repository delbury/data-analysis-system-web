<template>
  <SubLayout :subs="subs"></SubLayout>
</template>

<script lang="ts">
import { defineComponent, reactive, shallowRef } from 'vue';
import { SetUp, Key, Open } from '@element-plus/icons';
import SubLayout from '~/pages/layout/SubLayout.vue';
import { SubMenuOption } from '~/pages/layout/interface';


export default defineComponent({
  name: 'PageSystem',
  components: { SubLayout },
  setup() {
    const subs = reactive<SubMenuOption[]>([
      { label: '权限管理', path: '/system/permission', icon: shallowRef(Open) },
      { label: '角色管理', path: '/system/role', icon: shallowRef(SetUp) },
      { label: '账号管理', path: '/system/account', icon: shallowRef(Key) },
    ]);

    return {
      subs,
    };
  },
});
</script>
