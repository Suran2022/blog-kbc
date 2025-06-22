<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '../../store/article';
import { formatDate } from '../../utils';

const props = defineProps({
  title: {
    type: String,
    default: '最新文章'
  },
  limit: {
    type: Number,
    default: 5
  }
});

const router = useRouter();
const articleStore = useArticleStore();
const latestArticles = ref([]);
const loading = ref(false);

// 获取最新文章
const fetchLatestArticles = async () => {
  loading.value = true;
  try {
    const response = await articleStore.fetchArticles({ 
      page: 1, 
      size: props.limit,
      sort: 'createdAt:desc'
    });
    latestArticles.value = response.data.list || [];
  } catch (error) {
    console.error('获取最新文章失败:', error);
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

// 监听文章列表变化，自动刷新最新文章
watch(
  () => articleStore.articles,
  () => {
    fetchLatestArticles();
  },
  { deep: true }
);

// 暴露刷新方法给父组件
defineExpose({
  refresh: fetchLatestArticles
});

onMounted(() => {
  fetchLatestArticles();
});
</script>

<template>
  <div class="latest-articles-container">
    <h3 class="latest-articles-title">{{ title }}</h3>
    <el-divider />
    <el-skeleton :rows="limit" animated v-if="loading" />
    <div v-else-if="latestArticles.length > 0" class="latest-articles-list">
      <div 
        v-for="article in latestArticles" 
        :key="article.id"
        class="latest-article-item"
        @click="goToDetail(article.id)"
      >
        <div class="article-title">{{ article.title }}</div>
        <div class="article-date">{{ formatDate(article.createdAt, 'YYYY-MM-DD') }}</div>
      </div>
    </div>
    <el-empty v-else description="暂无文章" :image-size="60" />
  </div>
</template>

<style scoped>
.latest-articles-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
  height: 100%;
}

.latest-articles-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.latest-articles-title {
  font-size: 18px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 12px 0;
  position: relative;
  padding-bottom: 8px;
}

.latest-articles-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.latest-articles-list {
  display: flex;
  flex-direction: column;
}

.latest-article-item {
  padding: 10px 8px;
  border-bottom: 1px solid rgba(94, 114, 228, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.latest-article-item:last-child {
  border-bottom: none;
}

.latest-article-item:hover {
  background-color: rgba(94, 114, 228, 0.05);
  transform: translateX(3px);
  padding-left: 12px;
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

.latest-article-item:hover .article-title {
  color: #5e72e4;
}

.article-date {
  font-size: 12px;
  color: #8898aa;
}
</style>