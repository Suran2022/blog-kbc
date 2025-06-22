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
          <CommentSection :article-id="articleId" />
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
  display: flex;
  gap: 20px;
}

.main-content {
  flex: 1;
  min-width: 0; /* 防止flex子项溢出 */
}

.sidebar {
  width: 300px;
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