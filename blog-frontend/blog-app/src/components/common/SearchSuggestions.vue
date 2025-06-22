<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSearchStore } from '../../store/search';
import { Search, Clock, TrendCharts, Delete } from '@element-plus/icons-vue';

const router = useRouter();
const searchStore = useSearchStore();

// 搜索历史
const searchHistory = computed(() => searchStore.searchHistory);
// 热门搜索
const hotSearches = computed(() => searchStore.hotSearches);
// 加载状态
const loading = ref(false);

// 执行搜索
const performSearch = (keyword) => {
  if (!keyword.trim()) return;
  
  // 添加到搜索历史
  searchStore.addToHistory(keyword);
  
  // 跳转到搜索结果页
  router.push({
    name: 'SearchResults',
    query: { keyword: keyword.trim() }
  });
};

// 清除搜索历史
const clearHistory = () => {
  searchStore.clearHistory();
};

// 删除单个历史记录
const removeHistoryItem = (keyword) => {
  searchStore.removeFromHistory(keyword);
};

// 获取热门搜索
const fetchHotSearches = async () => {
  loading.value = true;
  try {
    await searchStore.fetchHotSearches();
  } catch (error) {
    console.error('获取热门搜索失败:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchHotSearches();
});
</script>

<template>
  <div class="search-suggestions">
    <!-- 搜索历史 -->
    <div v-if="searchHistory.length > 0" class="suggestion-section">
      <div class="section-header">
        <div class="section-title">
          <el-icon><Clock /></el-icon>
          <span>搜索历史</span>
        </div>
        <el-button 
          type="text" 
          size="small" 
          @click="clearHistory"
          class="clear-btn"
        >
          <el-icon><Delete /></el-icon>
          清空
        </el-button>
      </div>
      <div class="suggestion-list">
        <div 
          v-for="item in searchHistory" 
          :key="item.id"
          class="suggestion-item history-item"
          @click="performSearch(item.keyword)"
        >
          <el-icon class="item-icon"><Search /></el-icon>
          <span class="item-text">{{ item.keyword }}</span>
          <el-button 
            type="text" 
            size="small" 
            @click.stop="removeHistoryItem(item.keyword)"
            class="remove-btn"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <!-- 热门搜索 -->
    <div class="suggestion-section">
      <div class="section-header">
        <div class="section-title">
          <el-icon><TrendCharts /></el-icon>
          <span>热门搜索</span>
        </div>
      </div>
      <div class="suggestion-list">
        <el-skeleton :rows="4" animated v-if="loading" />
        <template v-else>
          <div 
            v-for="(item, index) in hotSearches" 
            :key="item.id"
            class="suggestion-item hot-item"
            @click="performSearch(item.keyword)"
          >
            <div class="rank-badge" :class="{ 'top-rank': index < 3 }">
              {{ index + 1 }}
            </div>
            <span class="item-text">{{ item.keyword }}</span>
            <span class="search-count">{{ item.count }}</span>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-suggestions {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(94, 114, 228, 0.08);
  padding: 20px;
  margin-top: 20px;
}

.suggestion-section {
  margin-bottom: 25px;
}

.suggestion-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f2f5;
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #5e72e4, #825ee4);
  border-radius: 2px;
}

.section-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.section-title .el-icon {
  margin-right: 8px;
  color: #5e72e4;
}

.clear-btn {
  color: #6c757d;
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(94, 114, 228, 0.1);
  color: #5e72e4;
}

.suggestion-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(94, 114, 228, 0.02);
  border: 1px solid rgba(94, 114, 228, 0.05);
}

.suggestion-item:hover {
  background: rgba(94, 114, 228, 0.08);
  border-color: rgba(94, 114, 228, 0.15);
  transform: translateX(4px);
}

.history-item .item-icon {
  margin-right: 10px;
  color: #6c757d;
  font-size: 14px;
}

.item-text {
  flex: 1;
  color: #495057;
  font-size: 14px;
}

.remove-btn {
  opacity: 0;
  transition: opacity 0.3s ease;
  color: #6c757d;
  padding: 2px;
}

.history-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn:hover {
  color: #e74c3c;
}

.hot-item {
  position: relative;
}

.rank-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f8f9fa;
  color: #6c757d;
  font-size: 12px;
  font-weight: 600;
  margin-right: 12px;
  border: 1px solid #dee2e6;
}

.rank-badge.top-rank {
  background: linear-gradient(135deg, #5e72e4, #825ee4);
  color: white;
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(94, 114, 228, 0.3);
}

.search-count {
  font-size: 12px;
  color: #6c757d;
  background: rgba(94, 114, 228, 0.1);
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: 8px;
}

@media (max-width: 768px) {
  .search-suggestions {
    padding: 15px;
    margin-top: 15px;
  }
  
  .section-title {
    font-size: 14px;
  }
  
  .suggestion-item {
    padding: 8px 10px;
  }
  
  .item-text {
    font-size: 13px;
  }
}
</style>