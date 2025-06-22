<script setup>
import { ref, onMounted } from 'vue';
import { useSettingStore } from '../../store/setting';
import SettingEditor from '../../components/admin/SettingEditor.vue';

const settingStore = useSettingStore();

// 设置数据
const settings = ref(null);
// 加载状态
const loading = ref(false);

// 获取设置
const fetchSettings = async () => {
  loading.value = true;
  try {
    await settingStore.fetchSettings();
    settings.value = { ...settingStore.settings };
  } catch (error) {
    console.error('获取系统设置失败:', error);
    ElMessage.error('获取系统设置失败');
  } finally {
    loading.value = false;
  }
};

// 处理保存成功
const handleSaveSuccess = () => {
  ElMessage.success('设置保存成功');
  fetchSettings();
};

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <div class="system-settings-container">
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
    </div>
    
    <el-skeleton :rows="10" animated v-if="loading" />
    
    <SettingEditor 
      v-else-if="settings"
      :settings="settings"
      @save-success="handleSaveSuccess"
    />
  </div>
</template>

<style scoped>
.system-settings-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0;
}
</style>