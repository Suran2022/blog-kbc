// 文章详情页单元测试
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import ArticleDetail from '../../pages/ArticleDetail.vue';
import ElementPlus from 'element-plus';

// 模拟路由
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn()
};

const mockRoute = {
  params: { id: '1' },
  query: {},
  path: '/article/1'
};

// 模拟API
const mockApi = {
  getArticleDetail: vi.fn(),
  getRelatedArticles: vi.fn(),
  getComments: vi.fn(),
  addComment: vi.fn(),
  likeArticle: vi.fn(),
  collectArticle: vi.fn(),
  increaseViewCount: vi.fn()
};

// 模拟数据
const mockArticle = {
  id: 1,
  title: '测试文章标题',
  content: '这是一篇测试文章的内容，包含了丰富的文本和格式。',
  summary: '文章摘要',
  author: {
    id: 1,
    name: '测试作者',
    avatar: '/avatar.jpg'
  },
  publishTime: '2024-01-01T10:00:00Z',
  updateTime: '2024-01-02T10:00:00Z',
  category: {
    id: 1,
    name: 'Vue.js'
  },
  tags: [
    { id: 1, name: 'Vue', color: '#42b883' },
    { id: 2, name: 'JavaScript', color: '#f7df1e' }
  ],
  viewCount: 100,
  likeCount: 15,
  collectCount: 8,
  commentCount: 5,
  isLiked: false,
  isCollected: false
};

const mockComments = [
  {
    id: 1,
    content: '这是一条测试评论',
    author: {
      id: 2,
      name: '评论者1',
      avatar: '/avatar2.jpg'
    },
    createTime: '2024-01-01T12:00:00Z',
    likeCount: 3,
    isLiked: false,
    replies: [
      {
        id: 2,
        content: '这是一条回复',
        author: {
          id: 3,
          name: '回复者1',
          avatar: '/avatar3.jpg'
        },
        createTime: '2024-01-01T13:00:00Z',
        likeCount: 1,
        isLiked: false
      }
    ]
  }
];

const mockRelatedArticles = [
  {
    id: 2,
    title: '相关文章1',
    summary: '相关文章1的摘要',
    publishTime: '2024-01-01',
    viewCount: 50
  },
  {
    id: 3,
    title: '相关文章2',
    summary: '相关文章2的摘要',
    publishTime: '2024-01-02',
    viewCount: 75
  }
];

