<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '../../store/category';
import { Collection, Folder, ArrowRight } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '文章分类'
  }
});

const router = useRouter();
const categoryStore = useCategoryStore();
const loading = ref(false);

// 获取分类列表
const fetchCategories = async () => {
  loading.value = true;
  try {
    await categoryStore.fetchCategories();
  } catch (error) {
    console.error('获取分类列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 跳转到分类文章列表页
const goToCategoryArticles = (categoryId) => {
  router.push({
    name: 'CategoryArticles',
    params: { id: categoryId }
  });
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="category-list-container">
    <h3 class="category-list-title">
      <el-icon><Collection /></el-icon>
      {{ title }}
    </h3>
    <el-skeleton :rows="5" animated v-if="loading" />
    <div v-else-if="categoryStore.categories.length > 0" class="category-list">
      <div 
        v-for="category in categoryStore.categories" 
        :key="category.id"
        class="category-item"
        @click="goToCategoryArticles(category.id)"
      >
        <div class="category-card">
          <div class="category-icon">
            <el-icon><Folder /></el-icon>
          </div>
          <div class="category-content">
            <div class="category-name">{{ category.name }}</div>
            <div class="category-count" v-if="category.articleCount !== undefined">
              {{ category.articleCount }} 篇文章
            </div>
          </div>
          <div class="category-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无分类" :image-size="60" />
  </div>
</template>

<style scoped>
.category-list-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.category-list-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.category-list-title {
  font-size: 18px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  padding-bottom: 12px;
}

.category-list-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.category-list-title .el-icon {
  color: #5e72e4;
  font-size: 20px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-card {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.category-item:hover .category-card {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
}

.category-icon {
  width: 32px;
  height: 32px;
  background: rgba(94, 114, 228, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.category-item:hover .category-icon {
  background: rgba(255, 255, 255, 0.2);
}

.category-icon .el-icon {
  color: #5e72e4;
  font-size: 16px;
  transition: color 0.3s ease;
}

.category-item:hover .category-icon .el-icon {
  color: white;
}

.category-content {
  flex: 1;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
  color: #32325d;
  margin-bottom: 2px;
  transition: color 0.3s ease;
}

.category-item:hover .category-name {
  color: white;
}

.category-count {
  font-size: 12px;
  color: #8898aa;
  transition: color 0.3s ease;
}

.category-item:hover .category-count {
  color: rgba(255, 255, 255, 0.8);
}

.category-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.category-item:hover .category-arrow {
  opacity: 1;
  transform: translateX(0);
}

.category-arrow .el-icon {
  color: white;
  font-size: 14px;
}
</style>