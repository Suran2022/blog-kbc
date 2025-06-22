<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSettingStore } from '../store/setting';
import { useResponsive, useScroll } from '../composables/useResponsive';
import { debounce } from '../utils/performance';

// 引入组件
// 这里将在后续实现具体组件

const router = useRouter();
const settingStore = useSettingStore();

// 响应式布局
const { isMobile, isTablet, shouldCollapseSidebar } = useResponsive();

// 滚动状态
const { scrollY, scrollToTop } = useScroll();

// 头部是否固定
const isHeaderFixed = ref(false);

// 移动端菜单状态
const isMobileMenuOpen = ref(false);

// 站点信息
const siteInfo = ref({
  siteName: '博客系统',
  siteDescription: '一个现代化的博客系统',
  siteLogo: '',
  siteFooter: '© 2023 博客系统 All Rights Reserved.'
});

// 搜索关键词
const searchKeyword = ref('');

// 搜索框展开状态
const isSearchExpanded = ref(false);

// 处理搜索
const handleSearch = () => {
  // 移动端直接展开搜索框
  if (isMobile.value && !isSearchExpanded.value) {
    isSearchExpanded.value = true;
    setTimeout(() => {
      document.querySelector('.search-input input')?.focus();
    }, 100);
    return;
  }
  
  // 如果有关键词，则进行搜索
  if (searchKeyword.value.trim()) {
    router.push({
      name: 'SearchResult',
      query: { keyword: searchKeyword.value.trim() }
    });
    // 搜索后收起搜索框并清空关键词
    if (isMobile.value) {
      isSearchExpanded.value = false;
      searchKeyword.value = '';
    }
  }
};

// 防抖搜索
const debouncedSearch = debounce(handleSearch, 300);

// 切换移动端菜单
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 监听滚动，控制头部固定
const handleScroll = () => {
  isHeaderFixed.value = scrollY.value > 100;
};

// 回到顶部
const backToTop = () => {
  scrollToTop();
};

// 点击外部区域关闭搜索框
const handleClickOutside = (event) => {
  const searchContainer = document.querySelector('.search-container');
  if (isSearchExpanded.value && searchContainer && !searchContainer.contains(event.target)) {
    isSearchExpanded.value = false;
  }
};

// 获取站点设置
onMounted(async () => {
  try {
    await settingStore.fetchSettings();
    siteInfo.value = {
      siteName: settingStore.siteName,
      siteDescription: settingStore.siteDescription,
      siteLogo: settingStore.siteLogo,
      siteFooter: settingStore.siteFooter
    };
  } catch (error) {
    console.error('获取站点设置失败:', error);
  }
  
  // 添加点击事件监听器
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="front-layout">
    <!-- 头部 -->
    <header class="header" :class="{ 'header-fixed': isHeaderFixed }">
      <div class="header-content container">
        <!-- Logo和站点名称 -->
        <div class="logo-container">
          <router-link to="/" class="logo">
            <img v-if="siteInfo.siteLogo" :src="siteInfo.siteLogo" :alt="siteInfo.siteName" class="logo-img" />
            <h1 v-else class="logo-text">{{ siteInfo.siteName }}</h1>
          </router-link>
        </div>
        
        <!-- 桌面端搜索框 -->
        <div v-if="!isMobile" class="search-container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="handleSearch"
            @input="debouncedSearch"
          >
            <template #suffix>
              <el-icon class="search-button" @click="handleSearch"><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <!-- 移动端操作区 -->
        <div v-if="isMobile" class="mobile-actions">
          <el-icon class="search-icon" @click="handleSearch"><Search /></el-icon>
          <el-icon class="menu-icon" @click="toggleMobileMenu"><Menu /></el-icon>
        </div>
      </div>
      
      <!-- 移动端搜索框 -->
      <div v-if="isMobile && isSearchExpanded" class="mobile-search">
        <div class="container">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章..."
            class="search-input"
            @keyup.enter="handleSearch"
            @input="debouncedSearch"
          >
            <template #suffix>
              <el-icon class="search-button" @click="handleSearch"><Search /></el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </header>
    
    <!-- 主要内容区 -->
    <main class="main-content">
      <div class="container">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </main>
    
    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-content container">
        <p class="copyright" v-html="siteInfo.siteFooter"></p>
      </div>
    </footer>
    
    <!-- 回到顶部按钮 -->
    <transition name="fade">
      <div v-if="scrollY > 300" class="back-to-top" @click="backToTop">
        <el-icon><ArrowUp /></el-icon>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.front-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--bg-color);
}

