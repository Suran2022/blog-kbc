import { defineStore } from 'pinia';
import { ref } from 'vue';
import { login as loginApi, logout as logoutApi, getUserInfo as getUserInfoApi } from '../api/user';


export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '');
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'));
  
  // 计算属性
  const isLoggedIn = ref(!!token.value);
  const username = ref(userInfo.value.username || '');
  
  // 方法

  const login = async (credentials) => {
      try {
        const response = await loginApi(credentials);
        console.log('登录响应:', response);
        
        // 从响应中获取数据
        const { token: tokenValue, username: userName, nickname, avatar, email, id } = response.data;
        const userData = { id, username: userName, nickname, avatar, email };
        
        // 保存到状态
        token.value = tokenValue;
        userInfo.value = userData;
        isLoggedIn.value = true;
        username.value = userName || '';
        
        // 保存到本地存储
        localStorage.setItem('token', tokenValue);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        
        return Promise.resolve(response);
      } catch (error) {
        console.error('登录错误详情:', error);
        return Promise.reject(error);
      }
    }
    
  const logout = async () => {
      try {
        await logoutApi();
        
        // 清除状态
        token.value = '';
        userInfo.value = {};
        isLoggedIn.value = false;
        username.value = '';
        
        // 清除本地存储
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
  };
  
  // 获取用户信息
  const getUserInfo = async () => {
    if (!token.value) {
      throw new Error('未登录');
    }
    
    try {
      const response = await getUserInfoApi();
      userInfo.value = response.data;
      username.value = userInfo.value.username || '';
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value));
      return userInfo.value;
    } catch (error) {
      return Promise.reject(error);
    }
  };
  
  return {
    token,
    userInfo,
    isLoggedIn,
    username,
    login,
    logout,
    getUserInfo
  };
});