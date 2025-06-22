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
  timeout: 15000 // 请求超时时间
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
    
    // 如果返回的状态码不是200，说明接口请求有误
    if (res.code !== 200) {
      ElMessage({
        message: res.message || '请求失败',
        type: 'error',
        duration: 5 * 1000
      });
      
      // 401: 未登录或token过期
      if (res.code === 401) {
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
      message = '服务器无响应';
    }
    
    ElMessage({
      message: message,
      type: 'error',
      duration: 5 * 1000
    });
    
    return Promise.reject(error);
  }
);

export default service;