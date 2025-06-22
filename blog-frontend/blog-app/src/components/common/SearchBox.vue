<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  placeholder: {
    type: String,
    default: '搜索文章...'
  }
});

const router = useRouter();
const keyword = ref('');

// 处理搜索
const handleSearch = () => {
  if (!keyword.value.trim()) return;
  
  router.push({
    name: 'SearchResults',
    query: { keyword: keyword.value.trim() }
  });
  
  // 清空搜索框
  keyword.value = '';
};

// 处理按键事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
};
</script>

<template>
  <div class="search-box">
    <el-input
      v-model="keyword"
      :placeholder="placeholder"
      clearable
      @keydown="handleKeyDown"
    >
      <template #suffix>
        <el-icon class="search-icon" @click="handleSearch">
          <Search />
        </el-icon>
      </template>
    </el-input>
  </div>
</template>

<style scoped>
.search-box {
  width: 100%;
}

.search-icon {
  cursor: pointer;
  color: #909399;
  transition: color 0.3s;
}

.search-icon:hover {
  color: #409EFF;
}
</style>