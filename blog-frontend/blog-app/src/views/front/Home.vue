<script setup>
import { ref, onMounted } from 'vue';
import { useArticleStore } from '../../store/article';
import ArticleCard from '../../components/common/ArticleCard.vue';
import CategoryList from '../../components/common/CategoryList.vue';
import LatestArticles from '../../components/common/LatestArticles.vue';
import TagCloud from '../../components/common/TagCloud.vue';
import ContributorList from '../../components/common/ContributorList.vue';
import Pagination from '../../components/common/Pagination.vue';
import { ArrowRight, Star, TrendCharts, Reading } from '@element-plus/icons-vue';

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

// 轮播图数据
const bannerSlides = ref([
  {
    id: 1,
    title: '欢迎来到我的博客',
    subtitle: '分享技术，记录成长',
    description: '在这里，我会分享我的技术心得、学习笔记和项目经验',
    image: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: '开始阅读',
    buttonLink: '/articles'
  },
  {
    id: 2,
    title: '前端技术分享',
    subtitle: 'Vue.js & React 开发实践',
    description: '深入探讨现代前端框架的使用技巧和最佳实践',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: '查看更多',
    buttonLink: '/category/frontend'
  },
  {
    id: 3,
    title: '全栈开发之路',
    subtitle: '从前端到后端的完整体验',
    description: '分享全栈开发的学习路径和项目实战经验',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    buttonText: '了解详情',
    buttonLink: '/category/fullstack'
  }
]);

// 特色文章数据
const featuredArticles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 深度解析',
    summary: '详细介绍 Vue 3 Composition API 的使用方法和最佳实践',
    views: 1250,
    likes: 89,
    category: 'Vue.js',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 2,
    title: 'React Hooks 实战指南',
    summary: '从基础到进阶，全面掌握 React Hooks 的使用技巧',
    views: 980,
    likes: 67,
    category: 'React',
    image: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    title: 'Node.js 性能优化实践',
    summary: '分享 Node.js 应用性能优化的方法和工具',
    views: 756,
    likes: 45,
    category: 'Node.js',
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
  }
]);

// 统计数据
const stats = ref([
  { label: '文章总数', value: 128, icon: Reading },
  { label: '总阅读量', value: '25.6K', icon: TrendCharts },
  { label: '获得点赞', value: '3.2K', icon: Star }
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
    <!-- 轮播图区域 -->
    <div class="hero-section">
      <el-carousel height="400px" :interval="5000" arrow="hover" indicator-position="outside">
        <el-carousel-item v-for="slide in bannerSlides" :key="slide.id">
          <div class="hero-slide" :style="{ backgroundImage: `url(${slide.image})` }">
            <div class="hero-overlay"></div>
            <div class="hero-content">
              <h1 class="hero-title">{{ slide.title }}</h1>
              <h2 class="hero-subtitle">{{ slide.subtitle }}</h2>
              <p class="hero-description">{{ slide.description }}</p>
              <el-button type="primary" size="large" class="hero-button">
                {{ slide.buttonText }}
                <el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 统计数据区域 -->
    <div class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div v-for="stat in stats" :key="stat.label" class="stat-item">
            <div class="stat-icon">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 特色文章区域 -->
    <div class="featured-section">
      <div class="container">
        <h2 class="section-title">
          <el-icon><Star /></el-icon>
          特色文章
        </h2>
        <div class="featured-grid">
          <div v-for="article in featuredArticles" :key="article.id" class="featured-card">
            <div class="featured-image">
              <img :src="article.image" :alt="article.title" />
              <div class="featured-overlay">
                <el-button type="primary" circle>
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="featured-content">
              <div class="featured-category">{{ article.category }}</div>
              <h3 class="featured-title">{{ article.title }}</h3>
              <p class="featured-summary">{{ article.summary }}</p>
              <div class="featured-meta">
                <span class="meta-item">
                  <el-icon><Reading /></el-icon>
                  {{ article.views }}
                </span>
                <span class="meta-item">
                  <el-icon><Star /></el-icon>
                  {{ article.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <div class="container">
        <div class="content-grid">
          <!-- 左侧内容区 -->
          <div class="main-content">
            <div class="article-list">
              <h2 class="section-title">
                <el-icon><Reading /></el-icon>
                最新文章
              </h2>
              
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
    </div>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  padding: 0;
}

/* 轮播图区域 */
.hero-section {
  margin-bottom: 60px;
}

.hero-slide {
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.8), rgba(130, 94, 228, 0.6));
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 600px;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.hero-button {
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.hero-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

/* 统计数据区域 */
.stats-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  margin-bottom: 60px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.stat-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 15px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
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