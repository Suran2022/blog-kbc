import { defineStore } from 'pinia';
import { ref } from 'vue';

// 模拟API请求延迟
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟贡献者数据
let mockContributors = [
  {
    id: '1',
    name: '张三',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    role: '前端开发',
    bio: '资深前端工程师，Vue.js核心贡献者',
    github: 'https://github.com/zhangsan',
    website: 'https://zhangsan.dev',
    email: 'zhangsan@example.com',
    contributions: ['前端架构设计', 'UI组件开发', '性能优化']
  },
  {
    id: '2',
    name: '李四',
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    role: '后端开发',
    bio: '全栈工程师，专注于Node.js和数据库优化',
    github: 'https://github.com/lisi',
    website: 'https://lisi.tech',
    email: 'lisi@example.com',
    contributions: ['API设计', '数据库架构', '服务器部署']
  },
  {
    id: '3',
    name: '王五',
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    role: 'UI设计',
    bio: '用户体验设计师，注重细节和用户友好性',
    github: 'https://github.com/wangwu',
    website: 'https://wangwu.design',
    email: 'wangwu@example.com',
    contributions: ['UI/UX设计', '交互原型', '品牌视觉']
  },
  {
    id: '4',
    name: '赵六',
    avatar: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    role: '测试工程师',
    bio: '质量保证专家，自动化测试领域资深从业者',
    github: 'https://github.com/zhaoliu',
    website: null,
    email: 'zhaoliu@example.com',
    contributions: ['自动化测试', '性能测试', '质量保证']
  },
  {
    id: '5',
    name: '钱七',
    avatar: 'https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png',
    role: '文档工程师',
    bio: '技术文档专家，擅长简化复杂概念',
    github: 'https://github.com/qianqi',
    website: 'https://qianqi.docs',
    email: 'qianqi@example.com',
    contributions: ['技术文档', '用户指南', '贡献者文档']
  }
];

// 模拟API
const getContributors = async () => {
  await delay(800);
  
  return { data: mockContributors };
};

const getContributorById = async (id) => {
  await delay(500);
  
  const contributor = mockContributors.find(item => item.id === id);
  
  if (!contributor) {
    throw new Error('贡献者不存在');
  }
  
  return { data: contributor };
};

const createContributor = async (data) => {
  await delay(800);
  
  const newContributor = {
    id: String(Date.now()),
    ...data
  };
  
  mockContributors.push(newContributor);
  
  return { data: newContributor };
};

const updateContributor = async (id, data) => {
  await delay(800);
  
  const index = mockContributors.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('贡献者不存在');
  }
  
  const updatedContributor = {
    ...mockContributors[index],
    ...data
  };
  
  mockContributors[index] = updatedContributor;
  
  return { data: updatedContributor };
};

const deleteContributor = async (id) => {
  await delay(800);
  
  const index = mockContributors.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error('贡献者不存在');
  }
  
  mockContributors.splice(index, 1);
  
  return { success: true };
};

// 定义贡献者Store
export const useContributorStore = defineStore('contributor', () => {
  // 状态
  const contributors = ref([]);
  const currentContributor = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // 获取所有贡献者
  const fetchContributors = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getContributors();
      contributors.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取贡献者列表失败';
      console.error('获取贡献者列表失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 根据ID获取贡献者
  const fetchContributorById = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await getContributorById(id);
      currentContributor.value = response.data;
      return response.data;
    } catch (err) {
      error.value = err.message || '获取贡献者详情失败';
      console.error('获取贡献者详情失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 创建贡献者
  const createNewContributor = async (data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await createContributor(data);
      contributors.value.push(response.data);
      return response.data;
    } catch (err) {
      error.value = err.message || '创建贡献者失败';
      console.error('创建贡献者失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 更新贡献者
  const updateExistingContributor = async (id, data) => {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await updateContributor(id, data);
      
      // 更新本地状态
      const index = contributors.value.findIndex(item => item.id === id);
      if (index !== -1) {
        contributors.value[index] = response.data;
      }
      
      // 如果当前正在查看的贡献者被更新，也更新currentContributor
      if (currentContributor.value && currentContributor.value.id === id) {
        currentContributor.value = response.data;
      }
      
      return response.data;
    } catch (err) {
      error.value = err.message || '更新贡献者失败';
      console.error('更新贡献者失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // 删除贡献者
  const removeContributor = async (id) => {
    loading.value = true;
    error.value = null;
    
    try {
      await deleteContributor(id);
      
      // 更新本地状态
      const index = contributors.value.findIndex(item => item.id === id);
      if (index !== -1) {
        contributors.value.splice(index, 1);
      }
      
      // 如果当前正在查看的贡献者被删除，清空currentContributor
      if (currentContributor.value && currentContributor.value.id === id) {
        currentContributor.value = null;
      }
      
      return { success: true };
    } catch (err) {
      error.value = err.message || '删除贡献者失败';
      console.error('删除贡献者失败:', err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  return {
    // 状态
    contributors,
    currentContributor,
    loading,
    error,
    
    // 操作
    fetchContributors,
    fetchContributorById,
    createNewContributor,
    updateExistingContributor,
    removeContributor
  };
});