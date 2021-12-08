<template>
  <div class="page page-login">
    <el-card
      header="登录"
      shadow="hover"
      class="login-wrapper"
    >
      <el-form
        ref="formRef"
        :model="form"
      >
        <el-form-item
          label="账号"
          prop="account"
          :rules="formRules.required"
        >
          <el-input
            v-model="form.account"
            class="login-input"
            placeholder="请输入账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          :rules="formRules.required"
        >
          <el-input
            v-model="form.password"
            class="login-input"
            placeholder="请输入密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>

        <el-row class="login-btns">
          <el-button
            type="primary"
            :loading="logging"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { formRules } from '/@/components/CompTable/form-rules';
import { FormInstance } from '/@/components/CompTable/interface';
import { apis } from '/@/service';

export default defineComponent({
  name: 'PageLogin',
  setup() {
    const form = reactive({
      account: '',
      password: '',
    });
    const logging = ref(false);
    const formRef = ref<FormInstance>();

    // 登录
    const handleLogin = () => {
      formRef.value?.validate(async (isPass) => {
        if(isPass) {
          try {
            logging.value = true;
            const res = await apis.auth.postLogin({ ...form });
          } finally {
            logging.value = false;
          }
        }
      });
    };

    return {
      formRef,
      form,
      formRules,
      logging,
      handleLogin,
    };
  },
});
</script>

<style lang="scss" scoped>
.page-login {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .login-wrapper {
    margin-top: -30vh;

    .el-form-item {
      padding-right: 0;
    }
  }

  .login-input {
    width: 250px;
  }

  .login-btns {
    display: flex;
    justify-content: flex-end;
  }
}

</style>
