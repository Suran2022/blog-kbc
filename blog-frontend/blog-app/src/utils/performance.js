// 性能优化工具函数
import { ref, computed, getCurrentInstance } from 'vue';

/**
 * 防抖函数
 * @param {Function} func 要防抖的函数
 * @param {number} wait 等待时间
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}

/**
 * 节流函数
 * @param {Function} func 要节流的函数
 * @param {number} limit 时间间隔
 * @returns {Function} 节流后的函数
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * 图片懒加载指令
 */
export const lazyLoad = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = binding.value;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    }, {
      threshold: 0.1
    });
    
    el.classList.add('lazy');
    observer.observe(el);
  }
};

/**
 * 虚拟滚动组合式函数
 * @param {Array} items 数据列表
 * @param {number} itemHeight 每项高度
 * @param {number} containerHeight 容器高度
 * @returns {Object} 虚拟滚动相关数据和方法
 */
export function useVirtualScroll(items, itemHeight = 50, containerHeight = 400) {
  const scrollTop = ref(0);
  const startIndex = computed(() => Math.floor(scrollTop.value / itemHeight));
  const endIndex = computed(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    return Math.min(startIndex.value + visibleCount + 1, items.length - 1);
  });
  
  const visibleItems = computed(() => {
    return items.slice(startIndex.value, endIndex.value + 1).map((item, index) => ({
      ...item,
      index: startIndex.value + index
    }));
  });
  
  const totalHeight = computed(() => items.length * itemHeight);
  const offsetY = computed(() => startIndex.value * itemHeight);
  
  const handleScroll = (e) => {
    scrollTop.value = e.target.scrollTop;
  };
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll
  };
}

/**
 * 预加载图片
 * @param {string} src 图片地址
 * @returns {Promise} 加载Promise
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 批量预加载图片
 * @param {Array} srcs 图片地址数组
 * @returns {Promise} 加载Promise
 */
export function preloadImages(srcs) {
  return Promise.all(srcs.map(src => preloadImage(src)));
}

/**
 * 检测设备类型
 * @returns {Object} 设备信息
 */
export function getDeviceInfo() {
  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const isTablet = /iPad/i.test(ua) || (isMobile && window.innerWidth > 768);
  const isDesktop = !isMobile && !isTablet;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent: ua
  };
}

/**
 * 获取网络状态
 * @returns {Object} 网络信息
 */
export function getNetworkInfo() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  return {
    online: navigator.onLine,
    effectiveType: connection?.effectiveType || 'unknown',
    downlink: connection?.downlink || 0,
    rtt: connection?.rtt || 0
  };
}

/**
 * 内存使用监控
 * @returns {Object} 内存信息
 */
export function getMemoryInfo() {
  if ('memory' in performance) {
    return {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    };
  }
  return null;
}

/**
 * 页面性能监控
 * @returns {Object} 性能指标
 */
export function getPerformanceMetrics() {
  const navigation = performance.getEntriesByType('navigation')[0];
  
  return {
    // 页面加载时间
    loadTime: navigation.loadEventEnd - navigation.loadEventStart,
    // DOM 解析时间
    domParseTime: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
    // 首字节时间
    ttfb: navigation.responseStart - navigation.requestStart,
    // 白屏时间
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
    // 最大内容绘制时间
    lcp: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
  };
}

/**
 * 错误监控
 */
export function setupErrorMonitoring() {
  // 全局错误监听
  window.addEventListener('error', (event) => {
    console.error('Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });
  
  // Promise 错误监听
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
  
  // Vue 错误处理
  const app = getCurrentInstance()?.appContext.app;
  if (app) {
    app.config.errorHandler = (err, vm, info) => {
      console.error('Vue Error:', { err, vm, info });
    };
  }
}