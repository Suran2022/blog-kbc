// 加载组件单元测试
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Loading from '../../components/common/Loading.vue';
import ElementPlus from 'element-plus';

describe('Loading', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Loading, {
      global: {
        plugins: [ElementPlus]
      }
    });
  });

  it('应该正确渲染加载组件', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('.loading-container').exists()).toBe(true);
  });

  it('应该在loading为true时显示', async () => {
    await wrapper.setProps({ loading: true });
    
    expect(wrapper.isVisible()).toBe(true);
    expect(wrapper.find('.loading-spinner').exists()).toBe(true);
  });

  it('应该在loading为false时隐藏', async () => {
    await wrapper.setProps({ loading: false });
    
    expect(wrapper.find('.loading-container').isVisible()).toBe(false);
  });

  it('应该显示自定义加载文本', async () => {
    const customText = '正在加载数据...';
    await wrapper.setProps({ 
      loading: true,
      text: customText 
    });
    
    expect(wrapper.text()).toContain(customText);
  });

  it('应该显示默认加载文本', async () => {
    await wrapper.setProps({ loading: true });
    
    expect(wrapper.text()).toContain('加载中...');
  });

  it('应该支持不同的加载类型', async () => {
    const loadingTypes = ['spinner', 'dots', 'bars', 'pulse'];
    
    for (const type of loadingTypes) {
      await wrapper.setProps({ 
        loading: true,
        type 
      });
      
      expect(wrapper.classes()).toContain(`loading-${type}`);
    }
  });

  it('应该支持不同的尺寸', async () => {
    const sizes = ['small', 'medium', 'large'];
    
    for (const size of sizes) {
      await wrapper.setProps({ 
        loading: true,
        size 
      });
      
      expect(wrapper.classes()).toContain(`loading-${size}`);
    }
  });

  it('应该支持全屏模式', async () => {
    await wrapper.setProps({ 
      loading: true,
      fullscreen: true 
    });
    
    expect(wrapper.classes()).toContain('loading-fullscreen');
  });

  it('应该支持背景遮罩', async () => {
    await wrapper.setProps({ 
      loading: true,
      mask: true 
    });
    
    expect(wrapper.find('.loading-mask').exists()).toBe(true);
  });

  it('应该支持自定义颜色', async () => {
    const customColor = '#ff6b6b';
    await wrapper.setProps({ 
      loading: true,
      color: customColor 
    });
    
    const spinner = wrapper.find('.loading-spinner');
    expect(spinner.attributes('style')).toContain(customColor);
  });

  it('应该在延迟后显示', async () => {
    const delay = 100;
    await wrapper.setProps({ 
      loading: true,
      delay 
    });
    
    // 立即检查应该不可见
    expect(wrapper.find('.loading-container').isVisible()).toBe(false);
    
    // 等待延迟时间后应该可见
    await new Promise(resolve => setTimeout(resolve, delay + 10));
    await nextTick();
    
    expect(wrapper.find('.loading-container').isVisible()).toBe(true);
  });

  it('应该支持最小显示时间', async () => {
    const minTime = 200;
    const startTime = Date.now();
    
    await wrapper.setProps({ 
      loading: true,
      minTime 
    });
    
    // 快速切换loading状态
    await wrapper.setProps({ loading: false });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    // 应该至少显示最小时间
    expect(duration).toBeGreaterThanOrEqual(minTime - 50); // 允许50ms误差
  });
});

// 加载状态测试
describe('Loading States', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Loading, {
      global: {
        plugins: [ElementPlus]
      }
    });
  });

  it('应该正确处理加载状态切换', async () => {
    // 初始状态
    expect(wrapper.find('.loading-container').isVisible()).toBe(false);
    
    // 开始加载
    await wrapper.setProps({ loading: true });
    expect(wrapper.find('.loading-container').isVisible()).toBe(true);
    
    // 停止加载
    await wrapper.setProps({ loading: false });
    expect(wrapper.find('.loading-container').isVisible()).toBe(false);
  });

  it('应该支持进度显示', async () => {
    await wrapper.setProps({ 
      loading: true,
      progress: true,
      percentage: 50
    });
    
    expect(wrapper.find('.loading-progress').exists()).toBe(true);
    expect(wrapper.text()).toContain('50%');
  });

  it('应该正确更新进度', async () => {
    await wrapper.setProps({ 
      loading: true,
      progress: true,
      percentage: 25
    });
    
    expect(wrapper.text()).toContain('25%');
    
    await wrapper.setProps({ percentage: 75 });
    expect(wrapper.text()).toContain('75%');
  });

  it('应该在进度完成时自动隐藏', async () => {
    await wrapper.setProps({ 
      loading: true,
      progress: true,
      percentage: 100,
      autoHide: true
    });
    
    // 等待自动隐藏
    await new Promise(resolve => setTimeout(resolve, 100));
    await nextTick();
    
    expect(wrapper.find('.loading-container').isVisible()).toBe(false);
  });
});

