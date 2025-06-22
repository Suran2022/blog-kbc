// 首页组件单元测试
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Home from '../../pages/Home.vue';
import ElementPlus from 'element-plus';

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
};

const mockRoute = {
  query: {},
  path: '/'
};

// 模拟API
const mockApi = {
  getArticles: vi.fn(),
  getPopularArticles: vi.fn(),
  getLatestArticles: vi.fn(),
  getCategories: vi.fn(),
  getTags: vi.fn()
};

// 模拟数据
const mockArticles = [
  {
    id: 1,
    title: '测试文章1',
    summary: '这是测试文章1的摘要',
    author: '作者1',
    publishTime: '2024-01-01',
    category: 'Vue.js',
    tags: ['Vue', 'JavaScript'],
    viewCount: 100,
    likeCount: 10
  },
  {
    id: 2,
    title: '测试文章2',
    summary: '这是测试文章2的摘要',
    author: '作者2',
    publishTime: '2024-01-02',
    category: 'React',
    tags: ['React', 'JavaScript'],
    viewCount: 150,
    likeCount: 15
  }
];

const mockCategories = [
  { id: 1, name: 'Vue.js', count: 10 },
  { id: 2, name: 'React', count: 8 },
  { id: 3, name: 'JavaScript', count: 15 }
];

const mockTags = [
  { id: 1, name: 'Vue', count: 12 },
  { id: 2, name: 'React', count: 8 },
  { id: 3, name: 'JavaScript', count: 20 }
];

describe('Home', () => {
  let wrapper;

  beforeEach(() => {
    // 重置模拟函数
    vi.clearAllMocks();
    
    // 设置API模拟返回值
    mockApi.getArticles.mockResolvedValue({
      data: mockArticles,
      total: mockArticles.length,
      currentPage: 1,
      pageSize: 10
    });
    
    mockApi.getPopularArticles.mockResolvedValue(mockArticles.slice(0, 5));
    mockApi.getLatestArticles.mockResolvedValue(mockArticles.slice(0, 5));
    mockApi.getCategories.mockResolvedValue(mockCategories);
    mockApi.getTags.mockResolvedValue(mockTags);

    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('应该正确渲染首页', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.home-page').exists()).toBe(true);
  });

  it('应该在挂载时加载数据', async () => {
    await nextTick();
    
    expect(mockApi.getArticles).toHaveBeenCalled();
    expect(mockApi.getPopularArticles).toHaveBeenCalled();
    expect(mockApi.getLatestArticles).toHaveBeenCalled();
    expect(mockApi.getCategories).toHaveBeenCalled();
    expect(mockApi.getTags).toHaveBeenCalled();
  });

  it('应该正确显示文章列表', async () => {
    await nextTick();
    
    const articleCards = wrapper.findAll('.article-card');
    expect(articleCards.length).toBeGreaterThan(0);
  });

  it('应该正确显示热门文章', async () => {
    await nextTick();
    
    const popularSection = wrapper.find('.popular-articles');
    expect(popularSection.exists()).toBe(true);
  });

  it('应该正确显示最新文章', async () => {
    await nextTick();
    
    const latestSection = wrapper.find('.latest-articles');
    expect(latestSection.exists()).toBe(true);
  });

  it('应该正确显示分类列表', async () => {
    await nextTick();
    
    const categoriesSection = wrapper.find('.categories-section');
    expect(categoriesSection.exists()).toBe(true);
  });

  it('应该正确显示标签云', async () => {
    await nextTick();
    
    const tagsSection = wrapper.find('.tags-section');
    expect(tagsSection.exists()).toBe(true);
  });

  it('应该支持分页功能', async () => {
    await nextTick();
    
    const pagination = wrapper.find('.pagination');
    expect(pagination.exists()).toBe(true);
  });

  it('应该在页码变化时重新加载数据', async () => {
    await nextTick();
    
    // 模拟页码变化
    await wrapper.vm.handlePageChange(2);
    
    expect(mockApi.getArticles).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    );
  });

  it('应该支持搜索功能', async () => {
    const searchQuery = '测试搜索';
    
    await wrapper.vm.handleSearch(searchQuery);
    
    expect(mockApi.getArticles).toHaveBeenCalledWith(
      expect.objectContaining({ search: searchQuery })
    );
  });

  it('应该支持分类筛选', async () => {
    const categoryId = 1;
    
    await wrapper.vm.handleCategoryFilter(categoryId);
    
    expect(mockApi.getArticles).toHaveBeenCalledWith(
      expect.objectContaining({ category: categoryId })
    );
  });

  it('应该支持标签筛选', async () => {
    const tagId = 1;
    
    await wrapper.vm.handleTagFilter(tagId);
    
    expect(mockApi.getArticles).toHaveBeenCalledWith(
      expect.objectContaining({ tag: tagId })
    );
  });
});

