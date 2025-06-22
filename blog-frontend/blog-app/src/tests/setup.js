// 测试环境设置文件
import { vi } from 'vitest';
import { config } from '@vue/test-utils';
import ElementPlus from 'element-plus';

// 全局配置 Vue Test Utils
config.global.plugins = [ElementPlus];

// 模拟浏览器 API
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 模拟 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 模拟 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 模拟 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// 模拟 sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// 模拟 URL 和 URLSearchParams
global.URL = URL;
global.URLSearchParams = URLSearchParams;

// 模拟 fetch
global.fetch = vi.fn();

// 模拟 console 方法（可选，用于测试时减少噪音）
if (process.env.NODE_ENV === 'test') {
  global.console = {
    ...console,
    // 保留 error 和 warn，但可以选择性地静默其他输出
    log: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: console.warn,
    error: console.error,
  };
}

// 模拟 performance API
Object.defineProperty(window, 'performance', {
  value: {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => []),
  }
});

// 模拟 requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = vi.fn(id => clearTimeout(id));

// 模拟 Image 构造函数
global.Image = class {
  constructor() {
    setTimeout(() => {
      this.onload && this.onload();
    }, 100);
  }
};

// 模拟 FileReader
global.FileReader = class {
  constructor() {
    this.readAsDataURL = vi.fn();
    this.readAsText = vi.fn();
    this.readAsArrayBuffer = vi.fn();
    this.readAsBinaryString = vi.fn();
  }
};

// 模拟 Blob
global.Blob = class {
  constructor(parts, options) {
    this.parts = parts;
    this.options = options;
    this.size = parts.reduce((acc, part) => acc + part.length, 0);
    this.type = options?.type || '';
  }
};

// 模拟 File
global.File = class extends Blob {
  constructor(parts, name, options) {
    super(parts, options);
    this.name = name;
    this.lastModified = Date.now();
  }
};

// 设置默认的视口尺寸
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

// 模拟 CSS 媒体查询
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => '',
  }),
});

// 模拟 Element 方法
Element.prototype.scrollIntoView = vi.fn();
Element.prototype.scrollTo = vi.fn();

// 模拟 HTMLElement 方法
HTMLElement.prototype.click = vi.fn();
HTMLElement.prototype.focus = vi.fn();
HTMLElement.prototype.blur = vi.fn();

// 设置测试环境变量
process.env.NODE_ENV = 'test';
process.env.VUE_APP_API_BASE_URL = 'http://localhost:8080/api';

// 全局错误处理
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// 清理函数，在每个测试后运行
afterEach(() => {
  vi.clearAllMocks();
  vi.clearAllTimers();
  
  // 清理 localStorage 和 sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();
  
  // 重置 DOM
  document.body.innerHTML = '';
  
  // 重置视口尺寸
  window.innerWidth = 1024;
  window.innerHeight = 768;
});

// 全局测试工具函数
global.testUtils = {
  // 等待 DOM 更新
  waitForUpdate: async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  },
  
  // 模拟用户输入
  mockUserInput: (element, value) => {
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
  },
  
  // 模拟点击事件
  mockClick: (element) => {
    element.dispatchEvent(new Event('click', { bubbles: true }));
  },
  
  // 模拟键盘事件
  mockKeyboard: (element, key, type = 'keydown') => {
    element.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));
  },
  
  // 模拟文件上传
  mockFileUpload: (input, files) => {
    Object.defineProperty(input, 'files', {
      value: files,
      writable: false,
    });
    input.dispatchEvent(new Event('change', { bubbles: true }));
  },
  
  // 模拟网络请求
  mockApiResponse: (data, status = 200) => {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(data),
      text: () => Promise.resolve(JSON.stringify(data)),
    });
  },
  
  // 模拟延迟
  delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
};

// 导出常用的测试数据
export const mockData = {
  user: {
    id: 1,
    name: '测试用户',
    email: 'test@example.com',
    avatar: '/avatar.jpg'
  },
  
  article: {
    id: 1,
    title: '测试文章',
    content: '这是测试文章内容',
    author: '测试作者',
    publishTime: '2024-01-01',
    category: 'Vue.js',
    tags: ['Vue', 'JavaScript']
  },
  
  comment: {
    id: 1,
    content: '测试评论',
    author: '评论者',
    createTime: '2024-01-01'
  }
};

console.log('测试环境设置完成');