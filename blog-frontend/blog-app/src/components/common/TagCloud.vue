<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

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
</script>

<template>
  <div class="tag-cloud-container" style="background-color: #fff; border-radius: 4px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); padding: 15px; margin-bottom: 20px;">
    <h3 class="tag-cloud-title" style="font-size: 16px; font-weight: bold; color: #333; margin: 0 0 10px 0;">{{ title }}</h3>
    <el-divider />
    <el-skeleton :rows="3" animated v-if="loading" />
    <div v-else-if="tags.length > 0" class="tag-cloud">
      <el-tag
        v-for="tag in tags"
        :key="tag.id || tag.name"
        :type="getRandomTagType()"
        effect="light"
        class="tag-item"
        @click="goToTagArticles(tag)"
      >
        {{ tag.name }}
        <span class="tag-count" v-if="tag.count !== undefined">
          ({{ tag.count }})
        </span>
      </el-tag>
    </div>
    <el-empty v-else description="暂无标签" :image-size="60" />
  </div>
</template>

<style scoped>
/* 增加选择器特异性 */
div.tag-cloud-container {
  background-color: #fff !important;
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(94, 114, 228, 0.08) !important;
  padding: 20px !important;
  margin-bottom: 20px !important;
  transition: all 0.3s ease !important;
}

div.tag-cloud-container:hover {
  box-shadow: 0 7px 14px rgba(94, 114, 228, 0.15) !important;
  transform: translateY(-2px) !important;
}

.tag-cloud-title {
  font-size: 18px;
  font-weight: 600;
  color: #32325d;
  margin: 0 0 12px 0;
  position: relative;
  padding-bottom: 8px;
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

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 6px;
  padding: 0 12px;
  height: 28px;
  line-height: 28px;
  font-size: 13px;
}

.tag-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(94, 114, 228, 0.2);
}

.tag-count {
  font-size: 12px;
  margin-left: 2px;
}
</style>