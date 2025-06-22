<script setup>
import { ref, onMounted } from 'vue';
import { useSettingStore } from '../../store/setting';
import { uploadImage } from '../../api/upload';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['save-success']);

const settingStore = useSettingStore();

// 表单数据
const settingForm = ref({
  siteName: '',
  siteDescription: '',
  siteKeywords: '',
  footerInfo: '',
  siteLogo: '',
  siteIcp: '',
  siteEmail: '',
  allowComments: true,
  commentAudit: true
});

// 表单规则
const rules = {
  siteName: [{ required: true, message: '请输入网站名称', trigger: 'blur' }],
  siteEmail: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
};

// 表单引用
const formRef = ref(null);

// 加载状态
const loading = ref(false);
// 保存状态
const saving = ref(false);

// 获取设置
const fetchSettings = async () => {
  loading.value = true;
  try {
    await settingStore.fetchSettings();
    const settings = settingStore.settings;
    
    if (settings) {
      settingForm.value = {
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        siteKeywords: settings.siteKeywords || '',
        footerInfo: settings.footerInfo || '',
        siteLogo: settings.siteLogo || '',
        siteIcp: settings.siteIcp || '',
        siteEmail: settings.siteEmail || '',
        allowComments: settings.allowComments !== false,
        commentAudit: settings.commentAudit !== false
      };
    }
  } catch (error) {
    console.error('获取网站设置失败:', error);
    ElMessage.error('获取网站设置失败');
  } finally {
    loading.value = false;
  }
};

// 上传Logo
const handleLogoUpload = async (file) => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPG、PNG、GIF、WebP 格式的图片');
    return false;
  }
  
  // 检查文件大小（限制为2MB）
  const maxSize = 2 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error('图片大小不能超过2MB');
    return false;
  }
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await uploadImage(formData);
    if (response.code === 200) {
      settingForm.value.siteLogo = response.data;
      ElMessage.success('Logo上传成功');
    } else {
      ElMessage.error(response.message || 'Logo上传失败');
    }
  } catch (error) {
    console.error('Logo上传失败:', error);
    ElMessage.error('Logo上传失败，请稍后重试');
  }
  
  return false; // 阻止默认上传行为
};

// 移除Logo
const handleRemoveLogo = () => {
  settingForm.value.siteLogo = '';
};

// 保存设置
const saveSettings = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    saving.value = true;
    try {
      const settingData = { ...settingForm.value };
      await settingStore.updateSettings(settingData);
      ElMessage.success('网站设置更新成功');
      emit('save-success');
    } catch (error) {
      console.error('保存网站设置失败:', error);
      ElMessage.error('保存网站设置失败，请稍后重试');
    } finally {
      saving.value = false;
    }
  });
};

onMounted(() => {
  fetchSettings();
});
</script>

<template>
  <div class="setting-editor">
    <div class="editor-header">
      <h2>网站设置</h2>
    </div>
    
    <el-skeleton :rows="8" animated v-if="loading" />
    
    <el-form
      v-else
      ref="formRef"
      :model="settingForm"
      :rules="rules"
      label-position="top"
    >
      <el-tabs>
        <el-tab-pane label="基本设置">
          <el-form-item label="网站名称" prop="siteName">
            <el-input v-model="settingForm.siteName" placeholder="请输入网站名称" />
          </el-form-item>
          
          <el-form-item label="网站描述">
            <el-input
              v-model="settingForm.siteDescription"
              type="textarea"
              :rows="2"
              placeholder="请输入网站描述"
            />
          </el-form-item>
          
          <el-form-item label="网站关键词">
            <el-input
              v-model="settingForm.siteKeywords"
              placeholder="请输入网站关键词，多个关键词用逗号分隔"
            />
          </el-form-item>
          
          <el-form-item label="网站Logo">
            <el-upload
              class="logo-uploader"
              action="#"
              :show-file-list="false"
              :before-upload="handleLogoUpload"
            >
              <img v-if="settingForm.siteLogo" :src="settingForm.siteLogo" class="logo-image" />
              <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
            </el-upload>
            
            <el-button 
              v-if="settingForm.siteLogo" 
              type="danger" 
              size="small" 
              @click="handleRemoveLogo"
              class="remove-logo-btn"
            >
              移除Logo
            </el-button>
          </el-form-item>
        </el-tab-pane>
        
        <el-tab-pane label="页脚设置">
          <el-form-item label="页脚信息">
            <el-input
              v-model="settingForm.footerInfo"
              type="textarea"
              :rows="3"
              placeholder="请输入页脚信息（支持HTML）"
            />
          </el-form-item>
          
          <el-form-item label="备案号">
            <el-input v-model="settingForm.siteIcp" placeholder="请输入网站备案号" />
          </el-form-item>
        </el-tab-pane>
        
        <el-tab-pane label="评论设置">
          <el-form-item label="联系邮箱" prop="siteEmail">
            <el-input v-model="settingForm.siteEmail" placeholder="请输入联系邮箱" />
          </el-form-item>
          
          <el-form-item label="评论设置">
            <el-switch
              v-model="settingForm.allowComments"
              active-text="允许评论"
              inactive-text="禁止评论"
            />
          </el-form-item>
          
          <el-form-item label="评论审核">
            <el-switch
              v-model="settingForm.commentAudit"
              active-text="需要审核"
              inactive-text="无需审核"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      
      <el-form-item>
        <el-button type="primary" @click="saveSettings" :loading="saving">
          保存设置
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.setting-editor {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.editor-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.logo-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 200px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-uploader:hover {
  border-color: #409EFF;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.remove-logo-btn {
  margin-top: 10px;
}
</style>