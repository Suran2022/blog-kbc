import axios from 'axios';
import { ElMessage } from 'element-plus';

/**
 * 转换对象中的日期字段
 * @param {Object} obj - 需要处理的对象
 */
function convertDateFields(obj) {
  if (!obj || typeof obj !== 'object') return;
  
  // 日期字段名称列表
  const dateFields = ['createTime', 'updateTime', 'createdAt', 'updatedAt'];
  
  for (const key in obj) {
    // 如果是日期字段且值是字符串
    if (dateFields.includes(key) && typeof obj[key] === 'string') {
      // 将后端返回的日期字符串转换为前端日期对象
      try {
        const date = new Date(obj[key]);
        if (!isNaN(date.getTime())) {
          obj[key] = date.toISOString();
        }
      } catch (error) {
        console.warn(`转换日期字段 ${key} 失败:`, error);
      }
    } 
    // 递归处理嵌套对象
    else if (obj[key] && typeof obj[key] === 'object') {
      convertDateFields(obj[key]);
    }
  }
}

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取API基础URL
  timeout: 15000, // 请求超时时间
  // 重试配置
  retry: 2, // 重试次数
  retryDelay: 1500 // 重试间隔时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log('API响应数据:', res);
    
    // 检查后端返回的success字段
    if (res.success === false) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      });
      
      // 401: 未登录或token过期
      if (response.status === 401) {
        // 清除本地token和用户信息
        localStorage.removeItem('token');
        localStorage.removeItem('userInfo');
        
        // 重定向到登录页
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 1500);
      }
      
      return Promise.reject(new Error(res.message || '请求失败'));
    } else {
      // 处理日期字段
      if (res.data && typeof res.data === 'object') {
        // 如果是数组
        if (Array.isArray(res.data)) {
          res.data.forEach(item => {
            convertDateFields(item);
          });
        } 
        // 如果是分页数据
        else if (res.data.list && Array.isArray(res.data.list)) {
          res.data.list.forEach(item => {
            convertDateFields(item);
          });
        } 
        // 如果是单个对象
        else {
          convertDateFields(res.data);
        }
      }
      
      return res;
    }
  },
  error => {
    console.error('Response error:', error);
    let message = error.message || '请求失败';
    
    // 处理超时错误
    if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
      message = '请求超时，请检查网络连接';
      
      // 获取请求配置
      const config = error.config;
      // 设置重试计数器
      config.__retryCount = config.__retryCount || 0;
      
      // 检查是否超过重试次数
      if (config.__retryCount < config.retry) {
        // 增加重试计数
        config.__retryCount += 1;
        console.log(`请求超时，正在进行第 ${config.__retryCount} 次重试`);
        
        // 创建新的Promise来处理重试
        return new Promise((resolve) => {
          setTimeout(() => {
            console.log('重新发送请求...');
            resolve(service(config));
          }, config.retryDelay || 1500);
        });
      }
      
      // 如果是评论相关的请求，设置特殊的错误信息
      if (error.config.url.includes('/comments')) {
        message = '评论加载超时，请刷新页面重试';
      }
    }
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          message = '未授权，请重新登录';
          // 清除本地token和用户信息
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
          
          // 重定向到登录页
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1500);
          break;
        case 403:
          message = '拒绝访问';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = `请求失败: ${error.response.status}`;
      }
    } else if (error.request) {
      message = '服务器无响应，请检查网络连接';
    }
    
    // 对于评论相关的请求，不显示全局错误消息，由组件自行处理
    if (!error.config.url.includes('/comments')) {
      ElMessage({
        message: message,
        type: 'error',
        duration: 5 * 1000
      });
    } else {
      // 对于评论请求，将错误信息保存到error对象中，供组件使用
      error.customMessage = message;
    }
    
    return Promise.reject(error);
  }
);

export default service;