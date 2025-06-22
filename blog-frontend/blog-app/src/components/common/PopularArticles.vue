<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '../../store/article';

const props = defineProps({
  title: {
    type: String,
    default: '热门文章'
  },
  limit: {
    type: Number,
    default: 5
  }
});

const router = useRouter();
const articleStore = useArticleStore();
const popularArticles = ref([]);
const loading = ref(false);

// 获取热门文章
const fetchPopularArticles = async () => {
  loading.value = true;
  try {
    const response = await articleStore.fetchArticles({ 
      page: 1, 
      limit: props.limit,
      sort: 'views:desc'
    });
    popularArticles.value = response.articles || [];
  } catch (error) {
    console.error('获取热门文章失败:', error);
  } finally {
    loading.value = false;
  }
};

// 跳转到文章详情页
const goToDetail = (articleId) => {
  router.push({
    name: 'ArticleDetail',
    params: { id: articleId }
  });
};

onMounted(() => {
  fetchPopularArticles();
});
</script>

<template>
  <div class="popular-articles-container">
    <h3 class="popular-articles-title">{{ title }}</h3>
    <el-divider />
    <el-skeleton :rows="limit" animated v-if="loading" />
    <div v-else-if="popularArticles.length > 0" class="popular-articles-list">
      <div 
        v-for="(article, index) in popularArticles" 
        :key="article.id"
        class="popular-article-item"
        @click="goToDetail(article.id)"
      >
        <div class="article-rank">{{ index + 1 }}</div>
        <div class="article-info">
          <div class="article-title">{{ article.title }}</div>
          <div class="article-views">
            <el-icon><View /></el-icon>
            {{ article.views }} 阅读
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无文章" :image-size="60" />
  </div>
</template>

<style scoped>
.popular-articles-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  height: 100%;
}

.popular-articles-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.popular-articles-title {
  font-size: 18px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 12px 0;
  position: relative;
  padding-bottom: 8px;
}

.popular-articles-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.popular-articles-list {
  display: flex;
  flex-direction: column;
}

.popular-article-item {
  display: flex;
  align-items: flex-start;
  padding: 10px 8px;
  border-bottom: 1px solid rgba(94, 114, 228, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.popular-article-item:last-child {
  border-bottom: none;
}

.popular-article-item:hover {
  background-color: rgba(94, 114, 228, 0.05);
  transform: translateX(3px);
  padding-left: 12px;
}

.article-rank {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fe;
  color: #8898aa;
  font-size: 13px;
  font-weight: bold;
  border-radius: 50%;
  margin-right: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(94, 114, 228, 0.1);
}

.popular-article-item:hover .article-rank {
  transform: scale(1.1);
}

.popular-article-item:nth-child(1) .article-rank {
  background: linear-gradient(135deg, #f5365c, #f56036);
  color: #fff;
  box-shadow: 0 4px 10px rgba(245, 54, 92, 0.3);
}

.popular-article-item:nth-child(2) .article-rank {
  background: linear-gradient(135deg, #ffd600, #f5a623);
  color: #fff;
  box-shadow: 0 4px 10px rgba(255, 214, 0, 0.3);
}

.popular-article-item:nth-child(3) .article-rank {
  background: linear-gradient(135deg, #2dce89, #2dcca7);
  color: #fff;
  box-shadow: 0 4px 10px rgba(45, 206, 137, 0.3);
}

.article-info {
  flex: 1;
  overflow: hidden;
}

.article-title {
  font-size: 14px;
  color: #32325d;
  margin-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  transition: color 0.3s ease;
}

.popular-article-item:hover .article-title {
  color: #5e72e4;
}

.article-views {
  font-size: 12px;
  color: #8898aa;
  display: flex;
  align-items: center;
}

.article-views .el-icon {
  margin-right: 3px;
  font-size: 12px;
}
</style>