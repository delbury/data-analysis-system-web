<template>
  <comp-dialog
    :model-value="value"
    title="账号信息"
    :dialog-props="{ width: '400px' }"
    readonly
  >
    <el-form>
      <el-form-item label="名称">
        <el-input
          :model-value="userInfo?.name ?? '-'"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="账号">
        <el-input
          :model-value="userInfo?.account ?? '-'"
          readonly
        ></el-input>
      </el-form-item>
      <el-form-item label="角色">
        <template
          v-for="role in roles"
          :key="role.id"
        >
          <el-tag>{{ role.name }}</el-tag>
        </template>
      </el-form-item>
    </el-form>
  </comp-dialog>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import { AccountTable } from '~types/db-table-type/Account';

export default defineComponent({
  props: {
    userInfo: {
      type: Object as PropType<Partial<AccountTable> | null>,
      default: null,
    },
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return {
      roles: computed(() => props.userInfo?.roles ?? []),
    };
  },
});
</script>
