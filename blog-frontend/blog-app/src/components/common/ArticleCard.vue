<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDate } from '../../utils';

const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  showSummary: {
    type: Boolean,
    default: true
  }
});

const router = useRouter();

// 格式化日期
const formattedDate = computed(() => {
  return formatDate(props.article.createdAt);
});

// 跳转到文章详情页
const goToDetail = () => {
  router.push({
    name: 'ArticleDetail',
    params: { id: props.article.id }
  });
};
</script>

<template>
  <div class="article-card" @click="goToDetail" style="background-color: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); padding: 20px; margin-bottom: 20px; transition: all 0.2s; cursor: pointer; border-left: 3px solid #4a90e2;">
    <div class="article-card-header">
      <h2 class="article-title" style="font-size: 18px; font-weight: bold; color: #333; margin: 0 0 10px 0; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ article.title }}</h2>
      <div class="article-meta">
        <span class="article-date">
          <el-icon><Calendar /></el-icon>
          {{ formattedDate }}
        </span>
        <span class="article-category" v-if="article.category">
          <el-icon><Collection /></el-icon>
          {{ article.category.name }}
        </span>
        <span class="article-views">
          <el-icon><View /></el-icon>
          {{ article.views }} 阅读
        </span>
      </div>
    </div>
    
    <div v-if="showSummary && article.summary" class="article-summary">
      {{ article.summary }}
    </div>
    
    <div class="article-footer">
      <el-button type="primary" size="small" text @click.stop="goToDetail">
        阅读全文
        <el-icon class="el-icon--right"><ArrowRight /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<style scoped>
div.article-card {
  background-color: #fff !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08) !important;
  padding: 24px !important;
  margin-bottom: 25px !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  border-left: none !important;
  position: relative !important;
  overflow: hidden !important;
}

div.article-card::before {
  content: '' !important;
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
  height: 100% !important;
  width: 4px !important;
  background: linear-gradient(to bottom, #5e72e4, #825ee4) !important;
  border-radius: 4px !important;
}

div.article-card:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15) !important;
  transform: translateY(-3px) !important;
}

.article-card-header {
  margin-bottom: 12px;
}

.article-title {
  font-size: 20px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 12px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: 1.4;
  transition: color 0.3s ease;
}

div.article-card:hover .article-title {
  color: #5e72e4;
}

.article-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: #999;
}

.article-meta span {
  display: flex;
  align-items: center;
  margin-right: 12px;
}

.article-meta .el-icon {
  margin-right: 3px;
}

.article-summary {
  color: #525f7f;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  padding-left: 2px;
}

.article-footer {
  display: flex;
  justify-content: flex-end;
}
</style>