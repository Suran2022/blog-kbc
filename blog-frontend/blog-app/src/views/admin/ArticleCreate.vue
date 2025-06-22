<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import ArticleEditor from '../../components/admin/ArticleEditor.vue';

const router = useRouter();

// 处理保存成功
const handleSaveSuccess = () => {
  ElMessage.success('文章创建成功');
  router.push({ name: 'ArticleList' });
};

// 处理取消
const handleCancel = () => {
  router.push({ name: 'ArticleList' });
};
</script>

<template>
  <div class="article-create-container">
    <div class="page-header">
      <h2 class="page-title">创建文章</h2>
    </div>
    
    <ArticleEditor 
      @save-success="handleSaveSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.article-create-container {
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