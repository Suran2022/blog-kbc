<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useArticleStore } from '../../store/article';
import { useCategoryStore } from '../../store/category';
import ArticleCard from '../../components/common/ArticleCard.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import PopularArticles from '../../components/common/PopularArticles.vue';
import ContributorList from '../../components/common/ContributorList.vue';
import Pagination from '../../components/common/Pagination.vue';

const route = useRoute();
const articleStore = useArticleStore();
const categoryStore = useCategoryStore();

// 分类ID
const categoryId = ref(null);
// 当前分类
const category = ref(null);
// 文章列表
const articles = ref([]);
// 文章总数
const total = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);
// 加载状态
const loading = ref(false);
// 错误信息
const error = ref(null);

// 获取分类详情
const fetchCategoryDetail = async () => {
  if (!categoryId.value) return;
  
  try {
    await categoryStore.fetchCategoryById(categoryId.value);
    category.value = categoryStore.currentCategory;
    
    if (category.value) {
      // 设置页面标题
      document.title = `${category.value.name} - 博客`;
    } else {
      error.value = '分类不存在';
    }
  } catch (err) {
    console.error('获取分类详情失败:', err);
    error.value = '获取分类详情失败，请稍后重试';
  }
};

// 获取分类文章列表
const fetchCategoryArticles = async () => {
  if (!categoryId.value) return;
  
  loading.value = true;
  error.value = null;
  
  try {
    const response = await articleStore.fetchArticlesByCategory(categoryId.value, {
      page: currentPage.value,
      size: pageSize.value
    });
    
    articles.value = response.data.list || [];
    total.value = response.data.total || 0;
  } catch (err) {
    console.error('获取分类文章失败:', err);
    error.value = '获取分类文章失败，请稍后重试';
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePagination = ({ page, limit }) => {
  currentPage.value = page;
  pageSize.value = limit;
  fetchCategoryArticles();
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 监听路由参数变化
watch(
  () => route.params.id,
  (newId) => {
    if (newId && newId !== categoryId.value) {
      categoryId.value = newId;
      currentPage.value = 1; // 重置页码
      fetchCategoryDetail();
      fetchCategoryArticles();
    }
  }
);

onMounted(() => {
  // 从路由参数获取分类ID
  categoryId.value = route.params.id;
  fetchCategoryDetail();
  fetchCategoryArticles();
});
</script>

<template>
  <div class="category-articles-container">
    <div class="main-content">
      <el-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="error-alert"
      />
      
      <template v-else>
        <div class="category-header" v-if="category">
          <div class="category-info">
            <h1 class="category-title">
              <el-tag :type="category.type || 'primary'" effect="dark" class="category-tag">
                {{ category.name }}
              </el-tag>
              <span class="title-text">分类文章</span>
            </h1>
            <div class="category-meta">
              <span class="article-count">共 {{ total }} 篇文章</span>
              <div class="category-description" v-if="category.description">
                {{ category.description }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="article-list">
          <el-skeleton :rows="8" animated v-if="loading" />
          
          <template v-else>
            <div v-if="articles.length > 0" class="articles-grid">
              <ArticleCard 
                v-for="article in articles" 
                :key="article.id"
                :article="article"
                class="article-item"
              />
              
              <div class="pagination-container">
                <Pagination
                  :current-page="currentPage"
                  :page-size="pageSize"
                  :total="total"
                  @pagination="handlePagination"
                />
              </div>
            </div>
            <el-empty v-else description="该分类下暂无文章" class="empty-state" />
          </template>
        </div>
      </template>
    </div>
    
    <div class="sidebar">
      <div class="sidebar-section">
        <CategoryList />
      </div>
      <div class="sidebar-section">
        <LatestArticles />
      </div>
      <div class="sidebar-section">
        <PopularArticles />
      </div>
      <div class="sidebar-section">
        <ContributorList />
      </div>
    </div>
  </div>
</template>

<style scoped>
.category-articles-container {
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

.error-alert {
  margin-bottom: 2rem;
}

.category-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e9ecef;
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.category-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.category-tag {
  font-size: 0.9rem;
}

.title-text {
  color: #666;
}

.category-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.article-count {
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.category-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.6;
}

.articles-grid {
  display: grid;
  gap: 1.5rem;
}

.article-item {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
}

.article-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.pagination-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
}

.empty-state {
  margin: 3rem 0;
}

.sidebar {
  display: grid;
  gap: 1.5rem;
  align-content: start;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-articles-container {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
  
  .main-content {
    padding: 1.5rem;
  }
  
  .category-title {
    font-size: 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sidebar-section {
    padding: 1rem;
  }
}
</style>