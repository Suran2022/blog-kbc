<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 面包屑数据
const breadcrumbs = ref([]);

// 根据路由生成面包屑
const generateBreadcrumbs = () => {
  const { matched } = route;
  breadcrumbs.value = matched.filter(item => item.meta && item.meta.title).map(item => ({
    path: item.path,
    title: item.meta.title
  }));
};

// 监听路由变化
watch(
  () => route.path,
  () => generateBreadcrumbs(),
  { immediate: true }
);

// 处理面包屑点击
const handleBreadcrumbClick = (path) => {
  router.push(path);
};
</script>

<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="index">
      <span 
        v-if="index === breadcrumbs.length - 1" 
        class="breadcrumb-item-text breadcrumb-item-current"
      >
        {{ item.title }}
      </span>
      <span 
        v-else 
        class="breadcrumb-item-text breadcrumb-item-link" 
        @click="handleBreadcrumbClick(item.path)"
      >
        {{ item.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style scoped>
.breadcrumb {
  display: inline-block;
  line-height: 60px;
}

.breadcrumb-item-text {
  font-size: 14px;
}

.breadcrumb-item-link {
  color: #409EFF;
  cursor: pointer;
}

.breadcrumb-item-link:hover {
  color: #66b1ff;
}

.breadcrumb-item-current {
  color: #606266;
}
</style>