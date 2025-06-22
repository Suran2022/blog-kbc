<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { PriceTag } from '@element-plus/icons-vue';

const props = defineProps({
  title: {
    type: String,
    default: '标签云'
  },
  tags: {
    type: Array,
    default: () => []
  }
});

const router = useRouter();
const loading = ref(false);

// 标签颜色列表
const tagTypes = ['primary', 'success', 'info', 'warning', 'danger', ''];

// 随机获取标签类型
const getRandomTagType = () => {
  const index = Math.floor(Math.random() * tagTypes.length);
  return tagTypes[index];
};

// 跳转到标签文章列表页
const goToTagArticles = (tag) => {
  router.push({
    name: 'SearchResults',
    query: { tag: tag.name }
  });
};

// 根据标签文章数量计算字体大小
const getTagSize = (count) => {
  if (!count) return 12;
  const minSize = 12;
  const maxSize = 18;
  const maxCount = Math.max(...props.tags.map(tag => tag.count || 0));
  const minCount = Math.min(...props.tags.map(tag => tag.count || 0));
  
  if (maxCount === minCount) return minSize;
  
  const ratio = (count - minCount) / (maxCount - minCount);
  return Math.round(minSize + (maxSize - minSize) * ratio);
};
</script>

<template>
  <div class="tag-cloud-container">
    <h3 class="tag-cloud-title">
      <el-icon><PriceTag /></el-icon>
      {{ title }}
    </h3>
    <el-skeleton :rows="3" animated v-if="loading" />
    <div v-else-if="tags.length > 0" class="tag-cloud">
      <div
        v-for="tag in tags"
        :key="tag.id || tag.name"
        class="tag-item"
        @click="goToTagArticles(tag)"
        :style="{ fontSize: getTagSize(tag.count) + 'px' }"
      >
        <span class="tag-name"># {{ tag.name }}</span>
        <span class="tag-count" v-if="tag.count !== undefined">
          {{ tag.count }}
        </span>
      </div>
    </div>
    <el-empty v-else description="暂无标签" :image-size="60" />
  </div>
</template>

<style scoped>
.tag-cloud-container {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.tag-cloud-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15);
  transform: translateY(-2px);
}

.tag-cloud-title {
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

.tag-cloud-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 3px;
}

.tag-cloud-title .el-icon {
  color: #5e72e4;
  font-size: 20px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 1px solid #dee2e6;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #495057;
  user-select: none;
}

.tag-item:hover {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
  border-color: transparent;
}

.tag-name {
  font-weight: 600;
}

.tag-count {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  transition: all 0.3s ease;
}

.tag-item:hover .tag-count {
  background: rgba(255, 255, 255, 0.3);
  color: white;
}
</style>