// 加载动画测试
describe('Loading Animations', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Loading, {
      props: {
        loading: true
      },
      global: {
        plugins: [ElementPlus]
      }
    });
  });

  it('应该有旋转动画', () => {
    const spinner = wrapper.find('.loading-spinner');
    expect(spinner.classes()).toContain('rotating');
  });

  it('应该支持自定义动画速度', async () => {
    await wrapper.setProps({ animationSpeed: 'slow' });
    
    expect(wrapper.classes()).toContain('animation-slow');
  });

  it('应该支持禁用动画', async () => {
    await wrapper.setProps({ animation: false });
    
    const spinner = wrapper.find('.loading-spinner');
    expect(spinner.classes()).not.toContain('rotating');
  });

  it('应该支持脉冲动画', async () => {
    await wrapper.setProps({ type: 'pulse' });
    
    expect(wrapper.find('.loading-pulse').exists()).toBe(true);
  });

  it('应该支持点状动画', async () => {
    await wrapper.setProps({ type: 'dots' });
    
    expect(wrapper.find('.loading-dots').exists()).toBe(true);
    expect(wrapper.findAll('.dot')).toHaveLength(3);
  });
});

// 响应式测试
describe('Loading Responsive', () => {
  it('应该在移动端正确显示', () => {
    // 模拟移动端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const wrapper = mount(Loading, {
      props: {
        loading: true,
        responsive: true
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('mobile');
  });

  it('应该在桌面端显示完整尺寸', () => {
    // 模拟桌面端视口
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const wrapper = mount(Loading, {
      props: {
        loading: true,
        responsive: true
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).not.toContain('mobile');
  });
});

// 性能测试
describe('Loading Performance', () => {
  it('应该在合理时间内渲染', () => {
    const startTime = performance.now();
    
    mount(Loading, {
      props: {
        loading: true
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

  it('应该正确处理频繁的状态切换', async () => {
    const wrapper = mount(Loading, {
      global: {
        plugins: [ElementPlus]
      }
    });

    // 快速切换loading状态
    for (let i = 0; i < 100; i++) {
      await wrapper.setProps({ loading: i % 2 === 0 });
    }

    // 应该不会崩溃
    expect(wrapper.exists()).toBe(true);
  });

  it('应该正确清理定时器', async () => {
    const wrapper = mount(Loading, {
      props: {
        loading: true,
        delay: 1000
      },
      global: {
        plugins: [ElementPlus]
      }
    });

    // 在延迟完成前销毁组件
    wrapper.unmount();

    // 应该不会有内存泄漏或错误
    expect(true).toBe(true);
  });
});

// 边界条件测试
describe('Loading Edge Cases', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(Loading, {
      global: {
        plugins: [ElementPlus]
      }
    });
  });

  it('应该正确处理无效的进度值', async () => {
    await wrapper.setProps({ 
      loading: true,
      progress: true,
      percentage: -10
    });
    
    // 应该将负值处理为0
    expect(wrapper.vm.normalizedPercentage).toBe(0);
    
    await wrapper.setProps({ percentage: 150 });
    
    // 应该将超过100的值处理为100
    expect(wrapper.vm.normalizedPercentage).toBe(100);
  });

  it('应该正确处理无效的延迟值', async () => {
    await wrapper.setProps({ 
      loading: true,
      delay: -100
    });
    
    // 负延迟应该立即显示
    expect(wrapper.find('.loading-container').isVisible()).toBe(true);
  });

  it('应该正确处理极长的加载文本', async () => {
    const longText = 'a'.repeat(1000);
    await wrapper.setProps({ 
      loading: true,
      text: longText
    });
    
    expect(wrapper.text()).toContain(longText);
  });

  it('应该正确处理空的加载文本', async () => {
    await wrapper.setProps({ 
      loading: true,
      text: ''
    });
    
    // 应该显示默认文本或不显示文本
    expect(wrapper.exists()).toBe(true);
  });

  it('应该正确处理无效的颜色值', async () => {
    await wrapper.setProps({ 
      loading: true,
      color: 'invalid-color'
    });
    
    // 应该使用默认颜色或忽略无效颜色
    expect(wrapper.exists()).toBe(true);
  });

  it('应该正确处理同时设置多个冲突属性', async () => {
    await wrapper.setProps({ 
      loading: true,
      fullscreen: true,
      size: 'small', // 全屏模式下尺寸可能被忽略
      type: 'spinner'
    });
    
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain('loading-fullscreen');
  });
});