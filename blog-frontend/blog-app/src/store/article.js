import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getArticles as getArticlesApi, getArticleById as getArticleByIdApi, createArticle as createArticleApi, updateArticle as updateArticleApi, deleteArticle as deleteArticleApi, getArticlesByCategory as getArticlesByCategoryApi } from '../api/article';

// 临时文章数据，仅在API连接失败时使用
let fallbackArticles = [
  {
    id: '1',
    title: '如何使用Vue 3和Vite构建现代化前端应用',
    content: '# 如何使用Vue 3和Vite构建现代化前端应用\n\n本文将介绍如何使用Vue 3和Vite构建现代化前端应用。Vue 3提供了更好的性能和更小的包体积，而Vite则提供了极速的开发体验。\n\n## 为什么选择Vue 3和Vite\n\nVue 3是Vue.js的最新版本，它带来了许多重大改进：\n\n- 更好的性能\n- 更小的包体积\n- Composition API\n- 更好的TypeScript支持\n\nVite是一个由Vue.js的创建者尤雨溪开发的构建工具，它具有以下特点：\n\n- 极速的服务器启动\n- 快速的模块热更新\n- 优化的构建\n- 开箱即用的各种功能\n\n## 开始使用\n\n首先，我们需要创建一个新的Vite项目：\n\n```bash\nnpm create vite@latest my-vue-app -- --template vue\ncd my-vue-app\nnpm install\nnpm run dev\n```\n\n这样就创建了一个基本的Vue 3 + Vite项目。',
    summary: 'Vue 3和Vite是构建现代化前端应用的强大组合，本文介绍了它们的优势和基本使用方法。',
    createdAt: '2023-05-15T08:00:00.000Z',
    updatedAt: '2023-05-15T10:30:00.000Z',
    category: {
      id: '1',
      name: '技术',
      type: 'primary'
    },
    tags: ['Vue', 'Vite', '前端'],
    views: 1024,
    status: 'published'
  },
  {
    id: '2',
    title: '使用Element Plus构建企业级后台管理系统',
    content: '# 使用Element Plus构建企业级后台管理系统\n\n本文将介绍如何使用Element Plus构建企业级后台管理系统。Element Plus是一套基于Vue 3的组件库，它提供了丰富的组件和主题定制能力。\n\n## Element Plus简介\n\nElement Plus是Element UI的Vue 3版本，它继承了Element UI的设计风格和组件，同时针对Vue 3进行了重写和优化。它提供了以下特性：\n\n- 丰富的组件\n- 可定制的主题\n- 国际化支持\n- 响应式设计\n\n## 安装和使用\n\n首先，我们需要安装Element Plus：\n\n```bash\nnpm install element-plus\n```\n\n然后在main.js中引入：\n\n```javascript\nimport { createApp } from \'vue\'\nimport ElementPlus from \'element-plus\'\nimport \'element-plus/dist/index.css\'\nimport App from \'./App.vue\'\n\nconst app = createApp(App)\napp.use(ElementPlus)\napp.mount(\'#app\')\n```',
    summary: 'Element Plus是基于Vue 3的组件库，本文介绍了如何使用它构建企业级后台管理系统。',
    createdAt: '2023-06-20T09:15:00.000Z',
    updatedAt: '2023-06-20T11:45:00.000Z',
    category: {
      id: '1',
      name: '技术',
      type: 'primary'
    },
    tags: ['Vue', 'Element Plus', '后台管理'],
    views: 768,
    status: 'published'
  },
  {
    id: '3',
    title: '我的旅行日记：探索云南',
    content: '# 我的旅行日记：探索云南\n\n上个月，我有幸前往云南旅行，领略了这个美丽省份的自然风光和人文魅力。\n\n## 昆明：春城之美\n\n昆明是云南的省会，被称为"春城"，因为这里四季如春，气候宜人。我在昆明游览了著名的滇池和云南民族村，感受到了云南多元文化的魅力。\n\n## 大理：古城与洱海\n\n大理古城保存完好，白族建筑风格独特。洱海的美景令人陶醉，特别是日落时分，金色的阳光洒在湖面上，美不胜收。\n\n## 丽江：艳遇之都\n\n丽江古城是UNESCO世界文化遗产，纳西族的东巴文化和水系建筑令人印象深刻。晚上的丽江古城灯火辉煌，酒吧街热闹非凡。\n\n## 香格里拉：心灵的净土\n\n香格里拉的自然风光壮丽，藏族文化浓厚。松赞林寺是云南最大的藏传佛教寺院，金碧辉煌，庄严肃穆。',
    summary: '记录了一次云南之旅，分享了昆明、大理、丽江和香格里拉的旅行见闻和感受。',
    createdAt: '2023-07-10T14:30:00.000Z',
    updatedAt: '2023-07-10T16:00:00.000Z',
    category: {
      id: '4',
      name: '旅行',
      type: 'danger'
    },
    tags: ['云南', '旅行', '风景'],
    views: 512,
    status: 'published'
  },
  {
    id: '4',
    title: '《百年孤独》读后感',
    content: '# 《百年孤独》读后感\n\n最近读完了加西亚·马尔克斯的《百年孤独》，这部魔幻现实主义的经典之作给我留下了深刻的印象。\n\n## 布恩迪亚家族的命运\n\n小说讲述了布恩迪亚家族七代人的故事，从何塞·阿尔卡蒂奥·布恩迪亚创建马孔多镇开始，到最后一个布恩迪亚被蚂蚁吃掉为止。家族的历史充满了重复的名字和性格，似乎命运早已注定。\n\n## 孤独的主题\n\n正如书名所示，"孤独"是贯穿全书的主题。每个角色都以自己的方式经历着孤独，无论是乌尔苏拉的坚韧，还是奥雷里亚诺上校的固执，或是雷梅黛丝的超脱。\n\n## 魔幻与现实的交织\n\n马尔克斯将魔幻元素自然地融入现实生活中，飞上天空的美丽少女，活了几个世纪的吉普赛人，跟随一个人一生的黄蝴蝶，这些元素使小说充满了奇幻色彩，却又不失真实感。\n\n## 循环的历史\n\n小说中的时间似乎是循环的，历史不断重复，人物命运相似。这种循环暗示了人类历史的普遍性，也反映了拉丁美洲国家的历史现实。',
    summary: '分享了阅读加西亚·马尔克斯的《百年孤独》后的感悟，探讨了小说中的孤独主题、魔幻现实主义手法和循环历史观。',
    createdAt: '2023-08-05T19:45:00.000Z',
    updatedAt: '2023-08-05T21:15:00.000Z',
    category: {
      id: '3',
      name: '读书',
      type: 'warning'
    },
    tags: ['读书', '文学', '马尔克斯'],
    views: 384,
    status: 'published'
  },
  {
    id: '5',
    title: '健康饮食与生活方式',
    content: '# 健康饮食与生活方式\n\n在现代快节奏的生活中，保持健康的饮食和生活方式变得尤为重要。本文将分享一些简单实用的健康生活建议。\n\n## 均衡饮食\n\n均衡的饮食应包含适量的蛋白质、碳水化合物、健康脂肪、维生素和矿物质。尽量选择全食物，减少加工食品的摄入。\n\n- 多吃蔬菜水果\n- 选择全谷物\n- 适量摄入优质蛋白质\n- 限制糖和盐的摄入\n\n## 规律作息\n\n保持规律的作息时间对身体健康至关重要。成年人应每晚保证7-8小时的睡眠，并尽量在固定时间入睡和起床。\n\n## 适当运动\n\n每周至少进行150分钟的中等强度有氧运动，如快走、游泳或骑自行车。同时，每周进行两次以上的肌肉强化训练。\n\n## 心理健康\n\n不要忽视心理健康的重要性。学会管理压力，保持积极的心态，必要时寻求专业帮助。冥想和深呼吸练习可以帮助缓解压力和焦虑。',
    summary: '分享了保持健康生活方式的建议，包括均衡饮食、规律作息、适当运动和心理健康管理。',
    createdAt: '2023-09-12T10:20:00.000Z',
    updatedAt: '2023-09-12T12:50:00.000Z',
    category: {
      id: '2',
      name: '生活',
      type: 'success'
    },
    tags: ['健康', '饮食', '生活方式'],
    views: 256,
    status: 'published'
  }
];