// 数据加载测试
describe('Home Data Loading', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('应该在加载时显示加载状态', async () => {
    // 模拟延迟的API调用
    mockApi.getArticles.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({
        data: mockArticles,
        total: mockArticles.length
      }), 100))
    );
    
    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
    
    // 检查加载状态
    expect(wrapper.find('.loading').exists()).toBe(true);
    
    // 等待加载完成
    await new Promise(resolve => setTimeout(resolve, 150));
    await nextTick();
    
    expect(wrapper.find('.loading').exists()).toBe(false);
  });

  it('应该正确处理API错误', async () => {
    const errorMessage = '网络错误';
    mockApi.getArticles.mockRejectedValue(new Error(errorMessage));
    
    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
    
    await nextTick();
    
    // 检查错误状态
    expect(wrapper.vm.error).toBeTruthy();
  });

  it('应该支持重新加载数据', async () => {
    mockApi.getArticles.mockResolvedValue({
      data: mockArticles,
      total: mockArticles.length
    });
    
    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
    
    await nextTick();
    
    // 重新加载
    await wrapper.vm.reload();
    
    expect(mockApi.getArticles).toHaveBeenCalledTimes(2);
  });

  it('应该正确处理空数据', async () => {
    mockApi.getArticles.mockResolvedValue({
      data: [],
      total: 0
    });
    
    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
    
    await nextTick();
    
    expect(wrapper.find('.empty-state').exists()).toBe(true);
  });
});

// 交互测试
describe('Home Interactions', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockApi.getArticles.mockResolvedValue({
      data: mockArticles,
      total: mockArticles.length
    });
    
    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('应该在点击文章时跳转到详情页', async () => {
    await nextTick();
    
    const articleCard = wrapper.find('.article-card');
    await articleCard.trigger('click');
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('/article/')
    );
  });

  it('应该在点击分类时进行筛选', async () => {
    await nextTick();
    
    const categoryItem = wrapper.find('.category-item');
    await categoryItem.trigger('click');
    
    expect(wrapper.vm.selectedCategory).toBeTruthy();
  });

  it('应该在点击标签时进行筛选', async () => {
    await nextTick();
    
    const tagItem = wrapper.find('.tag-item');
    await tagItem.trigger('click');
    
    expect(wrapper.vm.selectedTag).toBeTruthy();
  });

  it('应该支持清除筛选条件', async () => {
    await nextTick();
    
    // 设置筛选条件
    wrapper.vm.selectedCategory = 1;
    wrapper.vm.selectedTag = 1;
    
    // 清除筛选
    await wrapper.vm.clearFilters();
    
    expect(wrapper.vm.selectedCategory).toBeNull();
    expect(wrapper.vm.selectedTag).toBeNull();
  });

  it('应该支持排序功能', async () => {
    await nextTick();
    
    const sortOptions = ['latest', 'popular', 'views'];
    
    for (const sortBy of sortOptions) {
      await wrapper.vm.handleSort(sortBy);
      
      expect(mockApi.getArticles).toHaveBeenCalledWith(
        expect.objectContaining({ sortBy })
      );
    }
  });
});

// 响应式测试
describe('Home Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('mobile');
    
    wrapper.unmount();
  });

  it('应该在桌面端显示完整布局', () => {
    // 模拟桌面端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).not.toContain('mobile');
    
    wrapper.unmount();
  });
});

// 性能测试
describe('Home Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    const wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 渲染时间应该少于100ms
    expect(renderTime).toBeLessThan(100);
    
    wrapper.unmount();
  });

  it('应该正确处理大量数据', async () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      title: `文章${i + 1}`,
      summary: `这是文章${i + 1}的摘要`,
      author: `作者${i + 1}`,
      publishTime: '2024-01-01',
      category: 'Vue.js',
      tags: ['Vue', 'JavaScript'],
      viewCount: Math.floor(Math.random() * 1000),
      likeCount: Math.floor(Math.random() * 100)
    }));

    mockApi.getArticles.mockResolvedValue({
      data: largeDataset.slice(0, 20), // 分页显示
      total: largeDataset.length
    });

    const wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });

    await nextTick();

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.findAll('.article-card').length).toBeLessThanOrEqual(20);
    
    wrapper.unmount();
  });
});

// 边界条件测试
describe('Home Edge Cases', () => {
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('应该正确处理网络超时', async () => {
    mockApi.getArticles.mockImplementation(() => 
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('网络超时')), 100)
      )
    );

    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 150));
    await nextTick();

    expect(wrapper.vm.error).toBeTruthy();
  });

  it('应该正确处理无效的分页参数', async () => {
    mockApi.getArticles.mockResolvedValue({
      data: mockArticles,
      total: mockArticles.length
    });

    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: {
            query: { page: 'invalid' },
            path: '/'
          },
          $api: mockApi
        }
      }
    });

    await nextTick();

    // 应该使用默认页码
    expect(wrapper.vm.currentPage).toBe(1);
  });

  it('应该正确处理超出范围的页码', async () => {
    mockApi.getArticles.mockResolvedValue({
      data: [],
      total: 10
    });

    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: {
            query: { page: '999' },
            path: '/'
          },
          $api: mockApi
        }
      }
    });

    await nextTick();

    // 应该重定向到有效页码
    expect(mockRouter.replace).toHaveBeenCalled();
  });

  it('应该正确处理同时进行的多个API调用', async () => {
    let resolveCount = 0;
    const mockPromise = () => new Promise(resolve => {
      setTimeout(() => {
        resolveCount++;
        resolve({ data: mockArticles, total: mockArticles.length });
      }, 50);
    });

    mockApi.getArticles.mockImplementation(mockPromise);
    mockApi.getPopularArticles.mockImplementation(mockPromise);
    mockApi.getLatestArticles.mockImplementation(mockPromise);

    wrapper = mount(Home, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute,
          $api: mockApi
        }
      }
    });

    await new Promise(resolve => setTimeout(resolve, 100));
    await nextTick();

    expect(resolveCount).toBeGreaterThan(0);
  });
});