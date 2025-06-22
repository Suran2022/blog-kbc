<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCategoryStore } from '../../store/category';
import { ElMessage } from 'element-plus';

const props = defineProps({
  categoryId: {
    type: [String, Number],
    default: null
  },
  category: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['save-success', 'cancel']);

const categoryStore = useCategoryStore();

// 表单数据
const categoryForm = ref({
  name: '',
  description: '',
  type: 'info', // 前端展示用
  sort: 0,
  status: 1 // 添加状态字段，默认为启用
});

// 表单规则
const rules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
};

// 表单引用
const formRef = ref(null);

// 加载状态
const loading = ref(false);
// 保存状态
const saving = ref(false);

// 标签类型选项
const tagTypes = [
  { label: '主要', value: 'primary' },
  { label: '成功', value: 'success' },
  { label: '信息', value: 'info' },
  { label: '警告', value: 'warning' },
  { label: '危险', value: 'danger' }
];

// 是否为编辑模式
const isEditMode = computed(() => !!props.categoryId || !!props.category);

// 页面标题
const pageTitle = computed(() => isEditMode.value ? '编辑分类' : '创建分类');

// 获取分类详情
const fetchCategoryDetail = async () => {
  if (!props.categoryId && !props.category) return;
  
  loading.value = true;
  try {
    if (props.category) {
      // 如果直接传入了category对象，直接使用
      categoryForm.value = {
        name: props.category.name || '',
        description: props.category.description || '',
        type: props.category.type || 'info',
        sort: props.category.sort || 0,
        status: props.category.status !== undefined ? props.category.status : 1
      };
    } else {
      // 否则通过ID获取
      await categoryStore.fetchCategoryById(props.categoryId);
      const category = categoryStore.currentCategory;
      
      if (category) {
        categoryForm.value = {
          name: category.name || '',
          description: category.description || '',
          type: category.type || 'info',
          sort: category.sort || 0,
          status: category.status !== undefined ? category.status : 1
        };
      }
    }
  } catch (error) {
    console.error('获取分类详情失败:', error);
    ElMessage.error('获取分类详情失败');
  } finally {
    loading.value = false;
  }
};

// 保存分类
const saveCategory = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return;
    
    saving.value = true;
    try {
      // 创建一个新对象，只包含后端需要的字段
      const categoryData = {
        name: categoryForm.value.name,
        description: categoryForm.value.description,
        sort: categoryForm.value.sort,
        status: categoryForm.value.status
      };
      
      // 添加更详细的日志
      console.log('编辑模式:', isEditMode.value);
      console.log('分类ID:', props.categoryId);
      console.log('分类对象:', props.category);
      console.log('提交的分类数据:', categoryData);
      
      if (isEditMode.value) {
        // 使用category.id或categoryId
        const id = props.category ? props.category.id : props.categoryId;
        console.log('更新分类ID:', id);
        await categoryStore.updateCategory(id, categoryData);
        ElMessage.success('分类更新成功');
      } else {
        await categoryStore.createCategory(categoryData);
        ElMessage.success('分类创建成功');
      }
      
      emit('save-success');
    } catch (error) {
      console.error('保存分类失败:', error);
      ElMessage.error('保存分类失败，请稍后重试');
    } finally {
      saving.value = false;
    }
  });
};

// 取消编辑
const cancelEdit = () => {
  emit('cancel');
};

onMounted(() => {
  fetchCategoryDetail();
});
</script>

<template>
  <div class="category-editor">
    <div class="editor-header">
      <h2>{{ pageTitle }}</h2>
    </div>
    
    <el-skeleton :rows="4" animated v-if="loading" />
    
    <el-form
      v-else
      ref="formRef"
      :model="categoryForm"
      :rules="rules"
      label-position="top"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
      </el-form-item>
      
      <el-form-item label="分类描述">
        <el-input
          v-model="categoryForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入分类描述"
        />
      </el-form-item>
      
      <el-form-item label="分类样式">
        <el-select v-model="categoryForm.type" placeholder="请选择分类样式" style="width: 100%">
          <el-option
            v-for="type in tagTypes"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          >
            <el-tag :type="type.value" effect="plain">{{ type.label }}</el-tag>
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="排序">
        <el-input-number v-model="categoryForm.sort" :min="0" :max="999" />
        <div class="sort-hint">数字越小排序越靠前</div>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="saveCategory" :loading="saving">
          {{ isEditMode ? '更新分类' : '创建分类' }}
        </el-button>
        <el-button @click="cancelEdit">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.category-editor {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.editor-header {
  margin-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
}

.editor-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.sort-hint {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}
</style>