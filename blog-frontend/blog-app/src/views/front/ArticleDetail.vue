<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '../../store/article';
import ArticleDetailComponent from '../../components/common/ArticleDetail.vue';
import CommentSection from '../../components/common/CommentSection.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import PopularArticles from '../../components/common/PopularArticles.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import ContributorList from '../../components/common/ContributorList.vue';

const route = useRoute();
const articleStore = useArticleStore();

// 文章ID
const articleId = ref(null);
// 文章详情
const article = ref(null);
// 加载状态
const loading = ref(false);
// 错误信息
const error = ref(null);

// 获取文章详情
const fetchArticleDetail = async () => {
  if (!articleId.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    await articleStore.fetchArticleById(articleId.value);
    article.value = articleStore.currentArticle;
    
    if (article.value) {
      // 设置页面标题
      document.title = `${article.value.title} - 博客`;
    } else {
      error.value = '文章不存在';
    }
  } catch (err) {
    console.error('获取文章详情失败:', err);
    error.value = '获取文章详情失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // 从路由参数获取文章ID
  articleId.value = route.params.id;
  fetchArticleDetail();
});
</script>

<template>
  <div class="article-detail-container">
    <div class="main-content">
      <el-skeleton :rows="15" animated v-if="loading" />
      
      <template v-else>
        <el-alert
          v-if="error"
          :title="error"
          type="error"
          :closable="false"
          show-icon
        />
        
        <template v-else-if="article">
          <ArticleDetailComponent :article="article" />
          <CommentSection :article-id="Number(articleId)" />
        </template>
        
        <el-empty v-else description="文章不存在" />
      </template>
    </div>
    
    <div class="sidebar">
      <CategoryList />
      <LatestArticles />
      <PopularArticles />
      <ContributorList />
    </div>
  </div>
</template>

<style scoped>
.article-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  min-height: 100vh;
}

.main-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.sidebar {
  display: grid;
  gap: 1.5rem;
  align-content: start;
}

.sidebar > * {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .main-content {
    padding: 1.5rem;
  }
  
  .sidebar > * {
    padding: 1rem;
  }
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .article-detail-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
</style>