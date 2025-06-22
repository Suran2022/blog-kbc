import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  debounce,
  throttle,
  lazyLoad,
  useVirtualScroll,
  preloadImage,
  preloadImages,
  getDeviceInfo,
  getNetworkInfo,
  getMemoryInfo,
  getPerformanceMetrics,
  setupErrorMonitoring
} from '../../utils/performance';
import { ref } from 'vue';

// 模拟浏览器环境
const mockPerformance = {
  now: vi.fn(() => Date.now()),
  mark: vi.fn(),
  measure: vi.fn(),
  getEntriesByType: vi.fn(() => []),
  getEntriesByName: vi.fn(() => []),
  memory: {
    usedJSHeapSize: 1000000,
    totalJSHeapSize: 2000000,
    jsHeapSizeLimit: 4000000
  }
};
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  configurable: true
});

// 模拟 requestAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});
Object.defineProperty(global, 'requestAnimationFrame', {
  value: mockRequestAnimationFrame,
  configurable: true
});

// 模拟 IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.elements = new Set();
  }
  
  observe(element) {
    this.elements.add(element);
    setTimeout(() => {
      this.callback([{
        target: element,
        isIntersecting: true,
        intersectionRatio: 1
      }]);
    }, 10);
  }
  
  unobserve(element) {
    this.elements.delete(element);
  }
  
  disconnect() {
    this.elements.clear();
  }
}
Object.defineProperty(global, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  configurable: true
});

// 模拟 Image
class MockImage {
  constructor() {
    this.onload = null;
    this.onerror = null;
    this.src = '';
  }
}
Object.defineProperty(global, 'Image', {
  value: MockImage,
  configurable: true
});