// 注意：我们不再需要这个中间函数，因为它只是简单地调用了getArticlesApi函数
// 以下是原来的备用数据处理逻辑，我们保留它以备不时之需
/*
const handleFallbackArticles = (params = {}) => {
  const { page = 1, limit = 10, keyword, categoryId, sort } = params;
  
  // 筛选文章
  let filteredArticles = [...fallbackArticles];
    
    // 关键词搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredArticles = filteredArticles.filter(article => 
      article.title.toLowerCase().includes(lowerKeyword) || 
      article.content.toLowerCase().includes(lowerKeyword) ||
      article.summary.toLowerCase().includes(lowerKeyword)
    );
  }
  
  // 分类筛选
  if (categoryId) {
    filteredArticles = filteredArticles.filter(article => 
      article.category && article.category.id === categoryId
    );
  }
  
  // 排序
  if (sort) {
    const [field, order] = sort.split(':');
    filteredArticles.sort((a, b) => {
      if (order === 'desc') {
        return field === 'createdAt' 
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : b[field] - a[field];
      } else {
        return field === 'createdAt' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : a[field] - b[field];
      }
    });
  }
  
  // 计算总数
  const total = filteredArticles.length;
  
  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
  
  return {
    data: {
      list: paginatedArticles,
      total,
      page,
      limit
    }
  };
};
*/

