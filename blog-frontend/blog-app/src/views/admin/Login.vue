<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/user';
import { ElMessage } from 'element-plus';

const router = useRouter();
const userStore = useUserStore();

// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
});

// 表单规则
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

// 表单引用
const formRef = ref(null);
// 加载状态
const loading = ref(false);
// 记住我
const rememberMe = ref(false);

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    loading.value = true;
    try {
      await userStore.login({
        username: loginForm.username,
        password: loginForm.password,
        remember: rememberMe.value
      });
      
      // 登录成功，跳转到后台首页
      router.push({ name: 'Dashboard' });
    } catch (error) {
      console.error('登录失败:', error);
      ElMessage.error('登录失败，请检查用户名和密码');
    } finally {
      loading.value = false;
    }
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2 class="login-title">博客后台管理</h2>
      </div>
      
      <el-form
        ref="formRef"
        :model="loginForm"
        :rules="rules"
        label-position="top"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            prefix-icon="User"
          />
        </el-form-item>
        
        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        
        <div class="remember-me">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </div>
        
        <el-form-item>
          <el-button 
            type="primary" 
            class="login-button" 
            @click="handleLogin"
            :loading="loading"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-footer">
        <el-button type="primary" link @click="router.push({ name: 'Home' })">
          返回博客首页
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
}

.login-box {
  width: 400px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-title {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.remember-me {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
  padding: 12px 0;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
}

@media (max-width: 480px) {
  .login-box {
    width: 90%;
    padding: 20px;
  }
}
</style>