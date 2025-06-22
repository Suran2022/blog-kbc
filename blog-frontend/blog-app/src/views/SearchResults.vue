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
            <!-- 加载状态 -->
            <div v-if="loading" class="loading-container">
              <el-skeleton :rows="5" animated />
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
                      {{ article.viewCount }} 次阅读
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
                :page-sizes="[10, 20, 50]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>

          <!-- 右侧：搜索建议 -->
          <div class="results-sidebar">
            <SearchSuggestions />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Calendar, View, Folder, Search } from '@element-plus/icons-vue'
import SearchBox from '@/components/common/SearchBox.vue'
import SearchSuggestions from '@/components/common/SearchSuggestions.vue'
import { searchArticles } from '@/api/search'
import { formatDate } from '@/utils/date'

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
    name: 'SearchResults',
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
  padding: 20px 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.search-box-results {
  margin-bottom: 15px;
}

.search-info {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;
  color: #6c757d;
}

.keyword {
  color: #495057;
  font-weight: 500;
}

.search-content {
  padding: 30px 0;
}

.results-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.results-main {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-container {
  padding: 20px 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  display: flex;
  padding: 20px;
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
  margin-right: 20px;
}

.result-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 10px 0;
  line-height: 1.4;
}

.result-summary {
  font-size: 14px;
  color: #6c757d;
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6c757d;
}

.meta-item .el-icon {
  font-size: 14px;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag-item {
  font-size: 11px;
}

.result-thumbnail {
  width: 120px;
  height: 80px;
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
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  color: #303133;
  margin: 0 0 10px 0;
}

.empty-description {
  font-size: 14px;
  color: #6c757d;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.results-sidebar {
  position: sticky;
  top: 120px;
  height: fit-content;
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
    gap: 20px;
  }
  
  .results-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 15px;
  }
  
  .search-content {
    padding: 20px 0;
  }
  
  .results-main {
    padding: 20px 15px;
  }
  
  .result-item {
    flex-direction: column;
    padding: 15px;
  }
  
  .result-content {
    margin-right: 0;
    margin-bottom: 15px;
  }
  
  .result-thumbnail {
    width: 100%;
    height: 150px;
  }
  
  .result-meta {
    gap: 10px;
  }
  
  .search-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>