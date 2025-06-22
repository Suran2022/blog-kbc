<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCategoryStore } from '../../store/category';

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
    <h3 class="category-list-title">{{ title }}</h3>
    <el-divider />
    <el-skeleton :rows="5" animated v-if="loading" />
    <div v-else-if="categoryStore.categories.length > 0" class="category-list">
      <div 
        v-for="category in categoryStore.categories" 
        :key="category.id"
        class="category-item"
        @click="goToCategoryArticles(category.id)"
      >
        <el-tag :type="category.type || 'info'" effect="plain">
          {{ category.name }}
          <span class="category-count" v-if="category.articleCount !== undefined">
            ({{ category.articleCount }})
          </span>
        </el-tag>
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
  margin: 0 0 12px 0;
  position: relative;
  padding-bottom: 8px;
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

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-item {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 5px;
}

.category-item:hover {
  transform: translateY(-2px);
}

.category-item .el-tag {
  transition: all 0.3s ease;
  font-size: 13px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
}

.category-item:hover .el-tag {
  box-shadow: 0 3px 8px rgba(94, 114, 228, 0.2);
}

.category-count {
  font-size: 12px;
  margin-left: 2px;
}
</style>