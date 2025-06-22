// 响应式布局组合式函数
import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * 响应式断点
 */
const breakpoints = {
  xs: 480,
  sm: 768,
  md: 992,
  lg: 1200,
  xl: 1600
};

/**
 * 使用响应式布局
 * @returns {Object} 响应式数据和方法
 */
export function useResponsive() {
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);
  
  // 当前断点
  const currentBreakpoint = computed(() => {
    const width = windowWidth.value;
    if (width < breakpoints.xs) return 'xs';
    if (width < breakpoints.sm) return 'sm';
    if (width < breakpoints.md) return 'md';
    if (width < breakpoints.lg) return 'lg';
    return 'xl';
  });
  
  // 是否为移动端
  const isMobile = computed(() => windowWidth.value < breakpoints.sm);
  
  // 是否为平板
  const isTablet = computed(() => {
    const width = windowWidth.value;
    return width >= breakpoints.sm && width < breakpoints.lg;
  });
  
  // 是否为桌面端
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg);
  
  // 是否为小屏幕
  const isSmallScreen = computed(() => windowWidth.value < breakpoints.md);
  
  // 侧边栏是否应该折叠
  const shouldCollapseSidebar = computed(() => windowWidth.value < breakpoints.lg);
  
  // 网格列数
  const gridCols = computed(() => {
    const width = windowWidth.value;
    if (width < breakpoints.sm) return 1;
    if (width < breakpoints.md) return 2;
    if (width < breakpoints.lg) return 3;
    return 4;
  });
  
  // 容器最大宽度
  const containerMaxWidth = computed(() => {
    const width = windowWidth.value;
    if (width < breakpoints.sm) return '100%';
    if (width < breakpoints.md) return '750px';
    if (width < breakpoints.lg) return '970px';
    if (width < breakpoints.xl) return '1170px';
    return '1200px';
  });
  
  // 更新窗口尺寸
  const updateWindowSize = () => {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  };
  
  // 防抖的窗口尺寸更新
  let resizeTimer = null;
  const debouncedUpdateWindowSize = () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateWindowSize, 100);
  };
  
  onMounted(() => {
    window.addEventListener('resize', debouncedUpdateWindowSize);
  });
  
  onUnmounted(() => {
    window.removeEventListener('resize', debouncedUpdateWindowSize);
    if (resizeTimer) clearTimeout(resizeTimer);
  });
  
  return {
    windowWidth,
    windowHeight,
    currentBreakpoint,
    isMobile,
    isTablet,
    isDesktop,
    isSmallScreen,
    shouldCollapseSidebar,
    gridCols,
    containerMaxWidth,
    breakpoints
  };
}

/**
 * 使用媒体查询
 * @param {string} query 媒体查询字符串
 * @returns {Object} 匹配状态
 */
export function useMediaQuery(query) {
  const matches = ref(false);
  
  const updateMatches = () => {
    matches.value = window.matchMedia(query).matches;
  };
  
  onMounted(() => {
    const mediaQuery = window.matchMedia(query);
    matches.value = mediaQuery.matches;
    
    // 监听变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', updateMatches);
    } else {
      // 兼容旧版本
      mediaQuery.addListener(updateMatches);
    }
  });
  
  onUnmounted(() => {
    const mediaQuery = window.matchMedia(query);
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', updateMatches);
    } else {
      mediaQuery.removeListener(updateMatches);
    }
  });
  
  return { matches };
}

/**
 * 使用暗黑模式
 * @returns {Object} 暗黑模式相关数据和方法
 */
export function useDarkMode() {
  const isDark = ref(false);
  
  // 从本地存储获取设置
  const getStoredTheme = () => {
    return localStorage.getItem('theme') || 'auto';
  };
  
  // 保存主题设置
  const setStoredTheme = (theme) => {
    localStorage.setItem('theme', theme);
  };
  
  // 检测系统主题
  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  
  // 应用主题
  const applyTheme = (theme) => {
    const actualTheme = theme === 'auto' ? getSystemTheme() : theme;
    isDark.value = actualTheme === 'dark';
    
    if (actualTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // 切换主题
  const toggleTheme = () => {
    const currentTheme = getStoredTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setStoredTheme(newTheme);
    applyTheme(newTheme);
  };
  
  // 设置主题
  const setTheme = (theme) => {
    setStoredTheme(theme);
    applyTheme(theme);
  };
  
  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (getStoredTheme() === 'auto') {
      applyTheme('auto');
    }
  };
  
  onMounted(() => {
    // 初始化主题
    applyTheme(getStoredTheme());
    
    // 监听系统主题变化
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  });
  
  onUnmounted(() => {
    if (mediaQuery.removeEventListener) {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.removeListener(handleSystemThemeChange);
    }
  });
  
  return {
    isDark,
    toggleTheme,
    setTheme,
    getStoredTheme
  };
}

/**
 * 使用滚动位置
 * @returns {Object} 滚动相关数据和方法
 */
export function useScroll() {
  const scrollY = ref(0);
  const scrollX = ref(0);
  const isScrolling = ref(false);
  
  let scrollTimer = null;
  
  const updateScrollPosition = () => {
    scrollY.value = window.scrollY;
    scrollX.value = window.scrollX;
    isScrolling.value = true;
    
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isScrolling.value = false;
    }, 150);
  };
  
  // 滚动到顶部
  const scrollToTop = (smooth = true) => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };
  
  // 滚动到指定位置
  const scrollTo = (top, smooth = true) => {
    window.scrollTo({
      top,
      behavior: smooth ? 'smooth' : 'auto'
    });
  };
  
  // 滚动到元素
  const scrollToElement = (element, smooth = true) => {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (element) {
      element.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'start'
      });
    }
  };
  
  onMounted(() => {
    updateScrollPosition();
    window.addEventListener('scroll', updateScrollPosition, { passive: true });
  });
  
  onUnmounted(() => {
    window.removeEventListener('scroll', updateScrollPosition);
    if (scrollTimer) clearTimeout(scrollTimer);
  });
  
  return {
    scrollY,
    scrollX,
    isScrolling,
    scrollToTop,
    scrollTo,
    scrollToElement
  };
}