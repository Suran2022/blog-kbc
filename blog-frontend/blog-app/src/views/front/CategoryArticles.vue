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
      />
      
      <template v-else>
        <div class="category-header" v-if="category">
          <h2 class="category-title">
            <el-tag :type="category.type || 'info'" effect="dark" class="category-tag">
              {{ category.name }}
            </el-tag>
            分类下的文章
          </h2>
          <div class="category-description" v-if="category.description">
            {{ category.description }}
          </div>
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
            <el-empty v-else description="该分类下暂无文章" />
          </template>
        </div>
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
.category-articles-container {
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

.category-header {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.category-title {
  font-size: 18px;
  color: #303133;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
}

.category-tag {
  margin-right: 10px;
}

.category-description {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .category-articles-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
}
</style>