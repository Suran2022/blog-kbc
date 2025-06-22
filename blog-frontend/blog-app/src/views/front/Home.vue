<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from '../../store/article';
import ArticleCard from '../../components/common/ArticleCard.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import TagCloud from '../../components/common/TagCloud.vue';
import ContributorList from '../../components/common/ContributorList.vue';
import Pagination from '../../components/common/Pagination.vue';

const articleStore = useArticleStore();

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

// 标签列表（模拟数据）
const tags = ref([
  { name: 'JavaScript', count: 12 },
  { name: 'Vue', count: 8 },
  { name: 'React', count: 6 },
  { name: 'Node.js', count: 5 },
  { name: 'CSS', count: 10 },
  { name: 'HTML', count: 7 },
  { name: 'TypeScript', count: 4 },
  { name: '前端', count: 15 },
  { name: '后端', count: 9 },
  { name: '数据库', count: 3 }
]);

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await articleStore.fetchArticles({
      page: currentPage.value,
      size: pageSize.value
    });
    
    articles.value = response.data?.list || [];
    total.value = response.data?.total || 0;
  } catch (error) {
    console.error('获取文章列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePagination = ({ page, size }) => {
  currentPage.value = page;
  pageSize.value = size;
  fetchArticles();
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  fetchArticles();
});
</script>

<template>
  <div class="home-container">
    <div class="content-wrapper">
      <!-- 左侧内容区 -->
      <div class="main-content">
        <div class="article-list">
          <h2 class="section-title">最新文章</h2>
          
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
            <el-empty v-else description="暂无文章" />
          </template>
        </div>
      </div>
      
      <!-- 右侧边栏 -->
      <div class="sidebar">
        <div class="sidebar-widgets">
          <CategoryList />
          <LatestArticles />
          <TagCloud :tags="tags" />
          <ContributorList />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  padding: 0;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
  min-height: calc(100vh - 200px); /* 减去头部和底部的高度 */
}

.main-content {
  flex: 1;
  min-width: 0; /* 防止flex子项溢出 */
  display: flex;
  flex-direction: column;
}

.article-list {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(94, 114, 228, 0.1);
  padding: 25px;
  transition: all 0.3s ease;
  flex: 1; /* 填充可用空间 */
  display: flex;
  flex-direction: column;
}

.article-list:hover {
  box-shadow: 0 7px 20px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.sidebar {
  width: 340px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
}

.sidebar-widgets {
  position: sticky;
  top: 90px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.section-title {
  font-size: 22px;
  font-weight: bold;
  color: #5e72e4;
  margin: 0 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(94, 114, 228, 0.2);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

@media (max-width: 1200px) {
  .content-wrapper {
    gap: 25px;
  }
  
  .sidebar {
    width: 320px;
  }
}

@media (max-width: 992px) {
  .content-wrapper {
    gap: 20px;
  }
  
  .sidebar {
    width: 280px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
    gap: 25px;
    min-height: auto;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .article-list {
    padding: 20px;
  }
  
  .sidebar-widgets {
    position: static;
    height: auto;
  }
}
</style>