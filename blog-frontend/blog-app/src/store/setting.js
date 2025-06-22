import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
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
  const siteFooter = computed(() => settings.value.siteFooter || '');
  const siteLogo = computed(() => settings.value.siteLogo || '');
  
  // 方法

  const fetchSettings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getSettings();
      settings.value = response.data;
      return response;
    } catch (err) {
      error.value = err.message || '获取设置失败';
      throw err;
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
      return response;
    } catch (err) {
      error.value = err.message || '更新设置失败';
      throw err;
    } finally {
      loading.value = false;
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
    updateSettings: updateSettingsData
  };
});