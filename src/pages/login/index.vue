<template>
  <div class="page page-login">
    <div class="login-form">
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
              @keypress.enter="handleLogin"
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
              @keypress.enter="handleLogin"
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

    <div class="icp">
      <a href="https://beian.miit.gov.cn/" target="_blank">浙ICP备2022002970号-1</a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { formRules } from '~/components/CompTable/DialogForm/form-rules';
import { FormInstance } from '~/components/CompTable/interface';
import { apis } from '~/service';
import { useStore } from '~/store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PageLogin',
  setup() {
    const form = reactive({
      account: '',
      password: '',
    });
    const logging = ref(false);
    const formRef = ref<FormInstance>();
    const store = useStore();
    const router = useRouter();

    // 登录
    const handleLogin = () => {
      formRef.value?.validate(async (isPass) => {
        if(isPass) {
          try {
            logging.value = true;
            const res = await apis.auth.postLogin({ ...form });
            if(res?.data.data) {
              store.commit('setUserInfo', res.data.data);
              router.push('/');
            }
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
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;

  .login-form {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;

    .login-wrapper {
      margin-top: -30vh;
    }

    .login-input {
      width: 250px;
    }

    .login-btns {
      display: flex;
      justify-content: flex-end;
    }
  }

  .icp {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    border-top: var(--el-border-base);
  }
}
</style>
