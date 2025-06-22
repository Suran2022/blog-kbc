# 博客前端测试文档

## 概述

本项目使用 Vitest 作为测试框架，Vue Test Utils 进行组件测试，提供全面的单元测试和集成测试覆盖。

## 测试结构

```
src/tests/
├── components/          # 组件测试
│   ├── ArticleCard.test.js
│   ├── Pagination.test.js
│   ├── SearchBox.test.js
│   ├── TagList.test.js
│   └── Loading.test.js
├── pages/              # 页面测试
│   ├── Home.test.js
│   └── ArticleDetail.test.js
├── utils/              # 工具函数测试
│   ├── api.test.js
│   ├── auth.test.js
│   ├── format.test.js
│   └── performance.test.js
├── setup.js            # 测试环境设置
└── README.md           # 测试文档
```

## 运行测试

### 基本命令

```bash
# 运行所有测试
npm run test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch

# 运行测试 UI 界面
npm run test:ui

# 运行测试（一次性）
npm run test:run
```

### 运行特定测试

```bash
# 运行特定文件的测试
npx vitest src/tests/components/ArticleCard.test.js

# 运行特定目录的测试
npx vitest src/tests/components/

# 运行匹配模式的测试
npx vitest --grep "ArticleCard"
```

## 测试覆盖范围

### 组件测试

#### ArticleCard 组件
- ✅ 基本渲染测试
- ✅ 数据绑定测试
- ✅ 事件处理测试
- ✅ 条件渲染测试
- ✅ 路由跳转测试
- ✅ 响应式设计测试
- ✅ 性能测试
- ✅ 边界条件测试

#### Pagination 组件
- ✅ 分页显示测试
- ✅ 页码变化测试
- ✅ 每页条数变化测试
- ✅ 事件触发测试
- ✅ 边界值处理测试
- ✅ 响应式布局测试

#### SearchBox 组件
- ✅ 搜索输入测试
- ✅ 搜索建议测试
- ✅ 键盘导航测试
- ✅ 搜索历史测试
- ✅ 事件处理测试
- ✅ 响应式设计测试

#### TagList 组件
- ✅ 标签显示测试
- ✅ 标签交互测试
- ✅ 标签筛选测试
- ✅ 多选/单选模式测试
- ✅ 键盘导航测试
- ✅ 响应式布局测试

#### Loading 组件
- ✅ 加载状态测试
- ✅ 加载动画测试
- ✅ 进度显示测试
- ✅ 延迟显示测试
- ✅ 自定义配置测试
- ✅ 性能测试

### 页面测试

#### Home 页面
- ✅ 页面渲染测试
- ✅ 数据加载测试
- ✅ 分页功能测试
- ✅ 搜索功能测试
- ✅ 筛选功能测试
- ✅ 交互测试
- ✅ 错误处理测试
- ✅ 响应式设计测试

#### ArticleDetail 页面
- ✅ 文章详情显示测试
- ✅ 评论功能测试
- ✅ 点赞收藏测试
- ✅ 相关文章测试
- ✅ 分享功能测试
- ✅ 数据加载测试
- ✅ 错误处理测试

### 工具函数测试

#### API 工具
- ✅ HTTP 请求测试
- ✅ 错误处理测试
- ✅ 拦截器测试
- ✅ 认证测试

#### 认证工具
- ✅ 登录/登出测试
- ✅ Token 管理测试
- ✅ 权限验证测试
- ✅ 会话管理测试

#### 格式化工具
- ✅ 日期格式化测试
- ✅ 数字格式化测试
- ✅ 文本处理测试
- ✅ URL 处理测试

#### 性能工具
- ✅ 防抖节流测试
- ✅ 缓存机制测试
- ✅ 性能监控测试
- ✅ 内存管理测试

## 测试配置

### Vitest 配置

测试配置位于 `vitest.config.js`：

```javascript
// 主要配置项
{
  environment: 'jsdom',        // 浏览器环境模拟
  globals: true,               // 全局测试 API
  setupFiles: ['./src/tests/setup.js'], // 设置文件
  coverage: {                  // 覆盖率配置
    provider: 'v8',
    reporter: ['text', 'json', 'html'],
    thresholds: {
      global: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80
      }
    }
  }
}
```

