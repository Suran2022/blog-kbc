import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { getSettings, updateSettings } from '../api/setting';

export const useSettingStore = defineStore('setting', () => {
  // 状态
  const settings = ref({});
  const loading = ref(false);
  const error = ref(null);
  
  // 计算属性

  const siteName = computed(() => settings.value.siteName || '博客系统');
  const siteDescription = computed(() => settings.value.siteDescription || '');
  const siteKeywords = computed(() => settings.value.siteKeywords || '');
  const siteFooter = computed(() => settings.value.footerInfo || '© 2024 博客系统 All Rights Reserved.');
  const siteLogo = computed(() => settings.value.siteLogo || '');
  const allowComments = computed(() => settings.value.allowComments !== false);
  const commentAudit = computed(() => settings.value.commentAudit !== false);
  
  // 方法

  const fetchSettings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getSettings();
      settings.value = response.data;
      
      // 更新页面标题和图标
      updatePageInfo();
      
      return response;
    } catch (err) {
      error.value = err.message || '获取设置失败';
      console.warn('无法连接到后端API，使用默认设置');
      // 不抛出错误，让应用继续使用默认值
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const updateSettingsData = async (settingsData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await updateSettings(settingsData);
      settings.value = response.data;
      
      // 更新页面标题和图标
      updatePageInfo();
      
      return response;
    } catch (err) {
      error.value = err.message || '更新设置失败';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 更新页面标题和图标
  const updatePageInfo = () => {
    // 开发环境下显示调试信息
    if (import.meta.env.DEV) {
      console.log('updatePageInfo被调用');
      console.log('当前siteName:', siteName.value);
      console.log('当前siteLogo:', siteLogo.value);
    }
    
    // 更新页面标题
    const currentTitle = document.title;
    const titleParts = currentTitle.split(' - ');
    if (titleParts.length > 1) {
      // 保持当前页面标题，只更新网站名称部分
      document.title = `${titleParts[0]} - ${siteName.value}`;
    } else {
      // 如果没有页面标题，直接使用网站名称
      document.title = siteName.value;
    }
    
    // 更新网站图标
    if (siteLogo.value) {
      if (import.meta.env.DEV) {
        console.log('准备更新favicon，URL:', siteLogo.value);
      }
      updateFavicon(siteLogo.value);
    } else if (import.meta.env.DEV) {
      console.log('siteLogo为空，跳过favicon更新');
    }
  };
  
  // 更新favicon的专用方法
  const updateFavicon = (iconUrl) => {
    if (import.meta.env.DEV) {
      console.log('开始更新favicon:', iconUrl);
    }
    
    try {
      // 移除现有的favicon
      const existingFavicons = document.querySelectorAll('link[rel*="icon"]');
      if (import.meta.env.DEV) {
        console.log('找到现有favicon数量:', existingFavicons.length);
      }
      existingFavicons.forEach(link => {
        if (import.meta.env.DEV) {
          console.log('移除favicon:', link.href);
        }
        link.remove();
      });
      
      // 添加强时间戳防止缓存
      const timestamp = new Date().getTime();
      const randomId = Math.random().toString(36).substr(2, 9);
      const finalUrl = iconUrl.includes('?') 
        ? `${iconUrl}&t=${timestamp}&r=${randomId}` 
        : `${iconUrl}?t=${timestamp}&r=${randomId}`;
      
      if (import.meta.env.DEV) {
        console.log('设置新favicon URL:', finalUrl);
      }
      
      // 创建多种类型的favicon链接以确保兼容性
      const faviconTypes = [
        { rel: 'icon', type: 'image/x-icon' },
        { rel: 'shortcut icon', type: 'image/x-icon' },
        { rel: 'icon', type: 'image/png' },
        { rel: 'apple-touch-icon', type: 'image/png' }
      ];
      
      faviconTypes.forEach((faviconType, index) => {
        const newFavicon = document.createElement('link');
        newFavicon.id = `favicon-${index}`;
        newFavicon.rel = faviconType.rel;
        newFavicon.type = faviconType.type;
        newFavicon.href = finalUrl;
        
        // 添加错误处理
        newFavicon.onerror = () => {
          if (import.meta.env.DEV) {
            console.error(`Favicon加载失败 (${faviconType.rel}):`, finalUrl);
          }
        };
        
        newFavicon.onload = () => {
          if (import.meta.env.DEV) {
            console.log(`Favicon加载成功 (${faviconType.rel}):`, finalUrl);
          }
        };
        
        document.head.appendChild(newFavicon);
      });
      
      if (import.meta.env.DEV) {
        console.log('所有Favicon已添加到head');
      }
      
      // 强制刷新页面标题来触发浏览器重新检查favicon
      const originalTitle = document.title;
      document.title = originalTitle + ' ';
      setTimeout(() => {
        document.title = originalTitle;
        if (import.meta.env.DEV) {
          console.log('页面标题刷新完成');
        }
      }, 100);
      
      // 创建一个隐藏的iframe来强制刷新favicon缓存
      setTimeout(() => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = finalUrl;
        document.body.appendChild(iframe);
        
        setTimeout(() => {
          iframe.remove();
          if (import.meta.env.DEV) {
            console.log('iframe缓存刷新完成');
          }
        }, 500);
      }, 200);
      
      // 最后的强制刷新方法 - 修改所有favicon的href
      setTimeout(() => {
        const allFavicons = document.querySelectorAll('link[rel*="icon"]');
        allFavicons.forEach(link => {
          const href = link.href;
          link.href = '';
          setTimeout(() => {
            link.href = href;
          }, 10);
        });
        if (import.meta.env.DEV) {
          console.log('所有Favicon强制刷新完成');
        }
      }, 300);
      
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('更新favicon时发生错误:', error);
      }
    }
  };
  
  return {
    settings,
    loading,
    error,
    siteName,
    siteDescription,
    siteKeywords,
    siteFooter,
    siteLogo,
    allowComments,
    commentAudit,
    fetchSettings,
    updateSettings: updateSettingsData,
    updatePageInfo
  };
});