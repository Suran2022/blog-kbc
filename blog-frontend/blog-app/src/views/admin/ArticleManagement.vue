<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useArticleStore } from '../../store/article';
import { useCategoryStore } from '../../store/category';

const router = useRouter();
const articleStore = useArticleStore();
const categoryStore = useCategoryStore();

// 文章列表
const articles = ref([]);
// 总数
const total = ref(0);
// 加载状态
const loading = ref(false);
// 搜索关键词
const searchKeyword = ref('');
// 选中的分类ID
const selectedCategory = ref('');
// 选中的状态
const selectedStatus = ref('');

// 分页参数
const pagination = ref({
  page: 1,
  limit: 10
});

// 获取分类列表
onMounted(async () => {
  await categoryStore.fetchCategories();
  fetchArticles();
});

// 分类列表
const categories = computed(() => {
  return [{ id: '', name: '全部分类' }, ...categoryStore.categories];
});

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      keyword: searchKeyword.value,
      categoryId: selectedCategory.value,
      status: selectedStatus.value || undefined
    };
    
    const response = await articleStore.fetchArticles(params);
    articles.value = response.data?.list || [];
    total.value = response.data?.total || 0;
  } catch (error) {
    console.error('获取文章列表失败:', error);
    ElMessage.error('获取文章列表失败');
  } finally {
    loading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page) => {
  pagination.value.page = page;
  fetchArticles();
};

// 处理每页条数变化
const handleSizeChange = (size) => {
  pagination.value.limit = size;
  pagination.value.page = 1;
  fetchArticles();
};

// 处理搜索
const handleSearch = () => {
  pagination.value.page = 1;
  fetchArticles();
};

// 处理分类筛选
const handleCategoryChange = () => {
  pagination.value.page = 1;
  fetchArticles();
};

// 重置筛选
const resetFilter = () => {
  searchKeyword.value = '';
  selectedCategory.value = '';
  selectedStatus.value = '';
  pagination.value.page = 1;
  fetchArticles();
};

// 处理状态筛选
const handleStatusChange = () => {
  pagination.value.page = 1;
  fetchArticles();
};

// 创建文章
const createArticle = () => {
  router.push({ name: 'ArticleCreate' });
};

// 编辑文章
const editArticle = (id) => {
  router.push({ name: 'ArticleEdit', params: { id } });
};

// 删除文章
const deleteArticle = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？此操作不可恢复', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await articleStore.deleteArticle(id);
    ElMessage.success('删除成功');
    fetchArticles();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除文章失败:', error);
      ElMessage.error('删除文章失败');
    }
  }
};

// 预览文章
const previewArticle = (id) => {
  window.open(`/article/${id}`, '_blank');
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

// 文章状态标签类型
const getStatusType = (status) => {
  const types = {
    1: 'success',  // 已发布
    0: 'info'      // 草稿
  };
  return types[status] || 'info';
};

// 文章状态显示文本
const getStatusText = (status) => {
  const texts = {
    1: '已发布',
    0: '草稿'
  };
  return texts[status] || '未知';
};

// 状态选项
const statusOptions = [
  { value: '', label: '全部状态' },
  { value: 1, label: '已发布' },
  { value: 0, label: '草稿' }
];
</script>

<template>
  <div class="article-management-container">
    <div class="page-header">
      <h2 class="page-title">文章管理</h2>
      <el-button type="primary" @click="createArticle">
        <el-icon><Plus /></el-icon>写文章
      </el-button>
    </div>
    
    <!-- 筛选栏 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" class="filter-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchKeyword"
            placeholder="标题/内容"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="分类">
          <el-select
            v-model="selectedCategory"
            placeholder="选择分类"
            clearable
            @change="handleCategoryChange"
          >
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select
            v-model="selectedStatus"
            placeholder="选择状态"
            clearable
            @change="handleStatusChange"
          >
            <el-option
              v-for="option in statusOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>搜索
          </el-button>
          <el-button @click="resetFilter">
            <el-icon><RefreshRight /></el-icon>重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 文章列表 -->
    <el-card shadow="never" class="article-list-card">
      <el-table
        v-loading="loading"
        :data="articles"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="title" label="标题" min-width="300">
          <template #default="{ row }">
            <el-link type="primary" :underline="false" @click="editArticle(row.id)">
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
        
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="views" label="浏览量" width="100" align="center" />
        
        <el-table-column prop="createdAt" label="发布时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createdAt) }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editArticle(row.id)">
              编辑
            </el-button>
            <el-button type="success" link @click="previewArticle(row.id)">
              预览
            </el-button>
            <el-button type="danger" link @click="deleteArticle(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.limit"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          background
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.article-management-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-title {
  font-size: 22px;
  color: #303133;
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  display: flex;
  flex-wrap: wrap;
}

.article-list-card {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .filter-form {
    flex-direction: column;
  }
  
  .filter-form .el-form-item {
    margin-right: 0;
  }
}
</style>