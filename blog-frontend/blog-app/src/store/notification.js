import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟通知数据
let mockNotifications = [
  {
    id: '1',
    title: '系统更新通知',
    content: '博客系统已更新到最新版本，新增了多项功能和优化。',
    type: 'info', // info, success, warning, error
    isRead: false,
    createdAt: new Date(Date.now() - 86400000).toISOString() // 1天前
  },
  {
    id: '2',
    title: '评论审核提醒',
    content: '您有5条新评论待审核，请及时处理。',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2天前
  },
  {
    id: '3',
    title: '文章发布成功',
    content: '您的文章《Vue3最佳实践》已成功发布。',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3天前
  },
  {
    id: '4',
    title: '系统错误',
    content: '文件上传服务暂时不可用，技术团队正在处理中。',
    type: 'error',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString() // 4天前
  },
  {
    id: '5',
    title: '账户安全提醒',
    content: '检测到您的账户在新设备上登录，如非本人操作，请立即修改密码。',
    type: 'warning',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5天前
  }
];

// 模拟API
const getNotifications = async () => {
  await delay(800);
  
  return { data: mockNotifications };
};

const getUnreadCount = async () => {
  await delay(300);
  
  const unreadCount = mockNotifications.filter(item => !item.isRead).length;
  return { data: unreadCount };
};

const markAsRead = async (id) => {
  await delay(500);
  
  const notification = mockNotifications.find(item => item.id === id);
  if (notification) {
    notification.isRead = true;
  }
  
  return { success: true };
};

const markAllAsRead = async () => {
  await delay(500);
  
  mockNotifications.forEach(item => {
    item.isRead = true;
  });
  
  return { success: true };
};

const deleteNotification = async (id) => {
  await delay(500);
  
  const index = mockNotifications.findIndex(item => item.id === id);
  if (index !== -1) {
    mockNotifications.splice(index, 1);
  }
  
  return { success: true };
};

const clearAllNotifications = async () => {
  await delay(500);
  
  mockNotifications = [];
  
  return { success: true };
};

// 创建新通知（仅用于模拟）
const createNotification = async (notification) => {
  await delay(500);
  
  const newNotification = {
    id: String(Date.now()),
    isRead: false,
    createdAt: new Date().toISOString(),
    ...notification
  };
  
  mockNotifications.unshift(newNotification);
  
  return { data: newNotification };
};

// 定义通知Store
export const useNotificationStore = defineStore('notification', () => {
  // 状态
  const notifications = ref([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  const error = ref(null);
  
  // 获取所有通知
  const fetchNotifications = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getNotifications();
      notifications.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取通知失败';
      console.error('获取通知失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取未读通知数量
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      unreadCount.value = response.data;
      return response.data;
    } catch (err) {
      console.error('获取未读通知数量失败:', err);
      throw err;
    }
  };
  
  // 标记通知为已读
  const markNotificationAsRead = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await markAsRead(id);
      
      // 更新本地状态
      const notification = notifications.value.find(item => item.id === id);
      if (notification) {
        notification.isRead = true;
      }
      
      // 更新未读数量
      await fetchUnreadCount();
    } catch (err) {
      error.value = err.message || '标记通知已读失败';
      console.error('标记通知已读失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 标记所有通知为已读
  const markAllNotificationsAsRead = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await markAllAsRead();
      
      // 更新本地状态
      notifications.value.forEach(item => {
        item.isRead = true;
      });
      
      // 更新未读数量
      unreadCount.value = 0;
    } catch (err) {
      error.value = err.message || '标记所有通知已读失败';
      console.error('标记所有通知已读失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 删除通知
  const removeNotification = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await deleteNotification(id);
      
      // 更新本地状态
      const index = notifications.value.findIndex(item => item.id === id);
      if (index !== -1) {
        const wasUnread = !notifications.value[index].isRead;
        notifications.value.splice(index, 1);
        
        // 如果删除的是未读通知，更新未读数量
        if (wasUnread) {
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
    } catch (err) {
      error.value = err.message || '删除通知失败';
      console.error('删除通知失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 清空所有通知
  const clearNotifications = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await clearAllNotifications();
      
      // 更新本地状态
      notifications.value = [];
      unreadCount.value = 0;
    } catch (err) {
      error.value = err.message || '清空通知失败';
      console.error('清空通知失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 添加新通知（仅用于模拟）
  const addNotification = async (notification) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createNotification(notification);
      
      // 更新本地状态
      notifications.value.unshift(response.data);
      unreadCount.value += 1;
      
      return response.data;
    } catch (err) {
      error.value = err.message || '添加通知失败';
      console.error('添加通知失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    // 状态
    notifications,
    unreadCount,
    loading,
    error,
    
    // 操作
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    removeNotification,
    clearNotifications,
    addNotification
  };
});