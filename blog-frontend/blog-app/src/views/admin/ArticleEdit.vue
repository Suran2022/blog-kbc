<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useArticleStore } from '../../store/article';
import ArticleEditor from '../../components/admin/ArticleEditor.vue';

const route = useRoute();
const router = useRouter();
const articleStore = useArticleStore();

// 文章ID
const articleId = route.params.id;
// 文章数据
const article = ref(null);
// 加载状态
const loading = ref(false);

// 获取文章详情
const fetchArticle = async () => {
  if (!articleId) {
    ElMessage.error('文章ID不存在');
    router.push({ name: 'ArticleList' });
    return;
  }
  
  loading.value = true;
  try {
    article.value = await articleStore.fetchArticleById(articleId);
    if (!article.value) {
      ElMessage.error('文章不存在');
      router.push({ name: 'ArticleList' });
    }
  } catch (error) {
    console.error('获取文章详情失败:', error);
    ElMessage.error('获取文章详情失败');
    router.push({ name: 'ArticleList' });
  } finally {
    loading.value = false;
  }
};

// 处理保存成功
const handleSaveSuccess = () => {
  ElMessage.success('文章更新成功');
  router.push({ name: 'ArticleList' });
};

// 处理取消
const handleCancel = () => {
  router.push({ name: 'ArticleList' });
};

onMounted(() => {
  fetchArticle();
});
</script>

<template>
  <div class="article-edit-container">
    <div class="page-header">
      <h2 class="page-title">编辑文章</h2>
    </div>
    
    <el-skeleton :rows="10" animated v-if="loading" />
    
    <ArticleEditor 
      v-else-if="article"
      :article-id="articleId"
      @save-success="handleSaveSuccess"
      @cancel="handleCancel"
    />
  </div>
</template>

<style scoped>
.article-edit-container {
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