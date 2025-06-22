// 标签组件单元测试
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TagList from '../../components/common/TagList.vue';
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

describe('TagList', () => {
  let wrapper;
  const defaultTags = [
    { id: 1, name: 'Vue.js', color: '#42b883', count: 15 },
    { id: 2, name: 'JavaScript', color: '#f7df1e', count: 25 },
    { id: 3, name: 'CSS', color: '#1572b6', count: 10 },
    { id: 4, name: 'HTML', color: '#e34f26', count: 8 }
  ];

  beforeEach(() => {
    wrapper = mount(TagList, {
      props: {
        tags: defaultTags
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该正确渲染标签列表', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.tag-list').exists()).toBe(true);
  });

  it('应该显示所有传入的标签', () => {
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements).toHaveLength(defaultTags.length);
  });

  it('应该正确显示标签名称', () => {
    const tagElements = wrapper.findAll('.tag-item');
    
    tagElements.forEach((tagElement, index) => {
      expect(tagElement.text()).toContain(defaultTags[index].name);
    });
  });

  it('应该正确显示标签计数', () => {
    const tagElements = wrapper.findAll('.tag-item');
    
    tagElements.forEach((tagElement, index) => {
      if (defaultTags[index].count) {
        expect(tagElement.text()).toContain(defaultTags[index].count.toString());
      }
    });
  });

  it('应该在点击标签时触发事件', async () => {
    const firstTag = wrapper.find('.tag-item');
    
    await firstTag.trigger('click');
    
    expect(wrapper.emitted('tag-click')).toBeTruthy();
    expect(wrapper.emitted('tag-click')[0][0]).toEqual(defaultTags[0]);
  });

  it('应该正确处理空标签列表', async () => {
    await wrapper.setProps({ tags: [] });
    
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements).toHaveLength(0);
  });

  it('应该正确处理没有计数的标签', async () => {
    const tagsWithoutCount = [
      { id: 1, name: 'Vue.js', color: '#42b883' },
      { id: 2, name: 'JavaScript', color: '#f7df1e' }
    ];
    
    await wrapper.setProps({ tags: tagsWithoutCount });
    
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements).toHaveLength(2);
  });

  it('应该正确应用标签颜色', () => {
    const tagElements = wrapper.findAll('.tag-item');
    
    tagElements.forEach((tagElement, index) => {
      if (defaultTags[index].color) {
        const style = tagElement.attributes('style');
        expect(style).toContain(defaultTags[index].color);
      }
    });
  });

  it('应该支持不同的显示模式', async () => {
    await wrapper.setProps({ mode: 'compact' });
    
    expect(wrapper.classes()).toContain('compact');
  });

  it('应该支持最大显示数量限制', async () => {
    const maxCount = 2;
    await wrapper.setProps({ maxCount });
    
    const visibleTags = wrapper.findAll('.tag-item:not(.hidden)');
    expect(visibleTags.length).toBeLessThanOrEqual(maxCount);
  });

  it('应该在超出最大数量时显示更多按钮', async () => {
    const maxCount = 2;
    await wrapper.setProps({ maxCount });
    
    if (defaultTags.length > maxCount) {
      expect(wrapper.find('.show-more').exists()).toBe(true);
    }
  });

  it('应该正确处理标签排序', async () => {
    await wrapper.setProps({ sortBy: 'count' });
    
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements).toHaveLength(defaultTags.length);
  });
});