### 测试环境设置

`src/tests/setup.js` 包含：

- 全局模拟（localStorage, sessionStorage, fetch 等）
- Vue Test Utils 配置
- Element Plus 插件配置
- 浏览器 API 模拟
- 测试工具函数

## 编写测试

### 基本测试结构

```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import MyComponent from '../MyComponent.vue';

describe('MyComponent', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(MyComponent, {
      props: {
        // 组件属性
      },
      global: {
        plugins: [ElementPlus],
        mocks: {
          // 模拟对象
        }
      }
    });
  });

  it('应该正确渲染', () => {
    expect(wrapper.exists()).toBe(true);
  });
});
```

### 测试最佳实践

1. **测试命名**
   - 使用描述性的测试名称
   - 使用中文描述测试意图
   - 遵循 "应该..." 的格式

2. **测试组织**
   - 使用 `describe` 分组相关测试
   - 使用 `beforeEach` 设置通用状态
   - 使用 `afterEach` 清理测试环境

3. **模拟和存根**
   - 模拟外部依赖
   - 使用 `vi.fn()` 创建模拟函数
   - 验证函数调用和参数

4. **异步测试**
   - 使用 `async/await` 处理异步操作
   - 使用 `nextTick()` 等待 DOM 更新
   - 适当设置超时时间

5. **边界条件**
   - 测试空数据情况
   - 测试错误状态
   - 测试极值情况

## 覆盖率报告

运行 `npm run test:coverage` 后，覆盖率报告将生成在：

- `coverage/index.html` - HTML 格式报告
- `coverage/coverage-final.json` - JSON 格式数据
- 控制台输出 - 文本格式摘要

### 覆盖率目标

- **行覆盖率**: ≥ 80%
- **函数覆盖率**: ≥ 80%
- **分支覆盖率**: ≥ 80%
- **语句覆盖率**: ≥ 80%

## 持续集成

测试可以集成到 CI/CD 流程中：

```yaml
# GitHub Actions 示例
- name: Run Tests
  run: |
    npm install
    npm run test:coverage
    
- name: Upload Coverage
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/coverage-final.json
```

## 调试测试

### 使用测试 UI

```bash
npm run test:ui
```

访问 `http://localhost:51204/__vitest__/` 查看测试 UI。

### 调试单个测试

```javascript
// 使用 .only 运行单个测试
it.only('应该测试特定功能', () => {
  // 测试代码
});

// 使用 .skip 跳过测试
it.skip('暂时跳过的测试', () => {
  // 测试代码
});
```

### 查看测试输出

```javascript
// 在测试中添加调试信息
console.log('Debug info:', wrapper.html());
console.log('Component data:', wrapper.vm.$data);
```

## 常见问题

### 1. Element Plus 组件测试

```javascript
// 确保在全局配置中包含 Element Plus
config.global.plugins = [ElementPlus];
```

### 2. 路由测试

```javascript
// 模拟路由对象
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn()
};

const mockRoute = {
  params: { id: '1' },
  query: {},
  path: '/'
};
```

### 3. API 测试

```javascript
// 模拟 API 调用
const mockApi = {
  getData: vi.fn().mockResolvedValue({ data: [] })
};
```

### 4. 异步组件测试

```javascript
// 等待异步操作完成
await nextTick();
await wrapper.vm.$nextTick();
```

## 贡献指南

1. 为新功能编写测试
2. 确保测试覆盖率达标
3. 遵循测试命名规范
4. 添加必要的测试文档
5. 运行完整测试套件确保无回归

## 相关资源

- [Vitest 官方文档](https://vitest.dev/)
- [Vue Test Utils 文档](https://test-utils.vuejs.org/)
- [Element Plus 测试指南](https://element-plus.org/zh-CN/guide/dev.html#testing)
- [Vue 3 测试指南](https://vuejs.org/guide/scaling-up/testing.html)