.header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #825ee4 100%);
  box-shadow: var(--shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  transition: all 0.3s ease;
}

.header-fixed {
  backdrop-filter: blur(10px);
  background: rgba(74, 144, 226, 0.95);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  height: 70px;
}

.logo-container {
  flex: 0 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  color: var(--white);
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.logo:hover {
  opacity: 0.9;
}

.logo-img {
  height: 40px;
  width: auto;
  margin-right: 12px;
  border-radius: 4px;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--white);
}

/* 桌面端搜索框 */
.search-container {
  flex: 0 0 300px;
  max-width: 400px;
}

.search-container .search-input {
  width: 100%;
}

.search-container .search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-container .search-input :deep(.el-input__wrapper):hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

.search-container .search-input :deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.7);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.search-container .search-input :deep(.el-input__inner) {
  color: var(--white);
  font-size: 14px;
}

.search-container .search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

.search-button {
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: color 0.2s ease;
}

.search-button:hover {
  color: var(--white);
}

/* 移动端操作区 */
.mobile-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-actions .search-icon,
.mobile-actions .menu-icon {
  color: var(--white);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.mobile-actions .search-icon:hover,
.mobile-actions .menu-icon:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* 移动端搜索框 */
.mobile-search {
  padding: 1rem 0;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-search .search-input :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
}

.mobile-search .search-input :deep(.el-input__inner) {
  color: var(--white);
}

.mobile-search .search-input :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.7);
}

/* 主要内容区 */
.main-content {
  flex: 1;
  padding: 2rem 0;
  min-height: calc(100vh - 140px);
}

/* 页脚 */
.footer {
  background: linear-gradient(135deg, var(--primary-color) 0%, #825ee4 100%);
  color: var(--white);
  padding: 2rem 0;
  margin-top: auto;
  box-shadow: 0 -4px 20px rgba(74, 144, 226, 0.1);
}

.footer-content {
  text-align: center;
}

.copyright {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: var(--primary-color);
  color: var(--white);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
  z-index: 1000;
}

.back-to-top:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(74, 144, 226, 0.4);
}

.back-to-top .el-icon {
  font-size: 1.2rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0.75rem 0;
    height: 60px;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .logo-img {
    height: 32px;
  }
  
  .main-content {
    padding: 1rem 0;
    min-height: calc(100vh - 120px);
  }
  
  .back-to-top {
    width: 45px;
    height: 45px;
    bottom: 1.5rem;
    right: 1.5rem;
  }
  
  .back-to-top .el-icon {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    height: 55px;
  }
  
  .logo-text {
    font-size: 1.125rem;
  }
  
  .mobile-actions {
    gap: 0.5rem;
  }
  
  .mobile-actions .search-icon,
  .mobile-actions .menu-icon {
    font-size: 1.25rem;
    padding: 0.375rem;
  }
  
  .back-to-top {
    width: 40px;
    height: 40px;
    bottom: 1rem;
    right: 1rem;
  }
}

.footer-content {
  text-align: center;
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 15px;
}

.copyright {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .container {
    width: 95%;
  }
}

@media (max-width: 992px) {
  .header-content {
    padding: 15px 3%;
  }
  
  .search-input.expanded {
    width: 180px;
  }
  
  .container {
    width: 95%;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 15px;
    justify-content: space-between;
  }
  
  .container {
    width: 100%;
    padding: 0 15px;
  }
  
  .search-input.expanded {
    width: 150px;
  }
}

@media (max-width: 576px) {
  .header-content {
    padding: 10px 10px;
  }
  
  .logo h1 {
    font-size: 20px;
  }
  
  .search-input.expanded {
    width: 120px;
  }
}
</style>