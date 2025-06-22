<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useSearchStore } from '../../store/search';
import ArticleCard from '../../components/common/ArticleCard.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import PopularArticles from '../../components/common/PopularArticles.vue';
import ContributorList from '../../components/common/ContributorList.vue';
import Pagination from '../../components/common/Pagination.vue';

const route = useRoute();
const searchStore = useSearchStore();

// 搜索关键词
const keyword = ref('');
// 搜索标签
const tag = ref('');
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);

// 文章列表
const articles = computed(() => searchStore.searchResults.articles || []);
// 文章总数
const total = computed(() => searchStore.searchResults.total || 0);
// 加载状态
const loading = computed(() => searchStore.loading);
// 错误信息
const error = computed(() => searchStore.error);

// 搜索标题
const searchTitle = computed(() => {
  if (keyword.value) {
    return `关键词「${keyword.value}」的搜索结果`;
  } else if (tag.value) {
    return `标签「${tag.value}」的文章`;
  }
  return '搜索结果';
});

// 搜索文章
const searchArticles = async () => {
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize.value
    };
    
    if (keyword.value) {
      params.keyword = keyword.value;
    } else if (tag.value) {
      params.tag = tag.value;
    }
    
    await searchStore.search(params);
    
    // 设置页面标题
    document.title = `${searchTitle.value} - 博客`;
  } catch (err) {
    console.error('搜索文章失败:', err);
  }
};

// 处理分页变化
const handlePagination = ({ page, limit }) => {
  currentPage.value = page;
  pageSize.value = limit;
  searchArticles();
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听路由查询参数变化
watch(
  () => route.query,
  (newQuery) => {
    const newKeyword = newQuery.keyword;
    const newTag = newQuery.tag;
    
    if (newKeyword !== keyword.value || newTag !== tag.value) {
      keyword.value = newKeyword || '';
      tag.value = newTag || '';
      currentPage.value = 1; // 重置页码
      searchArticles();
    }
  },
  { deep: true }
);

onMounted(() => {
  // 从路由查询参数获取搜索条件
  keyword.value = route.query.keyword || '';
  tag.value = route.query.tag || '';
  searchArticles();
});
</script>

<template>
  <div class="search-results-container">
    <div class="main-content">
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
      />
      
      <div class="search-header">
        <h2 class="search-title">{{ searchTitle }}</h2>
      </div>
      
      <div class="article-list">
        <el-skeleton :rows="5" animated v-if="loading" />
        
        <template v-else>
          <div v-if="articles.length > 0">
            <ArticleCard 
              v-for="article in articles" 
              :key="article.id"
              :article="article"
            />
            
            <Pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :total="total"
              @pagination="handlePagination"
            />
          </div>
          <el-empty v-else description="未找到相关文章" />
        </template>
      </div>
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
.search-results-container {
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

.search-header {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.search-title {
  font-size: 18px;
  color: #303133;
  margin: 0;
}

@media (max-width: 768px) {
  .search-results-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
</style>