// 注意：我们不再需要这些中间函数，因为它们只是简单地调用了API函数
// 直接在store中使用带Api后缀的函数

// 注意：我们不再需要这些中间函数，因为它们只是简单地调用了getArticles函数
// 而getArticles函数已经被修改为直接调用getArticlesApi

export const useArticleStore = defineStore('article', () => {
  // 状态
  const articles = ref([]);
  const currentArticle = ref(null);
  const total = ref(0);
  const loading = ref(false);
  const error = ref(null);
  
  // 计算属性
  const getArticleById = (id) => {
    return articles.value.find(article => article.id === id);
  };
  
  // 方法

  const fetchArticles = async (params) => {
    loading.value = true;
      try {
        // 直接使用getArticlesApi
        const response = await getArticlesApi(params);
        articles.value = response.data.list;
        total.value = response.data.total;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
    
  const fetchArticleById = async (id) => {
    loading.value = true;
    try {
      // 使用导入的API函数，而不是外部的getArticleById函数
      const response = await getArticleByIdApi(id);
      currentArticle.value = response.data;
      loading.value = false;
      return Promise.resolve(response.data);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  };
    
  const addArticle = async (articleData) => {
    loading.value = true;
      try {
        // 直接调用API函数，而不是外部的createArticle函数
        const response = await createArticleApi(articleData);
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
    
  const editArticle = async (id, articleData) => {
    loading.value = true;
      try {
        // 直接调用API函数，而不是外部的updateArticle函数
        const response = await updateArticleApi(id, articleData);
        loading.value = false;
        
        // 更新本地状态
        if (currentArticle.value && currentArticle.value.id === id) {
          currentArticle.value = response.data;
        }
        
        const index = articles.value.findIndex(article => article.id === id);
        if (index !== -1) {
          articles.value[index] = response.data;
        }
        
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
    
  const removeArticle = async (id) => {
    loading.value = true;
      try {
        // 直接调用API函数，而不是外部的deleteArticle函数
        await deleteArticleApi(id);
        
        // 更新本地状态
        articles.value = articles.value.filter(article => article.id !== id);
        if (currentArticle.value && currentArticle.value.id === id) {
          currentArticle.value = null;
        }
        
        loading.value = false;
        return Promise.resolve();
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
    
  const fetchArticlesByCategory = async (categoryId, params = {}) => {
    loading.value = true;
      try {
        // 使用通用文章API，传递category参数
        const queryParams = { ...params, category: categoryId };
        const response = await getArticlesApi(queryParams);
        articles.value = response.data.list;
        total.value = response.data.total;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
    
  const searchArticlesByKeyword = async (keyword, params = {}) => {
    loading.value = true;
      try {
        // 直接使用getArticlesApi，传入keyword参数
        const queryParams = { ...params, keyword };
        const response = await getArticlesApi(queryParams);
        articles.value = response.data.list;
        total.value = response.data.total;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
  
  return {
    articles,
    currentArticle,
    total,
    loading,
    error,
    getArticleById,
    fetchArticles,
    fetchArticleById,
    addArticle,
    editArticle,
    removeArticle,
    fetchArticlesByCategory,
    searchArticlesByKeyword
  };
});