describe('ArticleDetail', () => {
  let wrapper;

  beforeEach(() => {
    // 重置模拟函数
    vi.clearAllMocks();
    
    // 设置API模拟返回值
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    mockApi.getRelatedArticles.mockResolvedValue(mockRelatedArticles);
    mockApi.getComments.mockResolvedValue({
      data: mockComments,
      total: mockComments.length
    });
    mockApi.increaseViewCount.mockResolvedValue();

    wrapper = mount(ArticleDetail, {
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

  it('应该正确渲染文章详情页', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.article-detail').exists()).toBe(true);
  });

  it('应该在挂载时加载文章数据', async () => {
    await nextTick();
    
    expect(mockApi.getArticleDetail).toHaveBeenCalledWith('1');
    expect(mockApi.getRelatedArticles).toHaveBeenCalledWith('1');
    expect(mockApi.getComments).toHaveBeenCalledWith('1');
    expect(mockApi.increaseViewCount).toHaveBeenCalledWith('1');
  });

  it('应该正确显示文章标题', async () => {
    await nextTick();
    
    expect(wrapper.find('.article-title').text()).toContain(mockArticle.title);
  });

  it('应该正确显示文章内容', async () => {
    await nextTick();
    
    expect(wrapper.find('.article-content').text()).toContain(mockArticle.content);
  });

  it('应该正确显示文章元信息', async () => {
    await nextTick();
    
    expect(wrapper.text()).toContain(mockArticle.author.name);
    expect(wrapper.text()).toContain(mockArticle.category.name);
    expect(wrapper.text()).toContain(mockArticle.viewCount.toString());
    expect(wrapper.text()).toContain(mockArticle.likeCount.toString());
  });

  it('应该正确显示文章标签', async () => {
    await nextTick();
    
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements.length).toBeGreaterThan(0);
    
    mockArticle.tags.forEach(tag => {
      expect(wrapper.text()).toContain(tag.name);
    });
  });

  it('应该正确显示相关文章', async () => {
    await nextTick();
    
    const relatedSection = wrapper.find('.related-articles');
    expect(relatedSection.exists()).toBe(true);
    
    const relatedItems = wrapper.findAll('.related-article-item');
    expect(relatedItems.length).toBe(mockRelatedArticles.length);
  });

  it('应该正确显示评论列表', async () => {
    await nextTick();
    
    const commentsSection = wrapper.find('.comments-section');
    expect(commentsSection.exists()).toBe(true);
    
    const commentItems = wrapper.findAll('.comment-item');
    expect(commentItems.length).toBeGreaterThan(0);
  });
});

// 文章交互测试
describe('ArticleDetail Interactions', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    mockApi.getRelatedArticles.mockResolvedValue(mockRelatedArticles);
    mockApi.getComments.mockResolvedValue({
      data: mockComments,
      total: mockComments.length
    });
    mockApi.likeArticle.mockResolvedValue({ success: true });
    mockApi.collectArticle.mockResolvedValue({ success: true });

    wrapper = mount(ArticleDetail, {
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

  it('应该支持点赞功能', async () => {
    await nextTick();
    
    const likeButton = wrapper.find('.like-button');
    await likeButton.trigger('click');
    
    expect(mockApi.likeArticle).toHaveBeenCalledWith('1');
  });

  it('应该支持收藏功能', async () => {
    await nextTick();
    
    const collectButton = wrapper.find('.collect-button');
    await collectButton.trigger('click');
    
    expect(mockApi.collectArticle).toHaveBeenCalledWith('1');
  });

  it('应该支持分享功能', async () => {
    await nextTick();
    
    const shareButton = wrapper.find('.share-button');
    await shareButton.trigger('click');
    
    expect(wrapper.find('.share-modal').exists()).toBe(true);
  });

  it('应该在点击相关文章时跳转', async () => {
    await nextTick();
    
    const relatedArticle = wrapper.find('.related-article-item');
    await relatedArticle.trigger('click');
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.stringContaining('/article/')
    );
  });

  it('应该在点击标签时进行筛选', async () => {
    await nextTick();
    
    const tagItem = wrapper.find('.tag-item');
    await tagItem.trigger('click');
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/',
        query: expect.objectContaining({ tag: expect.any(String) })
      })
    );
  });

  it('应该在点击分类时进行筛选', async () => {
    await nextTick();
    
    const categoryItem = wrapper.find('.category-item');
    await categoryItem.trigger('click');
    
    expect(mockRouter.push).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/',
        query: expect.objectContaining({ category: expect.any(String) })
      })
    );
  });
});

