<script setup>
import { ref, onMounted } from 'vue';
import { useCategoryStore } from '../../store/category';
import CategoryEditor from '../../components/admin/CategoryEditor.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

const categoryStore = useCategoryStore();

// 分类列表
const categories = ref([]);
// 加载状态
const loading = ref(false);
// 对话框可见性
const dialogVisible = ref(false);
// 当前编辑的分类
const currentCategory = ref(null);
// 对话框标题
const dialogTitle = ref('添加分类');

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true;
  try {
    await categoryStore.fetchCategories();
    categories.value = categoryStore.categories;
  } catch (error) {
    console.error('获取分类列表失败:', error);
    ElMessage.error('获取分类列表失败');
  } finally {
    loading.value = false;
  }
};

// 添加分类
const addCategory = () => {
  currentCategory.value = null;
  dialogTitle.value = '添加分类';
  dialogVisible.value = true;
};

// 编辑分类
const editCategory = (category) => {
  console.log('编辑分类:', category);
  currentCategory.value = { ...category };
  console.log('设置当前分类:', currentCategory.value);
  dialogTitle.value = '编辑分类';
  dialogVisible.value = true;
};

// 删除分类
const deleteCategory = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这个分类吗？此操作不可恢复', '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });
    
    await categoryStore.deleteCategory(id);
    ElMessage.success('删除成功');
    fetchCategories();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除分类失败:', error);
      ElMessage.error('删除分类失败');
    }
  }
};

// 处理保存成功
const handleSaveSuccess = () => {
  dialogVisible.value = false;
  fetchCategories();
};

// 处理取消
const handleCancel = () => {
  dialogVisible.value = false;
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="category-management-container">
    <div class="page-header">
      <h2 class="page-title">分类管理</h2>
      <el-button type="primary" @click="addCategory">
        <el-icon><Plus /></el-icon>添加分类
      </el-button>
    </div>
    
    <!-- 分类列表 -->
    <el-card shadow="never" class="category-list-card">
      <el-table
        v-loading="loading"
        :data="categories"
        style="width: 100%"
        :header-cell-style="{ background: '#f5f7fa' }"
      >
        <el-table-column prop="name" label="分类名称" min-width="200">
          <template #default="{ row }">
            <el-tag :type="row.type || 'info'" effect="plain">
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="描述" min-width="300" show-overflow-tooltip />
        
        <el-table-column prop="articleCount" label="文章数" width="100" align="center" />
        
        <el-table-column prop="sort" label="排序" width="100" align="center" />
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="editCategory(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="deleteCategory(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-empty v-if="!loading && categories.length === 0" description="暂无分类" />
    </el-card>
    
    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      destroy-on-close
    >
      <CategoryEditor
        :category="currentCategory"
        @save-success="handleSaveSuccess"
        @cancel="handleCancel"
      />
    </el-dialog>
  </div>
</template>

<style scoped>
.category-management-container {
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

.category-list-card {
  margin-bottom: 20px;
}
</style>