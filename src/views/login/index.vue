<script setup lang="ts">
  import Motion from "./utils/motion";
  import { useRouter } from "vue-router";
  import { message } from "@/utils/message";
  import { loginRules } from "./utils/rule";
  import { useNav } from "@/layout/hooks/useNav";
  import type { FormInstance } from "element-plus";
  import { useLayout } from "@/layout/hooks/useLayout";
  import { useUserStoreHook } from "@/store/modules/user";
  import { initRouter, getTopMenu } from "@/router/utils";
  import { bg, avatar, illustration } from "./utils/static";
  import { useRenderIcon } from "@/components/ReIcon/src/hooks";
  import { ref, reactive, toRaw, onMounted, onBeforeUnmount } from "vue";
  import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";
  import { getLogin } from "@/api/user";

  import dayIcon from "@/assets/svg/day.svg?component";
  import darkIcon from "@/assets/svg/dark.svg?component";
  import Lock from "@iconify-icons/ri/lock-fill";
  import User from "@iconify-icons/ri/user-3-fill";

  // 使用静态路由
  // https://yiming_chang.gitee.io/pure-admin-doc/pages/routerMenu/#%E5%A6%82%E4%BD%95%E5%8F%AA%E8%A6%81%E9%9D%99%E6%80%81%E8%B7%AF%E7%94%B1
  import { addPathMatch } from "@/router/utils";
  import { setToken, setToken1 } from "@/utils/auth";
  import { usePermissionStoreHook } from "@/store/modules/permission";


  defineOptions({
    name: "Login"
  });
  const router = useRouter();
  const loading = ref(false);
  const ruleFormRef = ref < FormInstance > ();

  const { initStorage } = useLayout();
  initStorage();

  const { dataTheme, dataThemeChange } = useDataThemeChange();
  dataThemeChange();
  const { title } = useNav();

  const ruleForm = reactive({
    username: "",
    password: ""
  });


  const onLogin = async (formEl: FormInstance | undefined) => {
    loading.value = true;
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
      if (valid) {
        //前端验证通过后，再后台验证
        getLogin(ruleForm).then(res=>{
          console.log("res is",res.data)
          if (res.data.isLogin == 'yes') {
            // localStorage.setItem('token', res.data.token);
            // 全部采取静态路由模式
            usePermissionStoreHook().handleWholeMenus([]);
            addPathMatch();
            setToken({
              username: ruleForm.username,
            } as any);
            setToken1(res.data.accessToken)
            router.push("/");
            message("登录成功", { type: "success" });
          }else{
            loading.value = false;
            message("请检查用户名或密码是否正确", { type: "error" });
            return fields;
          }
        })
      }else {
        loading.value = false;
        message("登录失败", { type: "error" });
        return fields;
      }
    
    });
  };

  /** 使用公共函数，避免`removeEventListener`失效 */
  function onkeypress({ code }: KeyboardEvent) {
    if (code === "Enter") {
      onLogin(ruleFormRef.value);
    }
  }

  onMounted(() => {
    window.document.addEventListener("keypress", onkeypress);
  });

  onBeforeUnmount(() => {
    window.document.removeEventListener("keypress", onkeypress);
  });
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <div class="flex-c absolute right-5 top-3">
      <!-- 主题 -->
      <el-switch v-model="dataTheme" inline-prompt :active-icon="dayIcon" :inactive-icon="darkIcon"
        @change="dataThemeChange" />
    </div>
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <avatar class="avatar" />
          <Motion>
            <h2 class="outline-none">{{ title }}</h2>
          </Motion>

          <el-form ref="ruleFormRef" :model="ruleForm" :rules="loginRules" size="large">
            <Motion :delay="100">
              <el-form-item :rules="[
                  {
                    required: true,
                    message: '请输入账号',
                    trigger: 'blur'
                  }
                ]" prop="username">
                <el-input clearable v-model="ruleForm.username" placeholder="账号" :prefix-icon="useRenderIcon(User)" />
              </el-form-item>
            </Motion>

            <Motion :delay="150">
              <el-form-item prop="password">
                <el-input clearable show-password v-model="ruleForm.password" placeholder="密码"
                  :prefix-icon="useRenderIcon(Lock)" />
              </el-form-item>
            </Motion>

            <Motion :delay="250">
              <el-button class="w-full mt-4" size="default" type="primary" :loading="loading"
                @click="onLogin(ruleFormRef)">
                登录
              </el-button>
            </Motion>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  @import url("@/style/login.css");
</style>

<style lang="scss" scoped>
  :deep(.el-input-group__append, .el-input-group__prepend) {
    padding: 0;
  }
</style>