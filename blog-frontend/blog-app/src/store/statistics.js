import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟API
const getDashboardStats = async () => {
  await delay(1000);
  
  return {
    data: {
      articleCount: 100,
      categoryCount: 10,
      viewCount: 1024,
      commentCount: 56,
      latestArticles: [
        {
          id: '1',
          title: '如何使用Vue3和Pinia构建现代化前端应用',
          category: { id: '1', name: '技术', type: 'primary' },
          views: 120,
          createdAt: new Date(Date.now() - 86400000).toISOString() // 1天前
        },
        {
          id: '2',
          title: 'JavaScript异步编程最佳实践',
          category: { id: '2', name: '编程', type: 'success' },
          views: 85,
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString() // 2天前
        },
        {
          id: '3',
          title: '响应式设计原则与实践',
          category: { id: '5', name: '前端', type: 'warning' },
          views: 67,
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3天前
        },
        {
          id: '4',
          title: 'CSS Grid布局完全指南',
          category: { id: '5', name: '前端', type: 'warning' },
          views: 54,
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString() // 4天前
        },
        {
          id: '5',
          title: 'Node.js性能优化技巧',
          category: { id: '3', name: '后端', type: 'danger' },
          views: 42,
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString() // 5天前
        }
      ]
    }
  };
};

// 获取文章趋势数据
const getArticleTrend = async (period = 'week') => {
  await delay(800);
  
  // 生成过去7天或30天的数据
  const days = period === 'week' ? 7 : 30;
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    
    // 生成随机数据
    data.push({
      date: dateStr,
      articles: Math.floor(Math.random() * 5), // 每天0-4篇文章
      views: Math.floor(Math.random() * 100 + 50) // 每天50-149次浏览
    });
  }
  
  return { data };
};

// 获取分类统计数据
const getCategoryStats = async () => {
  await delay(800);
  
  return {
    data: [
      { name: '技术', value: 10 },
      { name: '编程', value: 8 },
      { name: '后端', value: 6 },
      { name: '前端', value: 12 },
      { name: '数据库', value: 4 },
      { name: '工具', value: 5 }
    ]
  };
};

// 定义统计数据Store
export const useStatisticsStore = defineStore('statistics', () => {
  // 状态
  const dashboardStats = ref({
    articleCount: 0,
    categoryCount: 0,
    viewCount: 0,
    commentCount: 0,
    latestArticles: []
  });
  const articleTrend = ref([]);
  const categoryStats = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // 获取控制台统计数据
  const fetchDashboardStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getDashboardStats();
      dashboardStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取统计数据失败';
      console.error('获取统计数据失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取文章趋势数据
  const fetchArticleTrend = async (period = 'week') => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getArticleTrend(period);
      articleTrend.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取文章趋势数据失败';
      console.error('获取文章趋势数据失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取分类统计数据
  const fetchCategoryStats = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getCategoryStats();
      categoryStats.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取分类统计数据失败';
      console.error('获取分类统计数据失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    // 状态
    dashboardStats,
    articleTrend,
    categoryStats,
    loading,
    error,
    
    // 操作
    fetchDashboardStats,
    fetchArticleTrend,
    fetchCategoryStats
  };
});