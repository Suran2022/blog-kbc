<template>
  <div class="search-results">
    <!-- 搜索头部 -->
    <div class="search-header">
      <div class="container">
        <SearchBox 
          :default-keyword="keyword" 
          @search="handleSearch"
          class="search-box-results"
        />
        <div class="search-info" v-if="!loading">
          <span class="keyword">"{{ keyword }}"</span>
          <span class="count">找到 {{ total }} 个结果</span>
          <span class="time">用时 {{ searchTime }}ms</span>
        </div>
      </div>
    </div>

    <!-- 搜索结果内容 -->
    <div class="search-content">
      <div class="container">
        <div class="results-layout">
          <!-- 左侧：搜索结果列表 -->
          <div class="results-main">
            <!-- 结果统计 -->
            <div class="results-header" v-if="!loading">
              <h2 class="results-title">搜索结果</h2>
              <div class="results-stats">
                <span class="keyword-highlight">"{{ keyword }}"</span>
                <span class="results-count">找到 {{ total }} 个结果</span>
                <span class="search-time">用时 {{ searchTime }}ms</span>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="8" animated />
            </div>

            <!-- 搜索结果列表 -->
            <div v-else-if="articles.length > 0" class="results-list">
              <div 
                v-for="article in articles" 
                :key="article.id"
                class="result-item"
                @click="goToArticle(article.id)"
              >
                <div class="result-content">
                  <h3 class="result-title" v-html="highlightKeyword(article.title)"></h3>
                  <p class="result-summary" v-html="highlightKeyword(article.summary)"></p>
                  <div class="result-meta">
                    <span class="meta-item">
                      <el-icon><Calendar /></el-icon>
                      {{ formatDate(article.createTime) }}
                    </span>
                    <span class="meta-item">
                      <el-icon><View /></el-icon>
                      {{ article.viewCount }}
                    </span>
                    <span class="meta-item" v-if="article.categoryName">
                      <el-icon><Folder /></el-icon>
                      {{ article.categoryName }}
                    </span>
                    <div class="tags" v-if="article.tags">
                      <el-tag 
                        v-for="tag in article.tags.split(',')" 
                        :key="tag"
                        size="small"
                        type="info"
                        class="tag-item"
                      >
                        {{ tag.trim() }}
                      </el-tag>
                    </div>
                  </div>
                </div>
                <div class="result-thumbnail" v-if="article.thumbnail">
                  <img :src="article.thumbnail" :alt="article.title" />
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="empty-state">
              <el-icon class="empty-icon"><Search /></el-icon>
              <h3 class="empty-title">未找到相关内容</h3>
              <p class="empty-description">
                没有找到与 "{{ keyword }}" 相关的文章，请尝试其他关键词
              </p>
              <el-button type="primary" @click="goHome">返回首页</el-button>
            </div>

            <!-- 分页 -->
            <div v-if="total > 0" class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30]"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>

          <!-- 右侧：搜索建议 -->
          <div class="results-sidebar">
            <div class="sidebar-section">
              <SearchSuggestions />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, View, Folder, Search } from '@element-plus/icons-vue'
import SearchBox from '../../components/common/SearchBox.vue'
import SearchSuggestions from '../../components/common/SearchSuggestions.vue'
import { searchArticles } from '../../api/search'
import { formatDate } from '../../utils/date'

const route = useRoute()
const router = useRouter()

// 搜索参数
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const sortBy = ref('createTime')
const sortDir = ref('desc')

// 搜索结果
const articles = ref([])
const total = ref(0)
const loading = ref(false)
const searchTime = ref(0)

// 初始化搜索关键词
const initKeyword = () => {
  keyword.value = route.query.keyword || ''
}

// 执行搜索
const performSearch = async () => {
  if (!keyword.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  loading.value = true
  const startTime = Date.now()

  try {
    const params = {
      keyword: keyword.value.trim(),
      page: currentPage.value - 1, // 后端从0开始
      size: pageSize.value,
      sortBy: sortBy.value,
      sortDir: sortDir.value
    }

    const response = await searchArticles(params)
    articles.value = response.data.content || []
    total.value = response.data.totalElements || 0
    searchTime.value = Date.now() - startTime
  } catch (error) {
    console.error('搜索失败:', error)
    ElMessage.error('搜索失败，请稍后重试')
    articles.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (newKeyword) => {
  keyword.value = newKeyword
  currentPage.value = 1
  
  // 更新URL
  router.push({
    name: 'SearchResult',
    query: { keyword: newKeyword }
  })
}

// 处理分页大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1
  performSearch()
}

// 处理页码变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  performSearch()
}

// 跳转到文章详情
const goToArticle = (articleId) => {
  router.push({
    name: 'ArticleDetail',
    params: { id: articleId }
  })
}

// 返回首页
const goHome = () => {
  router.push('/')
}

// 高亮关键词
const highlightKeyword = (text) => {
  if (!keyword.value || !text) return text
  
  const regex = new RegExp(`(${keyword.value.trim()})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}

// 监听路由变化
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword !== keyword.value) {
    keyword.value = newKeyword || ''
    currentPage.value = 1
    if (keyword.value) {
      performSearch()
    }
  }
})

// 组件挂载时初始化
onMounted(() => {
  initKeyword()
  if (keyword.value) {
    performSearch()
  }
})
</script>

<style scoped>
.search-results {
  min-height: 100vh;
  background: #f8f9fa;
}

.search-header {
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: 1.5rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-box-results {
  margin-bottom: 1rem;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.keyword {
  color: #495057;
  font-weight: 500;
}

.search-content {
  padding: 2rem 0;
}

.results-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
}

.results-main {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.results-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #e9ecef;
}

.results-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0 0 1rem 0;
}

.results-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #666;
  flex-wrap: wrap;
}

.keyword-highlight {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
}

.results-count {
  font-weight: 500;
}

.search-time {
  color: #999;
}

.loading-container {
  padding: 1.5rem 0;
}

.results-list {
  display: grid;
  gap: 1.5rem;
}

.result-item {
  display: flex;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafbfc;
}

.result-item:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.result-content {
  flex: 1;
  margin-right: 1.5rem;
}

.result-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.result-summary {
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  color: #6c757d;
}

.meta-item .el-icon {
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 0.75rem;
}

.result-thumbnail {
  width: 100px;
  height: 70px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.result-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  color: #c0c4cc;
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.25rem;
  color: #303133;
  margin: 0 0 0.75rem 0;
}

.empty-description {
  font-size: 0.9rem;
  color: #6c757d;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.results-sidebar {
  display: grid;
  gap: 1.5rem;
  align-content: start;
  position: sticky;
  top: 120px;
  height: fit-content;
}

.sidebar-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

:deep(.highlight) {
  background: #fff3cd;
  color: #856404;
  padding: 1px 2px;
  border-radius: 2px;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .results-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .results-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
  
  .search-content {
    padding: 1.5rem 0;
  }
  
  .results-main {
    padding: 1.5rem;
  }
  
  .result-item {
    flex-direction: column;
    padding: 1rem;
  }
  
  .result-content {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .result-thumbnail {
    width: 100%;
    height: 120px;
  }
  
  .result-meta {
    gap: 0.75rem;
  }
  
  .search-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .results-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .sidebar-section {
    padding: 1rem;
  }
}
</style>