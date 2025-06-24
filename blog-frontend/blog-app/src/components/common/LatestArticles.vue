<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '../../store/article';
import { formatDate } from '../../utils';
import { Clock, Document, ArrowRight } from '@element-plus/icons-vue';

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

// 移除可能导致无限循环的watch监听器
// 如果需要响应文章变化，可以通过父组件手动调用refresh方法

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
    <h3 class="latest-articles-title">
      <el-icon><Clock /></el-icon>
      {{ title }}
    </h3>
    <el-skeleton :rows="limit" animated v-if="loading" />
    <div v-else-if="latestArticles.length > 0" class="latest-articles-list">
      <div 
        v-for="(article, index) in latestArticles" 
        :key="article.id"
        class="latest-article-item"
        @click="goToDetail(article.id)"
      >
        <div class="article-index">{{ index + 1 }}</div>
        <div class="article-content">
          <div class="article-title">{{ article.title }}</div>
          <div class="article-meta">
            <span class="article-date">
              <el-icon><Document /></el-icon>
              {{ formatDate(article.createdAt, 'MM-DD') }}
            </span>
            <span class="article-views" v-if="article.views">
              {{ article.views }} 阅读
            </span>
          </div>
        </div>
        <div class="article-arrow">
          <el-icon><ArrowRight /></el-icon>
        </div>
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
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  padding-bottom: 12px;
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

.latest-articles-title .el-icon {
  color: #5e72e4;
  font-size: 20px;
}

.latest-articles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.latest-article-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e9ecef;
}

.latest-article-item:hover {
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.1), rgba(130, 94, 228, 0.05));
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.15);
  border-color: rgba(94, 114, 228, 0.3);
}

.article-index {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  flex-shrink: 0;
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 14px;
  color: #32325d;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  transition: color 0.3s ease;
  line-height: 1.4;
}

.latest-article-item:hover .article-title {
  color: #5e72e4;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: #8898aa;
}

.article-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-date .el-icon {
  font-size: 12px;
}

.article-views {
  font-size: 11px;
}

.article-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: #5e72e4;
}

.latest-article-item:hover .article-arrow {
  opacity: 1;
  transform: translateX(0);
}

.article-arrow .el-icon {
  font-size: 14px;
}
</style>