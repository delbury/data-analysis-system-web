<template>
  <comp-dialog
    :model-value="value"
    title="账号信息"
    :dialog-props="{ width: '400px' }"
    :submit-action="submitAction"
  >
    <el-form
      ref="formRef"
      :model="form"
      label-width="90px"
    >
      <el-form-item label="账号">
        <el-input
          :model-value="userInfo?.account ?? '-'"
          readonly
        ></el-input>
      </el-form-item>

      <el-form-item
        label="旧密码"
        prop="oldPassword"
        :rules="formRules.required"
      >
        <el-input
          v-model="form.oldPassword"
          type="password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item
        label="新密码"
        prop="newPassword"
        :rules="[formRules.required, formRules.normalLength]"
      >
        <el-input
          v-model="form.newPassword"
          type="password"
          show-password
        ></el-input>
      </el-form-item>

      <el-form-item
        label="新密码确认"
        prop="newPasswordCheck"
        :rules="[formRules.required, formRules.normalLength, doubleCheckRule]"
      >
        <el-input
          v-model="form.newPasswordCheck"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
    </el-form>
  </comp-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, PropType } from 'vue';
import { AccountTable } from '~types/db-table-type/Account';
import { FormInstance, FormItemRule } from '~/components/CompTable/interface';
import { formRules } from '~/components/CompTable/DialogForm/form-rules';
import { apis } from '~/service';

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
    const form = reactive({
      oldPassword: '',
      newPassword: '',
      newPasswordCheck: '',
    });
    const formRef = ref<FormInstance>();

    const doubleCheckRule: FormItemRule = {
      validator: (r, val, cb) => {
        if(val !== form.newPassword) {
          return cb('两次输入的新密码不相同');
        }
        return cb();
      },
    };

    return {
      form,
      formRef,
      formRules,
      submitAction: async () => {
        try {
          const res = await formRef.value?.validate();
          await apis.auth.putModifyPassword({ ...form });
        } catch(e) {
          return false;
        }
      },
      doubleCheckRule,
    };
  },
});
</script>
