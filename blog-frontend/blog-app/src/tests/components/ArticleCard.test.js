// 文章卡片组件单元测试
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import ArticleCard from '../../components/common/ArticleCard.vue';
import { formatDate } from '../../utils';

// 模拟路由
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/article/:id', name: 'ArticleDetail', component: { template: '<div>Article Detail</div>' } }
  ]
});

// 模拟文章数据
const mockArticle = {
  id: 1,
  title: '测试文章标题',
  summary: '这是一篇测试文章的摘要内容，用于验证组件的显示效果。',
  content: '文章的详细内容...',
  createdAt: '2023-12-01T10:00:00Z',
  views: 1234,
  category: {
    id: 1,
    name: '技术分享'
  },
  author: {
    id: 1,
    name: '测试作者'
  }
};

describe('ArticleCard', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ArticleCard, {
      props: {
        article: mockArticle,
        showSummary: true
      },
      global: {
        plugins: [router]
      }
    });
  });

  it('应该正确渲染文章标题', () => {
    const title = wrapper.find('.article-title');
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe(mockArticle.title);
  });

  it('应该正确渲染文章摘要', () => {
    const summary = wrapper.find('.article-summary');
    expect(summary.exists()).toBe(true);
    expect(summary.text()).toBe(mockArticle.summary);
  });

  it('应该正确显示文章分类', () => {
    const category = wrapper.find('.article-category');
    expect(category.exists()).toBe(true);
    expect(category.text()).toContain(mockArticle.category.name);
  });

  it('应该正确显示文章阅读量', () => {
    const views = wrapper.find('.article-views');
    expect(views.exists()).toBe(true);
    expect(views.text()).toContain(mockArticle.views.toString());
  });

  it('应该正确格式化并显示创建时间', () => {
    const date = wrapper.find('.article-date');
    expect(date.exists()).toBe(true);
    expect(date.text()).toContain(formatDate(mockArticle.createdAt));
  });

  it('当showSummary为false时不应该显示摘要', async () => {
    await wrapper.setProps({ showSummary: false });
    const summary = wrapper.find('.article-summary');
    expect(summary.exists()).toBe(false);
  });

  it('点击卡片应该跳转到文章详情页', async () => {
    const card = wrapper.find('.article-card');
    expect(card.exists()).toBe(true);
    
    // 模拟点击事件
    await card.trigger('click');
    
    // 验证路由跳转
    expect(router.currentRoute.value.name).toBe('ArticleDetail');
    expect(router.currentRoute.value.params.id).toBe(mockArticle.id.toString());
  });

  it('应该正确处理没有分类的文章', async () => {
    const articleWithoutCategory = { ...mockArticle, category: null };
    await wrapper.setProps({ article: articleWithoutCategory });
    
    const category = wrapper.find('.article-category');
    expect(category.exists()).toBe(false);
  });

  it('应该正确处理长标题的截断', async () => {
    const longTitle = '这是一个非常长的文章标题，用于测试标题截断功能是否正常工作，应该会被正确地截断显示';
    const articleWithLongTitle = { ...mockArticle, title: longTitle };
    await wrapper.setProps({ article: articleWithLongTitle });
    
    const title = wrapper.find('.article-title');
    expect(title.text()).toBe(longTitle);
    
    // 检查CSS类是否正确应用（用于截断）
    expect(title.element.style.overflow).toBe('hidden');
  });

  it('应该在悬停时显示正确的样式', async () => {
    const card = wrapper.find('.article-card');
    
    // 模拟鼠标悬停
    await card.trigger('mouseenter');
    
    // 检查是否有悬停效果的类或样式
    expect(card.element.style.cursor).toBe('pointer');
  });
});

// 测试工具函数
describe('ArticleCard Utils', () => {
  it('formatDate应该正确格式化日期', () => {
    const testDate = '2023-12-01T10:00:00Z';
    const formatted = formatDate(testDate);
    
    // 验证格式化结果不为空
    expect(formatted).toBeTruthy();
    expect(typeof formatted).toBe('string');
  });
});

// 性能测试
describe('ArticleCard Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    mount(ArticleCard, {
      props: {
        article: mockArticle,
        showSummary: true
      },
      global: {
        plugins: [router]
      }
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 渲染时间应该少于100ms
    expect(renderTime).toBeLessThan(100);
  });

  it('应该正确处理大量数据', () => {
    const largeArticle = {
      ...mockArticle,
      title: 'A'.repeat(1000),
      summary: 'B'.repeat(5000),
      content: 'C'.repeat(10000)
    };
    
    expect(() => {
      mount(ArticleCard, {
        props: {
          article: largeArticle,
          showSummary: true
        },
        global: {
          plugins: [router]
        }
      });
    }).not.toThrow();
  });
});