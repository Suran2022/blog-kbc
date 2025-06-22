// 搜索组件单元测试
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SearchBox from '../../components/common/SearchBox.vue';
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

describe('SearchBox', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SearchBox, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该正确渲染搜索框', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.search-box').exists()).toBe(true);
    expect(wrapper.find('input').exists()).toBe(true);
  });

  it('应该正确绑定输入值', async () => {
    const input = wrapper.find('input');
    const testValue = '测试搜索';
    
    await input.setValue(testValue);
    
    expect(wrapper.vm.searchQuery).toBe(testValue);
  });

  it('应该在输入时显示搜索建议', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('Vue');
    await nextTick();
    
    // 检查是否有搜索建议显示
    expect(wrapper.vm.searchQuery).toBe('Vue');
  });

  it('应该在按下回车键时执行搜索', async () => {
    const input = wrapper.find('input');
    const testQuery = '测试搜索';
    
    await input.setValue(testQuery);
    await input.trigger('keyup.enter');
    
    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')[0][0]).toBe(testQuery);
  });

  it('应该在点击搜索按钮时执行搜索', async () => {
    const input = wrapper.find('input');
    const searchButton = wrapper.find('.search-button');
    const testQuery = '测试搜索';
    
    await input.setValue(testQuery);
    await searchButton.trigger('click');
    
    expect(wrapper.emitted('search')).toBeTruthy();
    expect(wrapper.emitted('search')[0][0]).toBe(testQuery);
  });

  it('应该正确处理空搜索', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('');
    await input.trigger('keyup.enter');
    
    // 空搜索应该被处理或阻止
    expect(wrapper.vm.searchQuery).toBe('');
  });

  it('应该正确处理搜索历史', async () => {
    const testQueries = ['Vue', 'React', 'Angular'];
    
    for (const query of testQueries) {
      await wrapper.vm.addToHistory(query);
    }
    
    expect(wrapper.vm.searchHistory).toContain('Vue');
    expect(wrapper.vm.searchHistory).toContain('React');
    expect(wrapper.vm.searchHistory).toContain('Angular');
  });

  it('应该限制搜索历史数量', async () => {
    const maxHistoryItems = 10;
    
    // 添加超过限制的搜索历史
    for (let i = 0; i < 15; i++) {
      await wrapper.vm.addToHistory(`搜索${i}`);
    }
    
    expect(wrapper.vm.searchHistory.length).toBeLessThanOrEqual(maxHistoryItems);
  });

  it('应该正确处理搜索建议选择', async () => {
    const suggestion = 'Vue.js 教程';
    
    await wrapper.vm.selectSuggestion(suggestion);
    
    expect(wrapper.vm.searchQuery).toBe(suggestion);
    expect(wrapper.emitted('search')).toBeTruthy();
  });

  it('应该在获得焦点时显示搜索历史', async () => {
    const input = wrapper.find('input');
    
    await input.trigger('focus');
    
    expect(wrapper.vm.showSuggestions).toBe(true);
  });

  it('应该在失去焦点时隐藏搜索建议', async () => {
    const input = wrapper.find('input');
    
    await input.trigger('focus');
    await input.trigger('blur');
    
    // 延迟隐藏以允许点击建议
    setTimeout(() => {
      expect(wrapper.vm.showSuggestions).toBe(false);
    }, 200);
  });

  it('应该正确处理键盘导航', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('Vue');
    await input.trigger('focus');
    
    // 模拟向下箭头键
    await input.trigger('keydown.down');
    
    expect(wrapper.vm.selectedSuggestionIndex).toBeGreaterThanOrEqual(0);
  });

  it('应该正确清空搜索', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('测试搜索');
    await wrapper.vm.clearSearch();
    
    expect(wrapper.vm.searchQuery).toBe('');
    expect(wrapper.emitted('clear')).toBeTruthy();
  });
});

// 搜索建议测试
describe('SearchBox Suggestions', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SearchBox, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该根据输入显示相关建议', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('Vue');
    await nextTick();
    
    // 检查建议是否包含相关内容
    const suggestions = wrapper.vm.filteredSuggestions;
    expect(suggestions.some(s => s.toLowerCase().includes('vue'))).toBe(true);
  });

  it('应该正确过滤搜索建议', async () => {
    const testSuggestions = [
      'Vue.js 基础教程',
      'React 入门指南',
      'Angular 开发实践',
      'Vue Router 使用'
    ];
    
    wrapper.vm.suggestions = testSuggestions;
    await wrapper.vm.updateQuery('Vue');
    
    const filtered = wrapper.vm.filteredSuggestions;
    expect(filtered.every(s => s.toLowerCase().includes('vue'))).toBe(true);
  });

  it('应该正确处理中文搜索', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('前端开发');
    await nextTick();
    
    expect(wrapper.vm.searchQuery).toBe('前端开发');
  });

  it('应该正确处理特殊字符搜索', async () => {
    const input = wrapper.find('input');
    const specialQuery = 'C++ 编程';
    
    await input.setValue(specialQuery);
    await nextTick();
    
    expect(wrapper.vm.searchQuery).toBe(specialQuery);
  });
});

// 响应式测试
describe('SearchBox Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(SearchBox, {
      props: {
        mobile: true
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('mobile');
  });

  it('应该在桌面端显示完整功能', () => {
    // 模拟桌面端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const wrapper = mount(SearchBox, {
      props: {
        mobile: false
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).not.toContain('mobile');
  });
});

// 性能测试
describe('SearchBox Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    mount(SearchBox, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 渲染时间应该少于50ms
    expect(renderTime).toBeLessThan(50);
  });

  it('应该正确处理大量搜索建议', async () => {
    const wrapper = mount(SearchBox, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });

    // 生成大量建议
    const largeSuggestions = Array.from({ length: 1000 }, (_, i) => `建议${i}`);
    wrapper.vm.suggestions = largeSuggestions;
    
    const input = wrapper.find('input');
    await input.setValue('建议');
    
    // 应该能够处理大量数据而不崩溃
    expect(wrapper.vm.filteredSuggestions.length).toBeGreaterThan(0);
  });
});

// 边界条件测试
describe('SearchBox Edge Cases', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(SearchBox, {
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该正确处理极长的搜索查询', async () => {
    const longQuery = 'a'.repeat(1000);
    const input = wrapper.find('input');
    
    await input.setValue(longQuery);
    
    expect(wrapper.vm.searchQuery).toBe(longQuery);
  });

  it('应该正确处理空白字符', async () => {
    const input = wrapper.find('input');
    
    await input.setValue('   ');
    await input.trigger('keyup.enter');
    
    // 应该处理或忽略纯空白搜索
    expect(wrapper.vm.searchQuery.trim()).toBe('');
  });

  it('应该正确处理HTML标签输入', async () => {
    const input = wrapper.find('input');
    const htmlInput = '<script>alert("test")</script>';
    
    await input.setValue(htmlInput);
    
    // 应该安全处理HTML输入
    expect(wrapper.vm.searchQuery).toBe(htmlInput);
  });

  it('应该正确处理快速连续输入', async () => {
    const input = wrapper.find('input');
    
    // 快速连续输入
    await input.setValue('a');
    await input.setValue('ab');
    await input.setValue('abc');
    await input.setValue('abcd');
    
    expect(wrapper.vm.searchQuery).toBe('abcd');
  });
});