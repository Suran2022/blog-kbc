import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟标签数据
let mockTags = [
  { id: '1', name: 'JavaScript', count: 8 },
  { id: '2', name: 'Vue', count: 6 },
  { id: '3', name: 'React', count: 4 },
  { id: '4', name: 'Node.js', count: 5 },
  { id: '5', name: '前端', count: 10 },
  { id: '6', name: '后端', count: 3 },
  { id: '7', name: '数据库', count: 2 },
  { id: '8', name: 'CSS', count: 7 },
  { id: '9', name: 'HTML', count: 6 },
  { id: '10', name: '算法', count: 3 },
  { id: '11', name: '设计模式', count: 2 },
  { id: '12', name: '工具', count: 4 }
];

// 模拟文章标签关联
let mockArticleTags = {
  '1': ['JavaScript', 'Vue', '前端'],
  '2': ['React', 'JavaScript', '前端'],
  '3': ['Node.js', '后端', '数据库'],
  '4': ['CSS', 'HTML', '前端'],
  '5': ['JavaScript', 'Vue', '工具']
};

// 模拟API
const getTags = async () => {
  await delay(500);
  return { data: [...mockTags] };
};

const getPopularTags = async (limit = 10) => {
  await delay(400);
  
  // 按标签文章数量排序
  const sortedTags = [...mockTags].sort((a, b) => b.count - a.count);
  
  // 返回前limit个
  return { data: sortedTags.slice(0, limit) };
};

const getArticleTags = async (articleId) => {
  await delay(300);
  
  const tags = mockArticleTags[articleId] || [];
  
  return { data: tags };
};

const getArticlesByTag = async (tagName, params = {}) => {
  await delay(600);
  
  // 这里应该返回带有文章详情的数据
  // 为简化，我们只返回文章ID列表
  const articleIds = [];
  
  // 查找包含该标签的所有文章
  for (const [articleId, tags] of Object.entries(mockArticleTags)) {
    if (tags.includes(tagName)) {
      articleIds.push(articleId);
    }
  }
  
  return { 
    data: {
      articles: articleIds,
      total: articleIds.length
    }
  };
};

export const useTagStore = defineStore('tag', () => {
  // 状态
  const tags = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // 方法
  const fetchTags = async () => {
    loading.value = true;
    try {
      const response = await getTags();
      tags.value = response.data || [];
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const fetchPopularTags = async (limit) => {
    loading.value = true;
    try {
      const response = await getPopularTags(limit);
      tags.value = response.data || [];
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const fetchArticleTags = async (articleId) => {
    loading.value = true;
    try {
      const response = await getArticleTags(articleId);
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  const fetchArticlesByTag = async (tagName, params) => {
    loading.value = true;
    try {
      const response = await getArticlesByTag(tagName, params);
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
  
  return {
    tags,
    loading,
    error,
    fetchTags,
    fetchPopularTags,
    fetchArticleTags,
    fetchArticlesByTag
  };
});