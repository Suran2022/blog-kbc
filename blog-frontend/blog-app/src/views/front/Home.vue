<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from '../../store/article';
import { useTagStore } from '../../store/tag';
import ArticleCard from '../../components/common/ArticleCard.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import TagCloud from '../../components/common/TagCloud.vue';
import ContributorList from '../../components/common/ContributorList.vue';
import Pagination from '../../components/common/Pagination.vue';
import { ArrowRight, Star, TrendCharts, Reading } from '@element-plus/icons-vue';

const articleStore = useArticleStore();
const tagStore = useTagStore();

// 文章列表
const articles = ref([]);
// 文章总数
const total = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(15);
// 加载状态
const loading = ref(false);
// 标签列表
const tags = ref([]);

// 统计数据
const stats = ref({
  totalArticles: 0,
  totalViews: 0,
  totalCategories: 0,
  totalTags: 0
});





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
    
    // 更新统计数据
    stats.value.totalArticles = total.value;
  } catch (error) {
    console.error('获取文章列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取标签列表
const fetchTags = async () => {
  try {
    await tagStore.fetchTags();
    tags.value = tagStore.tags;
    stats.value.totalTags = tags.value.length;
  } catch (error) {
    console.error('获取标签列表失败:', error);
  }
};

// 获取统计数据
const fetchStats = async () => {
  try {
    // 这里可以调用统计API，暂时使用模拟数据
    stats.value.totalViews = 12345;
    stats.value.totalCategories = 8;
  } catch (error) {
    console.error('获取统计数据失败:', error);
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
  fetchTags();
  fetchStats();
});
</script>

<template>
  <div class="home">
    <!-- 简化的头部区域 -->
    <section class="header-section">
      <div class="container">
        <div class="header-content">
          <h1 class="site-title">技术博客</h1>
          <p class="site-subtitle">分享技术，记录成长</p>
        </div>
        
        <!-- 统计数据 -->
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalArticles }}</div>
            <div class="stat-label">文章</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalViews }}</div>
            <div class="stat-label">浏览</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalCategories }}</div>
            <div class="stat-label">分类</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ stats.totalTags }}</div>
            <div class="stat-label">标签</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- 左侧：文章列表 -->
          <div class="content-main">
            <div class="section-header">
              <h2 class="section-title">最新文章</h2>
              <span class="article-count">共 {{ total }} 篇文章</span>
            </div>
            
            <el-skeleton :rows="8" animated v-if="loading" />
            
            <div v-else class="articles-list">
              <ArticleCard 
                v-for="article in articles" 
                :key="article.id" 
                :article="article"
                class="article-item"
              />
            </div>
            
            <!-- 分页 -->
            <div class="pagination-container" v-if="total > 0">
              <Pagination 
                :current-page="currentPage"
                :page-size="pageSize"
                :total="total"
                @pagination="handlePagination"
              />
            </div>
          </div>
          
          <!-- 右侧：侧边栏 -->
          <div class="content-sidebar">
            <div class="sidebar-section">
              <CategoryList />
            </div>
            <div class="sidebar-section">
              <LatestArticles />
            </div>
            <div class="sidebar-section">
              <TagCloud :tags="tags" />
            </div>
            <div class="sidebar-section">
              <ContributorList />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
}

.header-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  text-align: center;
  margin-bottom: 2rem;
}

.site-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.site-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  text-align: center;
}

.stat-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.main-content {
  padding: 2rem 0;
  background: #f8f9fa;
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.content-main {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.article-count {
  color: #666;
  font-size: 0.9rem;
}

.articles-list {
  display: grid;
  gap: 1rem;
}

.article-item {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
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

.content-sidebar {
  display: grid;
  gap: 1.5rem;
  align-content: start;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 特色文章区域 */
.featured-section {
  padding: 60px 0;
  background: #f8f9fa;
  margin-bottom: 60px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.featured-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.featured-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.featured-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-card:hover .featured-image img {
  transform: scale(1.1);
}

.featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(94, 114, 228, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-card:hover .featured-overlay {
  opacity: 1;
}

.featured-content {
  padding: 25px;
}

.featured-category {
  display: inline-block;
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  padding: 5px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 15px;
}

.featured-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #32325d;
  margin-bottom: 10px;
  line-height: 1.4;
}

.featured-summary {
  color: #525f7f;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 15px;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #8898aa;
  font-size: 0.85rem;
}

/* 主要内容区域 */
.content-wrapper {
  padding: 0;
}

.content-grid {
  display: flex;
  gap: 30px;
  min-height: calc(100vh - 200px);
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
  font-size: 2.5rem;
  font-weight: 700;
  color: #32325d;
  margin: 0 0 30px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.section-title .el-icon {
  color: #5e72e4;
  font-size: 2rem;
}

.article-list .section-title {
  font-size: 1.8rem;
  text-align: left;
  justify-content: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(94, 114, 228, 0.2);
  position: relative;
}

.article-list .section-title::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-grid {
    gap: 25px;
  }
  
  .sidebar {
    width: 320px;
  }
  
  .featured-grid {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 992px) {
  .content-grid {
    gap: 20px;
  }
  
  .sidebar {
    width: 280px;
  }
  
  .hero-title {
    font-size: 2.8rem;
  }
  
  .hero-subtitle {
    font-size: 1.3rem;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .stats-section {
    padding: 40px 0;
  }
  
  .featured-section {
    padding: 40px 0;
  }
}

@media (max-width: 768px) {
  .content-grid {
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
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .hero-subtitle {
    font-size: 1.1rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .stat-item {
    padding: 20px;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .stats-section {
    padding: 30px 0;
  }
  
  .featured-section {
    padding: 30px 0;
  }
  
  .hero-section {
    margin-bottom: 40px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.8rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-description {
    font-size: 0.9rem;
  }
  
  .hero-button {
    padding: 10px 20px;
    font-size: 1rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .featured-card {
    margin: 0 10px;
  }
  
  .stat-item {
    flex-direction: column;
    text-align: center;
  }
  
  .stat-icon {
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>