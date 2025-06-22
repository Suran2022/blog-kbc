import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟搜索历史数据
let mockSearchHistory = [
  { id: '1', keyword: 'Vue3', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', keyword: 'Pinia', timestamp: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: '3', keyword: '前端开发', timestamp: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: '4', keyword: 'JavaScript', timestamp: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: '5', keyword: 'CSS Grid', timestamp: new Date(Date.now() - 86400000 * 5).toISOString() }
];

// 模拟热门搜索数据
let mockHotSearches = [
  { id: '1', keyword: 'Vue3', count: 120 },
  { id: '2', keyword: 'React', count: 98 },
  { id: '3', keyword: 'JavaScript', count: 85 },
  { id: '4', keyword: '前端开发', count: 76 },
  { id: '5', keyword: 'CSS', count: 65 },
  { id: '6', keyword: 'Node.js', count: 54 },
  { id: '7', keyword: 'TypeScript', count: 48 },
  { id: '8', keyword: 'Webpack', count: 42 }
];

// 模拟API
const searchArticles = async (params) => {
  await delay(800);
  
  const { keyword, tag, page = 1, limit = 10 } = params;
  
  // 模拟搜索结果
  // 这里简单实现，实际应该根据keyword或tag过滤文章
  const mockArticles = Array(20).fill(null).map((_, index) => ({
    id: String(index + 1),
    title: keyword 
      ? `关于「${keyword}」的文章 ${index + 1}` 
      : tag 
        ? `标签「${tag}」的文章 ${index + 1}` 
        : `搜索结果文章 ${index + 1}`,
    summary: `这是一篇关于${keyword || tag || '搜索结果'}的文章摘要，包含了相关的内容介绍和核心观点...`,
    cover: `https://picsum.photos/id/${(index % 10) + 10}/800/450`,
    createdAt: new Date(Date.now() - 86400000 * (index % 30)).toISOString(),
    views: Math.floor(Math.random() * 1000),
    author: '博主',
    category: {
      id: String((index % 5) + 1),
      name: ['技术', '编程', '前端', '后端', '数据库'][(index % 5)],
      type: ['primary', 'success', 'warning', 'danger', 'info'][(index % 5)]
    },
    tags: [
      { id: String((index % 12) + 1), name: mockTags[(index % 12)].name }
    ]
  }));
  
  // 如果有关键词，记录到搜索历史
  if (keyword) {
    // 检查是否已存在相同关键词
    const existingIndex = mockSearchHistory.findIndex(item => item.keyword.toLowerCase() === keyword.toLowerCase());
    
    if (existingIndex !== -1) {
      // 已存在则更新时间戳
      mockSearchHistory[existingIndex].timestamp = new Date().toISOString();
    } else {
      // 不存在则添加新记录
      mockSearchHistory.unshift({
        id: String(Date.now()),
        keyword,
        timestamp: new Date().toISOString()
      });
      
      // 限制历史记录数量
      if (mockSearchHistory.length > 10) {
        mockSearchHistory = mockSearchHistory.slice(0, 10);
      }
    }
    
    // 更新热门搜索
    const hotIndex = mockHotSearches.findIndex(item => item.keyword.toLowerCase() === keyword.toLowerCase());
    
    if (hotIndex !== -1) {
      // 已存在则增加计数
      mockHotSearches[hotIndex].count += 1;
      // 重新排序
      mockHotSearches.sort((a, b) => b.count - a.count);
    } else {
      // 不存在则添加新记录
      mockHotSearches.push({
        id: String(Date.now()),
        keyword,
        count: 1
      });
    }
  }
  
  // 分页处理
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = mockArticles.slice(startIndex, endIndex);
  
  return {
    articles: paginatedArticles,
    total: mockArticles.length
  };
};

// 获取搜索历史
const getSearchHistory = async () => {
  await delay(300);
  
  // 按时间戳排序，最新的在前面
  return { data: [...mockSearchHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) };
};

// 清除搜索历史
const clearSearchHistory = async () => {
  await delay(300);
  
  mockSearchHistory = [];
  return { success: true };
};

// 获取热门搜索
const getHotSearches = async () => {
  await delay(300);
  
  return { data: mockHotSearches };
};

// 模拟标签数据，用于生成搜索结果中的标签
const mockTags = [
  { id: '1', name: 'JavaScript' },
  { id: '2', name: 'Vue' },
  { id: '3', name: 'React' },
  { id: '4', name: 'Node.js' },
  { id: '5', name: '前端' },
  { id: '6', name: '后端' },
  { id: '7', name: '数据库' },
  { id: '8', name: 'CSS' },
  { id: '9', name: 'HTML' },
  { id: '10', name: '算法' },
  { id: '11', name: '设计模式' },
  { id: '12', name: '工具' }
];

// 定义搜索Store
export const useSearchStore = defineStore('search', () => {
  // 状态
  const searchResults = ref({
    articles: [],
    total: 0
  });
  const searchHistory = ref([]);
  const hotSearches = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // 搜索文章
  const search = async (params) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await searchArticles(params);
      searchResults.value = response;
      return response;
    } catch (err) {
      error.value = err.message || '搜索失败';
      console.error('搜索失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取搜索历史
  const fetchSearchHistory = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getSearchHistory();
      searchHistory.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取搜索历史失败';
      console.error('获取搜索历史失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 清除搜索历史
  const clearHistory = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      await clearSearchHistory();
      searchHistory.value = [];
    } catch (err) {
      error.value = err.message || '清除搜索历史失败';
      console.error('清除搜索历史失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 获取热门搜索
  const fetchHotSearches = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getHotSearches();
      hotSearches.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取热门搜索失败';
      console.error('获取热门搜索失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    // 状态
    searchResults,
    searchHistory,
    hotSearches,
    loading,
    error,
    
    // 操作
    search,
    fetchSearchHistory,
    clearHistory,
    fetchHotSearches
  };
});