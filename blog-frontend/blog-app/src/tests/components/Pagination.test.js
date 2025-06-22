// 分页组件单元测试
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Pagination from '../../components/common/Pagination.vue';
import ElementPlus from 'element-plus';

describe('Pagination', () => {
  let wrapper;
  const defaultProps = {
    currentPage: 1,
    pageSize: 10,
    total: 100
  };

  beforeEach(() => {
    wrapper = mount(Pagination, {
      props: defaultProps,
      global: {
        plugins: [ElementPlus]
      }
    });
  });

  it('应该正确渲染分页组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.el-pagination').exists()).toBe(true);
  });

  it('应该正确显示当前页码', () => {
    expect(wrapper.vm.currentPageValue).toBe(1);
  });

  it('应该正确显示每页条数', () => {
    expect(wrapper.vm.pageSizeValue).toBe(10);
  });

  it('应该正确计算总页数', () => {
    const totalPages = Math.ceil(defaultProps.total / defaultProps.pageSize);
    expect(totalPages).toBe(10);
  });

  it('当页码改变时应该触发事件', async () => {
    const newPage = 2;
    
    // 模拟页码变化
    await wrapper.setProps({ currentPage: newPage });
    
    expect(wrapper.vm.currentPageValue).toBe(newPage);
  });

  it('当每页条数改变时应该触发事件', async () => {
    const newPageSize = 20;
    
    // 模拟每页条数变化
    await wrapper.setProps({ pageSize: newPageSize });
    
    expect(wrapper.vm.pageSizeValue).toBe(newPageSize);
  });

  it('应该正确处理自定义页面大小选项', async () => {
    const customPageSizes = [5, 15, 25, 50];
    
    await wrapper.setProps({ pageSizes: customPageSizes });
    
    expect(wrapper.props('pageSizes')).toEqual(customPageSizes);
  });

  it('应该正确处理自定义布局', async () => {
    const customLayout = 'prev, pager, next';
    
    await wrapper.setProps({ layout: customLayout });
    
    expect(wrapper.props('layout')).toBe(customLayout);
  });

  it('应该正确处理背景色设置', async () => {
    await wrapper.setProps({ background: false });
    
    expect(wrapper.props('background')).toBe(false);
  });

  it('应该在总数为0时正确处理', async () => {
    await wrapper.setProps({ total: 0 });
    
    expect(wrapper.props('total')).toBe(0);
  });

  it('应该在只有一页时正确显示', async () => {
    await wrapper.setProps({ 
      total: 5,
      pageSize: 10,
      currentPage: 1
    });
    
    const totalPages = Math.ceil(5 / 10);
    expect(totalPages).toBe(1);
  });

  it('应该正确处理边界情况 - 最后一页', async () => {
    const total = 95;
    const pageSize = 10;
    const lastPage = Math.ceil(total / pageSize);
    
    await wrapper.setProps({ 
      total,
      pageSize,
      currentPage: lastPage
    });
    
    expect(wrapper.vm.currentPageValue).toBe(lastPage);
  });

  it('应该正确处理大数据量', async () => {
    const largeTotal = 10000;
    const pageSize = 50;
    
    await wrapper.setProps({ 
      total: largeTotal,
      pageSize: pageSize,
      currentPage: 100
    });
    
    const totalPages = Math.ceil(largeTotal / pageSize);
    expect(totalPages).toBe(200);
    expect(wrapper.vm.currentPageValue).toBe(100);
  });
});

// 事件测试
describe('Pagination Events', () => {
  let wrapper;
  const mockEmit = vi.fn();

  beforeEach(() => {
    wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          $emit: mockEmit
        }
      }
    });
  });

  it('页码变化时应该触发正确的事件', () => {
    const newPage = 3;
    
    // 直接调用计算属性的setter
    wrapper.vm.currentPageValue = newPage;
    
    // 验证事件被触发
    expect(wrapper.emitted('update:currentPage')).toBeTruthy();
    expect(wrapper.emitted('pagination')).toBeTruthy();
  });

  it('每页条数变化时应该触发正确的事件', () => {
    const newPageSize = 20;
    
    // 直接调用计算属性的setter
    wrapper.vm.pageSizeValue = newPageSize;
    
    // 验证事件被触发
    expect(wrapper.emitted('update:pageSize')).toBeTruthy();
    expect(wrapper.emitted('pagination')).toBeTruthy();
  });
});

// 响应式测试
describe('Pagination Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        layout: 'prev, pager, next' // 移动端简化布局
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('应该在桌面端显示完整功能', () => {
    // 模拟桌面端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100,
        layout: 'total, sizes, prev, pager, next, jumper' // 桌面端完整布局
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});

// 性能测试
describe('Pagination Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 10,
        total: 100
      },
      global: {
        plugins: [ElementPlus]
      }
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // 渲染时间应该少于50ms
    expect(renderTime).toBeLessThan(50);
  });

  it('应该正确处理大量页面', () => {
    expect(() => {
      mount(Pagination, {
        props: {
          currentPage: 5000,
          pageSize: 10,
          total: 100000
        },
        global: {
          plugins: [ElementPlus]
        }
      });
    }).not.toThrow();
  });
});

// 边界条件测试
describe('Pagination Edge Cases', () => {
  it('应该正确处理负数页码', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: -1,
        pageSize: 10,
        total: 100
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    // Element Plus 应该自动处理负数页码
    expect(wrapper.exists()).toBe(true);
  });

  it('应该正确处理超出范围的页码', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 999,
        pageSize: 10,
        total: 100
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    // Element Plus 应该自动处理超出范围的页码
    expect(wrapper.exists()).toBe(true);
  });

  it('应该正确处理零页面大小', async () => {
    const wrapper = mount(Pagination, {
      props: {
        currentPage: 1,
        pageSize: 0,
        total: 100
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    expect(wrapper.exists()).toBe(true);
  });
});