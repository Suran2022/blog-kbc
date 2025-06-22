import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getCategories as getCategoriesApi, getCategoryById as getCategoryByIdApi, createCategory as createCategoryApi, updateCategory as updateCategoryApi, deleteCategory as deleteCategoryApi } from '../api/category';

// 临时分类数据，仅在API连接失败时使用
let fallbackCategories = [
  {
    id: '1',
    name: '技术',
    description: '技术相关文章',
    type: 'primary',
    order: 1,
    articleCount: 10
  },
  {
    id: '2',
    name: '生活',
    description: '生活随笔',
    type: 'success',
    order: 2,
    articleCount: 5
  },
  {
    id: '3',
    name: '读书',
    description: '读书笔记和书评',
    type: 'warning',
    order: 3,
    articleCount: 3
  },
  {
    id: '4',
    name: '旅行',
    description: '旅行见闻',
    type: 'danger',
    order: 4,
    articleCount: 2
  }
];

// 获取分类列表
const getCategories = async () => {
  try {
    const response = await getCategoriesApi();
    return response;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    // 使用备用数据
    return { data: [...fallbackCategories] };
  }
};

const getCategoryById = async (id) => {
  try {
    const response = await getCategoryByIdApi(id);
    return response;
  } catch (error) {
    console.error('获取分类详情失败:', error);
    // 使用备用数据
    const category = fallbackCategories.find(item => item.id === id);
    if (!category) {
      throw new Error('分类不存在');
    }
    return { data: { ...category } };
  }
};

const createCategory = async (categoryData) => {
  try {
    const response = await createCategoryApi(categoryData);
    return response;
  } catch (error) {
    console.error('创建分类失败:', error);
    throw error;
  }
};

const updateCategory = async (id, categoryData) => {
  try {
    const response = await updateCategoryApi(id, categoryData);
    return response;
  } catch (error) {
    console.error('更新分类失败:', error);
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    const response = await deleteCategoryApi(id);
    return response;
  } catch (error) {
    console.error('删除分类失败:', error);
    throw error;
  }
};

export const useCategoryStore = defineStore('category', () => {
  // 状态
  const categories = ref([]);
  const currentCategory = ref(null);
  const loading = ref(false);
  const error = ref(null);
  
  // 计算属性
  const getCategoryById = (id) => {
    return categories.value.find(category => category.id === id);
  };
  
  // 方法

  const fetchCategories = async () => {
    loading.value = true;
      try {
        const response = await getCategories();
        categories.value = response.data;
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
    }
    
  const fetchCategoryById = async (id) => {
    loading.value = true;
    console.log('获取分类详情，ID:', id);
    try {
      // 注意这里调用的是函数而不是方法
      const response = await getCategoryByIdApi(id);
      console.log('获取到的分类详情:', response.data);
      currentCategory.value = response.data;
      loading.value = false;
      return Promise.resolve(response);
    } catch (error) {
      error.value = error.message;
      loading.value = false;
      return Promise.reject(error);
    }
  }
    
  const createCategory = async (categoryData) => {
    loading.value = true;
      try {
        const response = await createCategoryApi(categoryData);
        // 添加到本地状态
        categories.value.push(response.data);
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
    }
    
  const updateCategory = async (id, categoryData) => {
    loading.value = true;
      try {
        const response = await updateCategoryApi(id, categoryData);
        
        // 更新本地状态
        if (currentCategory.value && currentCategory.value.id === id) {
          currentCategory.value = response.data;
        }
        
        const index = categories.value.findIndex(category => category.id === id);
        if (index !== -1) {
          categories.value[index] = response.data;
        }
        
        loading.value = false;
        return Promise.resolve(response);
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
    }
    
  const deleteCategory = async (id) => {
    loading.value = true;
      try {
        await deleteCategoryApi(id);
        
        // 更新本地状态
        categories.value = categories.value.filter(category => category.id !== id);
        if (currentCategory.value && currentCategory.value.id === id) {
          currentCategory.value = null;
        }
        
        loading.value = false;
        return Promise.resolve();
      } catch (error) {
        error.value = error.message;
        loading.value = false;
        return Promise.reject(error);
      }
  };
  
  return {
    categories,
    currentCategory,
    loading,
    error,
    getCategoryById,
    fetchCategories,
    fetchCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
  };
});