describe('性能工具函数测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('防抖和节流', () => {
    it('应该正确防抖函数调用', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100);

      // 快速连续调用
      debouncedFn('arg1');
      debouncedFn('arg2');
      debouncedFn('arg3');

      // 函数还未执行
      expect(mockFn).not.toHaveBeenCalled();

      // 等待防抖时间
      vi.advanceTimersByTime(100);

      // 只执行最后一次调用
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('arg3');
    });

    it('应该支持立即执行模式', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 100, true);

      debouncedFn('immediate');
      
      // 立即执行模式下，第一次调用应该立即执行
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('immediate');

      // 后续调用在防抖期间不会执行
      debouncedFn('delayed');
      expect(mockFn).toHaveBeenCalledTimes(1);

      vi.advanceTimersByTime(100);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该正确节流函数调用', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 100);

      // 第一次调用立即执行
      throttledFn('first');
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');

      // 在节流期间的调用被忽略
      throttledFn('ignored1');
      throttledFn('ignored2');
      expect(mockFn).toHaveBeenCalledTimes(1);

      // 等待节流时间过去
      vi.advanceTimersByTime(100);
      
      // 现在可以再次执行
      throttledFn('second');
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenCalledWith('second');
    });
  });

  describe('虚拟滚动', () => {
    it('应该正确计算可见项目', () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      const { visibleItems, totalHeight, offsetY, handleScroll } = useVirtualScroll(items, 50, 400);

      // 初始状态
      expect(visibleItems.value).toHaveLength(9); // Math.ceil(400/50) + 1
      expect(totalHeight.value).toBe(50000); // 1000 * 50
      expect(offsetY.value).toBe(0);
    });

    it('应该响应滚动事件', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({ id: i, name: `Item ${i}` }));
      const { visibleItems, offsetY, handleScroll } = useVirtualScroll(items, 50, 400);

      // 模拟滚动事件
      const mockEvent = { target: { scrollTop: 250 } };
      handleScroll(mockEvent);

      // 检查滚动后的状态
      expect(offsetY.value).toBe(250); // Math.floor(250/50) * 50
      expect(visibleItems.value[0].index).toBe(5); // Math.floor(250/50)
    });
  });

  describe('图片预加载', () => {
    it('应该预加载单张图片', async () => {
      const mockImage = {
        onload: null,
        onerror: null,
        src: ''
      };
      
      global.Image = vi.fn(() => mockImage);

      const promise = preloadImage('test.jpg');
      
      // 模拟图片加载成功
      setTimeout(() => {
        mockImage.onload();
      }, 10);

      const result = await promise;
      expect(result).toBe(mockImage);
      expect(mockImage.src).toBe('test.jpg');
    });

    it('应该批量预加载图片', async () => {
      const mockImages = [];
      global.Image = vi.fn(() => {
        const img = {
          onload: null,
          onerror: null,
          src: ''
        };
        mockImages.push(img);
        return img;
      });

      const srcs = ['img1.jpg', 'img2.jpg', 'img3.jpg'];
      const promise = preloadImages(srcs);
      
      // 模拟所有图片加载成功
      setTimeout(() => {
        mockImages.forEach(img => img.onload());
      }, 10);

      const results = await promise;
      expect(results).toHaveLength(3);
      expect(mockImages).toHaveLength(3);
    });
  });

  describe('懒加载', () => {
    it('应该设置懒加载指令', () => {
      const mockElement = {
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        }
      };

      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn()
      };

      global.IntersectionObserver = vi.fn(() => mockObserver);

      const binding = { value: 'test.jpg' };
      lazyLoad.mounted(mockElement, binding);

      expect(mockElement.classList.add).toHaveBeenCalledWith('lazy');
      expect(mockObserver.observe).toHaveBeenCalledWith(mockElement);
    });

    it('应该在元素可见时加载图片', () => {
      const mockElement = {
        classList: {
          add: vi.fn(),
          remove: vi.fn()
        },
        src: ''
      };

      const mockObserver = {
        observe: vi.fn(),
        unobserve: vi.fn()
      };

      let intersectionCallback;
      global.IntersectionObserver = vi.fn((callback) => {
        intersectionCallback = callback;
        return mockObserver;
      });

      const binding = { value: 'test.jpg' };
      lazyLoad.mounted(mockElement, binding);

      // 模拟元素进入视口
      const entries = [{
        target: mockElement,
        isIntersecting: true
      }];

      intersectionCallback(entries);

      expect(mockElement.src).toBe('test.jpg');
      expect(mockElement.classList.remove).toHaveBeenCalledWith('lazy');
      expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement);
    });
  });

  describe('设备信息检测', () => {
    it('应该检测设备类型', () => {
      // 模拟移动设备
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true
      });

      const deviceInfo = getDeviceInfo();
      
      expect(deviceInfo.isMobile).toBe(true);
      expect(deviceInfo.isTablet).toBe(false);
      expect(deviceInfo.isDesktop).toBe(false);
      expect(deviceInfo.userAgent).toContain('iPhone');
    });

    it('应该检测桌面设备', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        configurable: true
      });

      const deviceInfo = getDeviceInfo();
      
      expect(deviceInfo.isMobile).toBe(false);
      expect(deviceInfo.isTablet).toBe(false);
      expect(deviceInfo.isDesktop).toBe(true);
    });
  });

  describe('网络信息检测', () => {
    it('应该获取网络状态', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        configurable: true
      });

      Object.defineProperty(navigator, 'connection', {
        value: {
          effectiveType: '4g',
          downlink: 10,
          rtt: 100
        },
        configurable: true
      });

      const networkInfo = getNetworkInfo();
      
      expect(networkInfo.online).toBe(true);
      expect(networkInfo.effectiveType).toBe('4g');
      expect(networkInfo.downlink).toBe(10);
      expect(networkInfo.rtt).toBe(100);
    });

    it('应该处理不支持的浏览器', () => {
      Object.defineProperty(navigator, 'connection', {
        value: undefined,
        configurable: true
      });

      const networkInfo = getNetworkInfo();
      
      expect(networkInfo.effectiveType).toBe('unknown');
      expect(networkInfo.downlink).toBe(0);
      expect(networkInfo.rtt).toBe(0);
    });
  });

  describe('内存信息检测', () => {
    it('应该获取内存信息', () => {
      Object.defineProperty(performance, 'memory', {
        value: {
          usedJSHeapSize: 1000000,
          totalJSHeapSize: 2000000,
          jsHeapSizeLimit: 4000000
        },
        configurable: true
      });

      const memoryInfo = getMemoryInfo();
      
      expect(memoryInfo.usedJSHeapSize).toBe(1000000);
      expect(memoryInfo.totalJSHeapSize).toBe(2000000);
      expect(memoryInfo.jsHeapSizeLimit).toBe(4000000);
    });

    it('应该处理不支持的浏览器', () => {
      Object.defineProperty(performance, 'memory', {
        value: undefined,
        configurable: true
      });

      const memoryInfo = getMemoryInfo();
      
      expect(memoryInfo).toBe(null);
    });
  });

  describe('性能指标获取', () => {
    it('应该获取性能指标', () => {
      const mockNavigation = {
        loadEventEnd: 2000,
        loadEventStart: 1900,
        domContentLoadedEventEnd: 1800,
        domContentLoadedEventStart: 1700,
        responseStart: 1200,
        requestStart: 1000
      };

      performance.getEntriesByType = vi.fn((type) => {
        if (type === 'navigation') return [mockNavigation];
        return [];
      });

      performance.getEntriesByName = vi.fn((name) => {
        if (name === 'first-contentful-paint') return [{ startTime: 1500 }];
        if (name === 'largest-contentful-paint') return [{ startTime: 1800 }];
        return [];
      });

      const metrics = getPerformanceMetrics();
      
      expect(metrics.loadTime).toBe(100); // 2000 - 1900
      expect(metrics.domParseTime).toBe(100); // 1800 - 1700
      expect(metrics.ttfb).toBe(200); // 1200 - 1000
      expect(metrics.fcp).toBe(1500);
      expect(metrics.lcp).toBe(1800);
    });
  });

  describe('错误监控设置', () => {
    it('应该设置全局错误监听', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
      
      setupErrorMonitoring();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('error', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('unhandledrejection', expect.any(Function));
    });

    it('应该处理全局错误', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      setupErrorMonitoring();
      
      // 模拟全局错误
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 10,
        colno: 5,
        error: new Error('Test error')
      });
      
      window.dispatchEvent(errorEvent);
      
      expect(consoleSpy).toHaveBeenCalledWith('Global Error:', expect.any(Object));
      
      consoleSpy.mockRestore();
    });
  });

  describe('性能测试', () => {
    it('防抖函数应该高效执行', () => {
      const mockFn = vi.fn();
      const debouncedFn = debounce(mockFn, 10);
      
      const start = performance.now();
      
      // 大量快速调用
      for (let i = 0; i < 1000; i++) {
        debouncedFn(i);
      }
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // 应该在50ms内完成
      expect(mockFn).not.toHaveBeenCalled(); // 还未执行
    });

    it('节流函数应该高效执行', () => {
      const mockFn = vi.fn();
      const throttledFn = throttle(mockFn, 10);
      
      const start = performance.now();
      
      // 大量快速调用
      for (let i = 0; i < 1000; i++) {
        throttledFn(i);
      }
      
      const end = performance.now();
      
      expect(end - start).toBeLessThan(50); // 应该在50ms内完成
      expect(mockFn).toHaveBeenCalledTimes(1); // 只执行一次
    });
  });

  describe('边界条件', () => {
    it('应该处理极端参数', () => {
      expect(() => debounce(() => {}, 0)).not.toThrow();
      expect(() => throttle(() => {}, 0)).not.toThrow();
      expect(() => debounce(() => {}, -1)).not.toThrow();
      expect(() => throttle(() => {}, -1)).not.toThrow();
    });

    it('应该处理空函数', () => {
      expect(() => debounce(null, 100)).not.toThrow();
      expect(() => throttle(undefined, 100)).not.toThrow();
    });

    it('应该处理大数据量虚拟滚动', () => {
      const largeItems = Array.from({ length: 100000 }, (_, i) => ({ id: i }));
      
      expect(() => {
        useVirtualScroll(largeItems, 50, 400);
      }).not.toThrow();
    });
  });

  describe('设备兼容性测试', () => {
    it('应该在不同设备上正确检测', () => {
      const testCases = [
        {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
          expected: { isMobile: true, isTablet: false, isDesktop: false }
        },
        {
          userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
          expected: { isMobile: true, isTablet: true, isDesktop: false }
        },
        {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          expected: { isMobile: false, isTablet: false, isDesktop: true }
        }
      ];

      testCases.forEach(({ userAgent, expected }) => {
        Object.defineProperty(navigator, 'userAgent', {
          value: userAgent,
          configurable: true
        });

        const deviceInfo = getDeviceInfo();
        expect(deviceInfo.isMobile).toBe(expected.isMobile);
        expect(deviceInfo.isTablet).toBe(expected.isTablet);
        expect(deviceInfo.isDesktop).toBe(expected.isDesktop);
      });
    });
  });
});