// 标签交互测试
describe('TagList Interactions', () => {
  let wrapper;
  const interactiveTags = [
    { id: 1, name: 'Vue.js', color: '#42b883', count: 15, active: false },
    { id: 2, name: 'JavaScript', color: '#f7df1e', count: 25, active: true },
    { id: 3, name: 'CSS', color: '#1572b6', count: 10, active: false }
  ];

  beforeEach(() => {
    wrapper = mount(TagList, {
      props: {
        tags: interactiveTags,
        selectable: true
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该正确显示选中状态', () => {
    const activeTags = wrapper.findAll('.tag-item.active');
    const activeTagsFromProps = interactiveTags.filter(tag => tag.active);
    
    expect(activeTags).toHaveLength(activeTagsFromProps.length);
  });

  it('应该在点击时切换选中状态', async () => {
    const firstTag = wrapper.find('.tag-item');
    
    await firstTag.trigger('click');
    
    expect(wrapper.emitted('tag-select')).toBeTruthy();
  });

  it('应该支持多选模式', async () => {
    await wrapper.setProps({ multiple: true });
    
    const firstTag = wrapper.find('.tag-item');
    const secondTag = wrapper.findAll('.tag-item')[1];
    
    await firstTag.trigger('click');
    await secondTag.trigger('click');
    
    expect(wrapper.emitted('tag-select')).toHaveLength(2);
  });

  it('应该支持单选模式', async () => {
    await wrapper.setProps({ multiple: false });
    
    const firstTag = wrapper.find('.tag-item');
    const secondTag = wrapper.findAll('.tag-item')[1];
    
    await firstTag.trigger('click');
    await secondTag.trigger('click');
    
    // 在单选模式下，应该取消之前的选择
    expect(wrapper.emitted('tag-deselect')).toBeTruthy();
  });

  it('应该支持键盘导航', async () => {
    const tagList = wrapper.find('.tag-list');
    
    await tagList.trigger('keydown.right');
    
    expect(wrapper.vm.focusedIndex).toBeGreaterThanOrEqual(0);
  });

  it('应该在按下回车键时选择标签', async () => {
    const firstTag = wrapper.find('.tag-item');
    
    await firstTag.trigger('keydown.enter');
    
    expect(wrapper.emitted('tag-select')).toBeTruthy();
  });
});

// 标签过滤测试
describe('TagList Filtering', () => {
  let wrapper;
  const filterableTags = [
    { id: 1, name: 'Vue.js', category: 'framework', count: 15 },
    { id: 2, name: 'React', category: 'framework', count: 20 },
    { id: 3, name: 'JavaScript', category: 'language', count: 25 },
    { id: 4, name: 'TypeScript', category: 'language', count: 18 },
    { id: 5, name: 'CSS', category: 'style', count: 10 }
  ];

  beforeEach(() => {
    wrapper = mount(TagList, {
      props: {
        tags: filterableTags,
        filterable: true
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该支持按名称过滤', async () => {
    await wrapper.vm.filterTags('Vue');
    
    const visibleTags = wrapper.vm.filteredTags;
    expect(visibleTags.every(tag => tag.name.toLowerCase().includes('vue'))).toBe(true);
  });

  it('应该支持按分类过滤', async () => {
    await wrapper.vm.filterByCategory('framework');
    
    const visibleTags = wrapper.vm.filteredTags;
    expect(visibleTags.every(tag => tag.category === 'framework')).toBe(true);
  });

  it('应该正确处理空过滤结果', async () => {
    await wrapper.vm.filterTags('不存在的标签');
    
    const visibleTags = wrapper.vm.filteredTags;
    expect(visibleTags).toHaveLength(0);
  });

  it('应该支持清除过滤', async () => {
    await wrapper.vm.filterTags('Vue');
    await wrapper.vm.clearFilter();
    
    const visibleTags = wrapper.vm.filteredTags;
    expect(visibleTags).toHaveLength(filterableTags.length);
  });
});

// 响应式测试
describe('TagList Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(TagList, {
      props: {
        tags: [
          { id: 1, name: 'Vue.js', color: '#42b883' },
          { id: 2, name: 'JavaScript', color: '#f7df1e' }
        ],
        responsive: true
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

  it('应该在桌面端显示完整布局', () => {
    // 模拟桌面端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const wrapper = mount(TagList, {
      props: {
        tags: [
          { id: 1, name: 'Vue.js', color: '#42b883' },
          { id: 2, name: 'JavaScript', color: '#f7df1e' }
        ],
        responsive: true
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
describe('TagList Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    mount(TagList, {
      props: {
        tags: [
          { id: 1, name: 'Vue.js', color: '#42b883' },
          { id: 2, name: 'JavaScript', color: '#f7df1e' }
        ]
      },
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

  it('应该正确处理大量标签', () => {
    const largeTags = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `标签${i + 1}`,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      count: Math.floor(Math.random() * 100)
    }));

    expect(() => {
      mount(TagList, {
        props: {
          tags: largeTags
        },
        global: {
          plugins: [ElementPlus],
          mocks: {
            $router: mockRouter,
            $route: mockRoute
          }
        }
      });
    }).not.toThrow();
  });
});

// 边界条件测试
describe('TagList Edge Cases', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TagList, {
      props: {
        tags: []
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $router: mockRouter,
          $route: mockRoute
        }
      }
    });
  });

  it('应该正确处理无效的标签数据', async () => {
    const invalidTags = [
      null,
      undefined,
      { name: 'Valid Tag' },
      { id: 1 }, // 缺少name
      { id: 2, name: '' } // 空name
    ];
    
    await wrapper.setProps({ tags: invalidTags });
    
    // 应该过滤掉无效标签
    const validTags = wrapper.vm.validTags;
    expect(validTags.every(tag => tag && tag.name && tag.name.trim())).toBe(true);
  });

  it('应该正确处理极长的标签名称', async () => {
    const longNameTag = {
      id: 1,
      name: 'a'.repeat(1000),
      color: '#42b883'
    };
    
    await wrapper.setProps({ tags: [longNameTag] });
    
    expect(wrapper.find('.tag-item').exists()).toBe(true);
  });

  it('应该正确处理特殊字符标签', async () => {
    const specialTags = [
      { id: 1, name: 'C++', color: '#00599c' },
      { id: 2, name: 'C#', color: '#239120' },
      { id: 3, name: '.NET', color: '#512bd4' },
      { id: 4, name: 'Vue.js', color: '#42b883' }
    ];
    
    await wrapper.setProps({ tags: specialTags });
    
    const tagElements = wrapper.findAll('.tag-item');
    expect(tagElements).toHaveLength(specialTags.length);
  });

  it('应该正确处理重复的标签ID', async () => {
    const duplicateTags = [
      { id: 1, name: 'Vue.js', color: '#42b883' },
      { id: 1, name: 'React', color: '#61dafb' }, // 重复ID
      { id: 2, name: 'Angular', color: '#dd0031' }
    ];
    
    await wrapper.setProps({ tags: duplicateTags });
    
    // 应该处理重复ID的情况
    expect(wrapper.findAll('.tag-item').length).toBeGreaterThan(0);
  });
});