<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStatisticsStore } from '../../store/statistics';
import { ElMessage } from 'element-plus';

const statisticsStore = useStatisticsStore();

// 统计数据
const stats = computed(() => ({
  articleCount: statisticsStore.dashboardStats.articleCount || 0,
  categoryCount: statisticsStore.dashboardStats.categoryCount || 0,
  viewCount: statisticsStore.dashboardStats.viewCount || 0,
  commentCount: statisticsStore.dashboardStats.commentCount || 0
}));

// 最近文章
const recentArticles = computed(() => statisticsStore.dashboardStats.latestArticles || []);
// 加载状态
const loading = computed(() => statisticsStore.loading);

// 获取统计数据
const fetchStats = async () => {
  try {
    await statisticsStore.fetchDashboardStats();
  } catch (error) {
    ElMessage.error('获取统计数据失败');
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return '';
  }
};

onMounted(() => {
  fetchStats();
});
</script>

<template>
  <div class="dashboard-container">
    <h2 class="page-title">控制台</h2>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-icon">
              <el-icon><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.articleCount }}</div>
              <div class="stat-label">文章数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.categoryCount }}</div>
              <div class="stat-label">分类数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-icon">
              <el-icon><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.viewCount }}</div>
              <div class="stat-label">总浏览量</div>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="12" :sm="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card-content">
            <div class="stat-icon">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.commentCount }}</div>
              <div class="stat-label">总评论数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 最近文章 -->
    <el-card shadow="hover" class="recent-articles-card">
      <template #header>
        <div class="card-header">
          <span>最近发布的文章</span>
          <el-button type="primary" link @click="$router.push({ name: 'ArticleManagement' })">
            查看全部
          </el-button>
        </div>
      </template>
      
      <el-skeleton :rows="5" animated v-if="loading" />
      
      <el-table
        v-else
        :data="recentArticles"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="title" label="文章标题" min-width="300">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="$router.push({ name: 'ArticleDetail', params: { id: row.id } })">
              {{ row.title }}
            </el-link>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.category" :type="row.category.type || 'info'" size="small">
              {{ row.category.name }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="views" label="浏览量" width="100" align="center" />
        
        <el-table-column prop="createdAt" label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="!loading && recentArticles.length === 0" description="暂无文章" />
    </el-card>
    
    <!-- 快捷操作 -->
    <el-card shadow="hover" class="quick-actions-card">
      <template #header>
        <div class="card-header">
          <span>快捷操作</span>
        </div>
      </template>
      
      <div class="quick-actions">
        <el-button type="primary" @click="$router.push({ name: 'ArticleCreate' })">
          <el-icon><Plus /></el-icon>写文章
        </el-button>
        
        <el-button type="success" @click="$router.push({ name: 'CategoryManagement' })">
          <el-icon><FolderAdd /></el-icon>添加分类
        </el-button>
        
        <el-button type="warning" @click="$router.push({ name: 'SystemSettings' })">
          <el-icon><Setting /></el-icon>系统设置
        </el-button>
        
        <el-button @click="$router.push({ name: 'Home' })">
          <el-icon><House /></el-icon>访问首页
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 20px 0;
}

.stat-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card-content {
  display: flex;
  align-items: center;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
  color: #409EFF;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.recent-articles-card,
.quick-actions-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

@media (max-width: 768px) {
  .stat-cards {
    margin-bottom: 10px;
  }
  
  .stat-card {
    margin-bottom: 10px;
  }
  
  .stat-icon {
    font-size: 36px;
  }
  
  .stat-value {
    font-size: 24px;
  }
}
</style>