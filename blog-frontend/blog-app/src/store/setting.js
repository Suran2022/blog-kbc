import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟设置数据
let mockSettings = {
  siteName: '我的博客',
  siteDescription: '分享技术和生活的个人博客',
  siteKeywords: '博客,技术,生活,编程,Vue,JavaScript',
  siteFooter: '© 2023 我的博客 版权所有',
  siteIcp: '粤ICP备XXXXXXXX号',
  siteLogo: 'https://example.com/logo.png',
  contactEmail: 'admin@example.com',
  allowComments: true,
  commentAudit: true
};

// 模拟API
const getSettings = async () => {
  await delay(600);
  return { data: { ...mockSettings } };
};

const updateSettings = async (settingsData) => {
  await delay(800);
  
  // 更新模拟数据
  mockSettings = {
    ...mockSettings,
    ...settingsData
  };
  
  return { data: { ...mockSettings } };
};

export const useSettingStore = defineStore('setting', () => {
  // 状态
  const settings = ref({});
  const loading = ref(false);
  const error = ref(null);
  
  // 计算属性

  const siteName = computed(() => settings.value.siteName || '博客系统');
  const siteDescription = computed(() => settings.value.siteDescription || '');
  const siteKeywords = computed(() => settings.value.siteKeywords || '');
  const siteFooter = computed(() => settings.value.siteFooter || '');
  const siteLogo = computed(() => settings.value.siteLogo || '');
  
  // 方法

  const fetchSettings = async () => {
    loading.value = true;
      try {
        const response = await getSettings();
        settings.value = response.data;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
  
  const updateSettings = async (settingsData) => {
    loading.value = true;
      try {
        const response = await updateSettings(settingsData);
        settings.value = response.data;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
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
    fetchSettings,
    updateSettings
  };
});