// 评论功能测试
describe('ArticleDetail Comments', () => {
  let wrapper;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    mockApi.getComments.mockResolvedValue({
      data: mockComments,
      total: mockComments.length
    });
    mockApi.addComment.mockResolvedValue({
      id: 3,
      content: '新评论',
      author: { id: 4, name: '新用户' },
      createTime: new Date().toISOString()
    });

    wrapper = mount(ArticleDetail, {
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

  it('应该支持添加评论', async () => {
    await nextTick();
    
    const commentInput = wrapper.find('.comment-input');
    const submitButton = wrapper.find('.comment-submit');
    
    await commentInput.setValue('这是一条新评论');
    await submitButton.trigger('click');
    
    expect(mockApi.addComment).toHaveBeenCalledWith('1', {
      content: '这是一条新评论'
    });
  });

  it('应该支持回复评论', async () => {
    await nextTick();
    
    const replyButton = wrapper.find('.reply-button');
    await replyButton.trigger('click');
    
    expect(wrapper.find('.reply-form').exists()).toBe(true);
  });

  it('应该支持评论分页', async () => {
    await nextTick();
    
    const pagination = wrapper.find('.comments-pagination');
    expect(pagination.exists()).toBe(true);
  });

  it('应该支持评论排序', async () => {
    await nextTick();
    
    const sortSelect = wrapper.find('.comment-sort');
    await sortSelect.setValue('latest');
    
    expect(mockApi.getComments).toHaveBeenCalledWith('1', {
      sortBy: 'latest'
    });
  });

  it('应该正确显示评论回复', async () => {
    await nextTick();
    
    const replyItems = wrapper.findAll('.reply-item');
    expect(replyItems.length).toBeGreaterThan(0);
  });
});

// 数据加载测试
describe('ArticleDetail Data Loading', () => {
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
    mockApi.getArticleDetail.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(mockArticle), 100))
    );
    
    wrapper = mount(ArticleDetail, {
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

  it('应该正确处理文章不存在的情况', async () => {
    mockApi.getArticleDetail.mockRejectedValue(new Error('文章不存在'));
    
    wrapper = mount(ArticleDetail, {
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
    
    expect(wrapper.find('.not-found').exists()).toBe(true);
  });

  it('应该正确处理网络错误', async () => {
    mockApi.getArticleDetail.mockRejectedValue(new Error('网络错误'));
    
    wrapper = mount(ArticleDetail, {
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
    
    expect(wrapper.vm.error).toBeTruthy();
  });

  it('应该支持重新加载', async () => {
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    
    wrapper = mount(ArticleDetail, {
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
    
    expect(mockApi.getArticleDetail).toHaveBeenCalledTimes(2);
  });
});

// 响应式测试
describe('ArticleDetail Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(ArticleDetail, {
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

    const wrapper = mount(ArticleDetail, {
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
describe('ArticleDetail Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    const wrapper = mount(ArticleDetail, {
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

  it('应该正确处理长文章内容', async () => {
    const longArticle = {
      ...mockArticle,
      content: 'a'.repeat(100000) // 10万字符的长文章
    };

    mockApi.getArticleDetail.mockResolvedValue(longArticle);

    const wrapper = mount(ArticleDetail, {
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
    expect(wrapper.find('.article-content').exists()).toBe(true);
    
    wrapper.unmount();
  });
});

// 边界条件测试
describe('ArticleDetail Edge Cases', () => {
  let wrapper;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  it('应该正确处理无效的文章ID', async () => {
    mockApi.getArticleDetail.mockRejectedValue(new Error('无效ID'));

    wrapper = mount(ArticleDetail, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: {
            params: { id: 'invalid' },
            query: {},
            path: '/article/invalid'
          },
          $api: mockApi
        }
      }
    });

    await nextTick();

    expect(wrapper.vm.error).toBeTruthy();
  });

  it('应该正确处理空的评论列表', async () => {
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    mockApi.getComments.mockResolvedValue({
      data: [],
      total: 0
    });

    wrapper = mount(ArticleDetail, {
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

    expect(wrapper.find('.empty-comments').exists()).toBe(true);
  });

  it('应该正确处理没有相关文章的情况', async () => {
    mockApi.getArticleDetail.mockResolvedValue(mockArticle);
    mockApi.getRelatedArticles.mockResolvedValue([]);

    wrapper = mount(ArticleDetail, {
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

    const relatedSection = wrapper.find('.related-articles');
    expect(relatedSection.exists()).toBe(false);
  });

  it('应该正确处理文章内容为空的情况', async () => {
    const emptyArticle = {
      ...mockArticle,
      content: ''
    };

    mockApi.getArticleDetail.mockResolvedValue(emptyArticle);

    wrapper = mount(ArticleDetail, {
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

    expect(wrapper.find('.empty-content').exists()).toBe(true);
  });

  it('应该正确处理同时进行的多个API调用', async () => {
    let resolveCount = 0;
    const mockPromise = (data) => new Promise(resolve => {
      setTimeout(() => {
        resolveCount++;
        resolve(data);
      }, 50);
    });

    mockApi.getArticleDetail.mockImplementation(() => mockPromise(mockArticle));
    mockApi.getRelatedArticles.mockImplementation(() => mockPromise(mockRelatedArticles));
    mockApi.getComments.mockImplementation(() => mockPromise({ data: mockComments, total: mockComments.length }));

    wrapper = mount(ArticleDetail, {
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