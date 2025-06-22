<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '../../utils';
import { Calendar, Collection, View } from '@element-plus/icons-vue';

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
});

const router = useRouter();

// 格式化日期
const formattedDate = computed(() => {
  return formatDate(props.article.createdAt);
});

// 跳转到分类文章列表
const goToCategoryArticles = () => {
  if (!props.article.category) return;
  
  router.push({
    name: 'CategoryArticles',
    params: { id: props.article.category.id }
  });
};

// 跳转到标签搜索结果
const goToTagArticles = (tag) => {
  router.push({
    name: 'SearchResults',
    query: { tag: tag }
  });
};
</script>

<template>
  <div class="article-detail">
    <div class="article-header">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
        <span class="article-date">
          <el-icon><Calendar /></el-icon>
          {{ formattedDate }}
        </span>
        <span 
          v-if="article.category" 
          class="article-category"
          @click="goToCategoryArticles"
        >
          <el-icon><Collection /></el-icon>
          {{ article.category.name }}
        </span>
        <span class="article-views">
          <el-icon><View /></el-icon>
          {{ article.views }} 阅读
        </span>
      </div>
    </div>
    
    <div class="article-content" v-html="article.content"></div>
    
    <div class="article-tags" v-if="article.tags && article.tags.length > 0">
      <span class="tags-label">标签：</span>
      <el-tag 
        v-for="tag in article.tags" 
        :key="tag"
        size="small"
        effect="plain"
        class="article-tag"
        @click="goToTagArticles(tag)"
      >
        {{ tag }}
      </el-tag>
    </div>
  </div>
</template>

<style scoped>
.article-detail {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(94, 114, 228, 0.08);
  padding: 40px;
  transition: all 0.3s ease;
}

.article-detail:hover {
  box-shadow: 0 8px 25px rgba(94, 114, 228, 0.12);
}

.article-header {
  margin-bottom: 40px;
  border-bottom: 2px solid #f0f2f5;
  padding-bottom: 25px;
  position: relative;
}

.article-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 2px;
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 20px 0;
  line-height: 1.3;
  background: linear-gradient(135deg, #2c3e50, #34495e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #6c757d;
  gap: 24px;
}

.article-meta span {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  background: rgba(94, 114, 228, 0.05);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.article-meta span:hover {
  background: rgba(94, 114, 228, 0.1);
  transform: translateY(-1px);
}

.article-meta .el-icon {
  margin-right: 6px;
  color: #5e72e4;
}

.article-category {
  cursor: pointer;
  transition: color 0.3s;
}

.article-category:hover {
  color: #409EFF;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 40px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
}

.article-content :deep(pre) {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  padding: 20px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 20px 0;
  border: 1px solid #dee2e6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.article-content :deep(blockquote) {
  border-left: 4px solid #5e72e4;
  padding: 15px 20px;
  color: #495057;
  background: linear-gradient(135deg, rgba(94, 114, 228, 0.05), rgba(94, 114, 228, 0.02));
  margin: 20px 0;
  border-radius: 0 8px 8px 0;
  position: relative;
  font-style: italic;
}

.article-content :deep(blockquote::before) {
  content: '"';
  font-size: 48px;
  color: #5e72e4;
  position: absolute;
  top: -10px;
  left: 15px;
  opacity: 0.3;
}

.article-content :deep(h1),
.article-content :deep(h2),
.article-content :deep(h3),
.article-content :deep(h4),
.article-content :deep(h5),
.article-content :deep(h6) {
  margin-top: 20px;
  margin-bottom: 15px;
  font-weight: bold;
  color: #303133;
}

.article-content :deep(a) {
  color: #409EFF;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
}

.article-content :deep(th) {
  background-color: #f5f7fa;
}

.article-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding-top: 25px;
  border-top: 2px solid #f0f2f5;
  gap: 12px;
}

.tags-label {
  color: #495057;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.tags-label::before {
  content: '#';
  color: #5e72e4;
  font-weight: bold;
  margin-right: 4px;
}

.article-tag {
  cursor: pointer;
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border: 1px solid #dee2e6;
  transition: all 0.3s ease;
  font-weight: 500;
}

.article-tag:hover {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.3);
  border-color: transparent;
}
</style>