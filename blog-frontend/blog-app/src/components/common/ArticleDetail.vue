<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '../../utils';

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
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.article-header {
  margin-bottom: 30px;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 20px;
}

.article-title {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 15px 0;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 14px;
  color: #909399;
}

.article-meta span {
  display: flex;
  align-items: center;
  margin-right: 20px;
}

.article-meta .el-icon {
  margin-right: 4px;
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
  color: #303133;
  margin-bottom: 30px;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
  border-radius: 4px;
}

.article-content :deep(pre) {
  background-color: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 15px 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #409EFF;
  padding: 10px 15px;
  color: #606266;
  background-color: #f5f7fa;
  margin: 15px 0;
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
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.tags-label {
  margin-right: 10px;
  color: #606266;
  font-size: 14px;
}

.article-tag {
  margin-right: 10px;
  margin-bottom: 5px;
  cursor: pointer;
}

.article-tag:hover {
  transform: translateY(-2px);
}
</style>