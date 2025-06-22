# 博客项目UI设计稿

## 一、设计概述

本博客项目UI设计遵循现代、简洁、内容优先的设计理念，采用响应式设计，确保在不同设备上都能提供良好的用户体验。设计风格偏向于极简主义，以提升内容的可读性和用户的浏览体验。

## 二、配色方案

### 2.1 主色调

- **主色**：#409EFF（蓝色）
  - 用于主要按钮、链接和重点强调元素
  - 色值：RGB(64, 158, 255)

- **辅助色**：
  - 成功色：#67C23A（绿色）- RGB(103, 194, 58)
  - 警告色：#E6A23C（黄色）- RGB(230, 162, 60)
  - 危险色：#F56C6C（红色）- RGB(245, 108, 108)
  - 信息色：#909399（灰色）- RGB(144, 147, 153)

### 2.2 中性色

- **文字颜色**：
  - 主要文字：#303133 - RGB(48, 49, 51)
  - 常规文字：#606266 - RGB(96, 98, 102)
  - 次要文字：#909399 - RGB(144, 147, 153)
  - 占位文字：#C0C4CC - RGB(192, 196, 204)

- **边框颜色**：
  - 一级边框：#DCDFE6 - RGB(220, 223, 230)
  - 二级边框：#E4E7ED - RGB(228, 231, 237)
  - 三级边框：#EBEEF5 - RGB(235, 238, 245)
  - 四级边框：#F2F6FC - RGB(242, 246, 252)

- **背景颜色**：
  - 页面背景：#F5F7FA - RGB(245, 247, 250)
  - 基础白色：#FFFFFF - RGB(255, 255, 255)

## 三、字体设计

### 3.1 字体族

```css
font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", Arial, sans-serif;
```

代码字体：

```css
font-family: Consolas, Monaco, monospace;
```

### 3.2 字体大小

- 主标题：24px
- 次级标题：20px
- 小标题：18px
- 正文：16px
- 辅助文字：14px
- 小字文本：13px

### 3.3 字重

- 粗体（标题）：600
- 正常（正文）：400
- 轻量（辅助文字）：300

### 3.4 行高

- 标题：1.4
- 正文：1.6
- 紧凑文本：1.2

## 四、组件设计

### 4.1 按钮

#### 4.1.1 主要按钮

![主要按钮](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E4%B8%BB%E8%A6%81%E6%8C%89%E9%92%AE%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#409EFF
- 文字颜色：#FFFFFF
- 边框：无
- 圆角：4px
- 悬停状态：背景色变暗10%
- 点击状态：背景色变暗20%

#### 4.1.2 次要按钮

![次要按钮](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%2260%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%AC%A1%E8%A6%81%E6%8C%89%E9%92%AE%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#FFFFFF
- 文字颜色：#606266
- 边框：1px solid #DCDFE6
- 圆角：4px
- 悬停状态：边框颜色变为主色
- 点击状态：背景色变为浅色主色

#### 4.1.3 文本按钮

![文本按钮](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%3E%3Ctext%20x%3D%2260%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%20text-anchor%3D%22middle%22%3E%E6%96%87%E6%9C%AC%E6%8C%89%E9%92%AE%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：透明
- 文字颜色：#409EFF
- 边框：无
- 悬停状态：文字颜色变暗

### 4.2 输入框

![输入框](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22240%22%20height%3D%2240%22%3E%3Crect%20width%3D%22240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23C0C4CC%22%3E%E8%AF%B7%E8%BE%93%E5%85%A5%E5%86%85%E5%AE%B9%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#FFFFFF
- 文字颜色：#606266
- 边框：1px solid #DCDFE6
- 圆角：4px
- 内边距：0 15px
- 高度：40px
- 悬停状态：边框颜色变为#C0C4CC
- 聚焦状态：边框颜色变为主色

### 4.3 卡片

![卡片](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%22200%22%3E%3Crect%20width%3D%22300%22%20height%3D%22200%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20width%3D%22300%22%20height%3D%2250%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E5%8D%A1%E7%89%87%E6%A0%87%E9%A2%98%3C%2Ftext%3E%3Ctext%20x%3D%2220%22%20y%3D%2280%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%8D%A1%E7%89%87%E5%86%85%E5%AE%B9%E5%8C%BA%E5%9F%9F%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#FFFFFF
- 边框：1px solid #EBEEF5
- 圆角：4px
- 阴影：0 2px 12px 0 rgba(0, 0, 0, 0.1)
- 标题区域：
  - 背景色：#F5F7FA
  - 文字颜色：#303133
  - 字体大小：16px
  - 字重：600
  - 内边距：15px 20px
- 内容区域：
  - 内边距：20px

### 4.4 表格

![表格](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22150%22%3E%3Crect%20width%3D%22400%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Cline%20x1%3D%22133%22%20y1%3D%220%22%20x2%3D%22133%22%20y2%3D%22150%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Cline%20x1%3D%22266%22%20y1%3D%220%22%20x2%3D%22266%22%20y2%3D%22150%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2240%22%20x2%3D%22400%22%20y2%3D%2240%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%2280%22%20x2%3D%22400%22%20y2%3D%2280%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Cline%20x1%3D%220%22%20y1%3D%22120%22%20x2%3D%22400%22%20y2%3D%22120%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2266%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%20text-anchor%3D%22middle%22%3E%E5%88%97%E4%B8%80%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%20text-anchor%3D%22middle%22%3E%E5%88%97%E4%BA%8C%3C%2Ftext%3E%3Ctext%20x%3D%22333%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%20text-anchor%3D%22middle%22%3E%E5%88%97%E4%B8%89%3C%2Ftext%3E%3Ctext%20x%3D%2266%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE1%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE2%3C%2Ftext%3E%3Ctext%20x%3D%22333%22%20y%3D%2260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE3%3C%2Ftext%3E%3Ctext%20x%3D%2266%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE4%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE5%3C%2Ftext%3E%3Ctext%20x%3D%22333%22%20y%3D%22100%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE6%3C%2Ftext%3E%3Ctext%20x%3D%2266%22%20y%3D%22140%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE7%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%22140%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE8%3C%2Ftext%3E%3Ctext%20x%3D%22333%22%20y%3D%22140%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E6%95%B0%E6%8D%AE9%3C%2Ftext%3E%3C%2Fsvg%3E)

- 表头：
  - 背景色：#F5F7FA
  - 文字颜色：#303133
  - 字体大小：14px
  - 字重：600
  - 内边距：12px 0
- 表格内容：
  - 背景色：#FFFFFF
  - 文字颜色：#606266
  - 字体大小：14px
  - 内边距：12px 0
- 表格边框：1px solid #EBEEF5
- 斑马纹（可选）：
  - 奇数行背景色：#FFFFFF
  - 偶数行背景色：#FAFAFA
- 悬停状态：背景色变为#F5F7FA

### 4.5 分页

![分页](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22300%22%20height%3D%2240%22%3E%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%2220%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%26lt%3B%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%2270%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E1%3C%2Ftext%3E%3Crect%20x%3D%22100%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%22120%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E2%3C%2Ftext%3E%3Crect%20x%3D%22150%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22170%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E3%3C%2Ftext%3E%3Crect%20x%3D%22200%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E4%3C%2Ftext%3E%3Crect%20x%3D%22250%22%20y%3D%220%22%20width%3D%2240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22270%22%20y%3D%2225%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%26gt%3B%3C%2Ftext%3E%3C%2Fsvg%3E)

- 普通页码：
  - 背景色：#FFFFFF
  - 文字颜色：#606266
  - 边框：1px solid #DCDFE6
  - 圆角：4px
  - 尺寸：40px x 40px
- 当前页码：
  - 背景色：#409EFF
  - 文字颜色：#FFFFFF
  - 边框：无
- 悬停状态：
  - 背景色：#F4F4F5
  - 文字颜色：#409EFF

### 4.6 标签

![标签](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2280%22%20height%3D%2230%22%3E%3Crect%20width%3D%2280%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22%23ECF5FF%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2220%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23409EFF%22%20text-anchor%3D%22middle%22%3E%E6%A0%87%E7%AD%BE%E6%96%87%E6%9C%AC%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#ECF5FF（浅蓝）
- 文字颜色：#409EFF（蓝色）
- 边框：无
- 圆角：4px
- 内边距：0 10px
- 高度：30px
- 字体大小：12px

### 4.7 导航菜单

![导航菜单](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%2250%22%3E%3Crect%20width%3D%22400%22%20height%3D%2250%22%20fill%3D%22%23FFFFFF%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E9%A6%96%E9%A1%B5%3C%2Ftext%3E%3Ctext%20x%3D%22150%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E6%96%87%E7%AB%A0%3C%2Ftext%3E%3Crect%20x%3D%22150%22%20y%3D%2247%22%20width%3D%2240%22%20height%3D%223%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%22250%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Ctext%20x%3D%22350%22%20y%3D%2230%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%85%B3%E4%BA%8E%3C%2Ftext%3E%3C%2Fsvg%3E)

- 背景色：#FFFFFF
- 边框底：1px solid #EBEEF5
- 菜单项：
  - 文字颜色：#606266
  - 字体大小：14px
  - 内边距：0 20px
  - 高度：50px
  - 行高：50px
- 当前菜单项：
  - 文字颜色：#409EFF
  - 底部边框：3px solid #409EFF
- 悬停状态：
  - 文字颜色：#409EFF

## 五、页面设计

### 5.1 前台页面

#### 5.1.1 首页

![首页设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%2260%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2238%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20fill%3D%22%23409EFF%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%3C%2Ftext%3E%3Crect%20x%3D%22500%22%20y%3D%2215%22%20width%3D%22250%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22520%22%20y%3D%2235%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23C0C4CC%22%3E%E6%90%9C%E7%B4%A2%E6%96%87%E7%AB%A0...%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%2280%22%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%20stroke-width%3D%220%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%2280%22%20width%3D%22500%22%20height%3D%22150%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%2280%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%981%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22140%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%3E2023-01-01%20%7C%20%E5%88%86%E7%B1%BB%EF%BC%9A%E6%8A%80%E6%9C%AF%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22170%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%91%98%E8%A6%81%EF%BC%8C%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E7%9A%84%E7%AE%80%E8%A6%81%E5%86%85%E5%AE%B9%E6%8F%8F%E8%BF%B0...%3C%2Ftext%3E%3Ctext%20x%3D%22480%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23909399%22%3E%E9%98%85%E8%AF%BB%EF%BC%9A100%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%22250%22%20width%3D%22500%22%20height%3D%22150%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%22250%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22280%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%982%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22310%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%3E2023-01-02%20%7C%20%E5%88%86%E7%B1%BB%EF%BC%9A%E7%94%9F%E6%B4%BB%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22340%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%91%98%E8%A6%81%EF%BC%8C%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E7%9A%84%E7%AE%80%E8%A6%81%E5%86%85%E5%AE%B9%E6%8F%8F%E8%BF%B0...%3C%2Ftext%3E%3Ctext%20x%3D%22480%22%20y%3D%22380%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23909399%22%3E%E9%98%85%E8%AF%BB%EF%BC%9A85%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%22420%22%20width%3D%22500%22%20height%3D%22150%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%2250%22%20y%3D%22420%22%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22220%22%20y%3D%22450%22%20font-family%3D%22Arial%22%20font-size%3D%2218%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%983%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22480%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%3E2023-01-03%20%7C%20%E5%88%86%E7%B1%BB%EF%BC%9A%E8%B5%84%E8%AE%AF%3C%2Ftext%3E%3Ctext%20x%3D%22220%22%20y%3D%22510%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%91%98%E8%A6%81%EF%BC%8C%E6%98%BE%E7%A4%BA%E6%96%87%E7%AB%A0%E7%9A%84%E7%AE%80%E8%A6%81%E5%86%85%E5%AE%B9%E6%8F%8F%E8%BF%B0...%3C%2Ftext%3E%3Ctext%20x%3D%22480%22%20y%3D%22550%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23909399%22%3E%E9%98%85%E8%AF%BB%EF%BC%9A120%3C%2Ftext%3E%3Crect%20x%3D%22570%22%20y%3D%2280%22%20width%3D%22200%22%20height%3D%22150%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22570%22%20y%3D%2280%22%20width%3D%22200%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22590%22%20y%3D%22105%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22145%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E6%8A%80%E6%9C%AF%20(10)%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E7%94%9F%E6%B4%BB%20(5)%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22205%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B5%84%E8%AE%AF%20(8)%3C%2Ftext%3E%3Crect%20x%3D%22570%22%20y%3D%22250%22%20width%3D%22200%22%20height%3D%22180%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22570%22%20y%3D%22250%22%20width%3D%22200%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22590%22%20y%3D%22275%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22315%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%983%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22345%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%982%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22375%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%981%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22405%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%984%3C%2Ftext%3E%3Crect%20x%3D%22570%22%20y%3D%22450%22%20width%3D%22200%22%20height%3D%22120%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22570%22%20y%3D%22450%22%20width%3D%22200%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22590%22%20y%3D%22475%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E8%B4%A1%E7%8C%AE%E8%80%85%3C%2Ftext%3E%3Ccircle%20cx%3D%22600%22%20cy%3D%22515%22%20r%3D%2220%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22630%22%20y%3D%22520%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B4%A1%E7%8C%AE%E8%80%851%3C%2Ftext%3E%3Ccircle%20cx%3D%22600%22%20cy%3D%22555%22%20r%3D%2220%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22630%22%20y%3D%22560%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B4%A1%E7%8C%AE%E8%80%852%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%22580%22%20width%3D%22720%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22605%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23909399%22%20text-anchor%3D%22middle%22%3E%C2%A9%202023%20%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%20All%20Rights%20Reserved.%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 顶部导航栏：简洁明了，左侧显示Logo，右侧为搜索框
- 两栏布局：左侧为文章列表区，右侧为侧边栏
- 文章卡片：包含标题、摘要、封面图、分类标签、发布时间和阅读量
- 侧边栏：分为三个功能区（分类、最新、贡献），使用卡片式设计，清晰分隔
- 页脚：简洁的版权信息

#### 5.1.2 文章详情页

![文章详情页设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%2260%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%2238%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20fill%3D%22%23409EFF%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%3C%2Ftext%3E%3Crect%20x%3D%22500%22%20y%3D%2215%22%20width%3D%22250%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22520%22%20y%3D%2235%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23C0C4CC%22%3E%E6%90%9C%E7%B4%A2%E6%96%87%E7%AB%A0...%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%2280%22%20width%3D%22500%22%20height%3D%22500%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%98%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22140%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%3E2023-01-01%20%7C%20%E5%88%86%E7%B1%BB%EF%BC%9A%E6%8A%80%E6%9C%AF%20%7C%20%E9%98%85%E8%AF%BB%EF%BC%9A100%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%22160%22%20width%3D%22500%22%20height%3D%22200%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%22380%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%AD%A3%E6%96%87%E5%86%85%E5%AE%B9%EF%BC%8C%E8%BF%99%E9%87%8C%E6%98%AF%E6%96%87%E7%AB%A0%E7%9A%84%E8%AF%A6%E7%BB%86%E5%86%85%E5%AE%B9%E6%8F%8F%E8%BF%B0%E3%80%82%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22410%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E5%8F%AF%E4%BB%A5%E5%8C%85%E5%90%AB%E5%A4%9A%E4%B8%AA%E6%AE%B5%E8%90%BD%EF%BC%8C%E5%9B%BE%E7%89%87%EF%BC%8C%E4%BB%A3%E7%A0%81%E5%9D%97%E7%AD%89%E5%86%85%E5%AE%B9%E3%80%82%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22440%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%8E%92%E7%89%88%E6%B8%85%E6%99%B0%EF%BC%8C%E6%98%93%E4%BA%8E%E9%98%85%E8%AF%BB%E3%80%82%3C%2Ftext%3E%3Crect%20x%3D%2250%22%20y%3D%22480%22%20width%3D%22500%22%20height%3D%2280%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%2250%22%20y%3D%22510%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E7%9B%B8%E5%85%B3%E6%8E%A8%E8%8D%90%3C%2Ftext%3E%3Ctext%20x%3D%2250%22%20y%3D%22540%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E7%9B%B8%E5%85%B3%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%981%3C%2Ftext%3E%3Ctext%20x%3D%22250%22%20y%3D%22540%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E7%9B%B8%E5%85%B3%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%982%3C%2Ftext%3E%3Crect%20x%3D%22570%22%20y%3D%2280%22%20width%3D%22200%22%20height%3D%22150%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22570%22%20y%3D%2280%22%20width%3D%22200%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22590%22%20y%3D%22105%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22145%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E6%8A%80%E6%9C%AF%20(10)%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E7%94%9F%E6%B4%BB%20(5)%3C%2Ftext%3E%3Ctext%20x%3D%22590%22%20y%3D%22205%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B5%84%E8%AE%AF%20(8)%3C%2Ftext%3E%3Crect%20x%3D%22570%22%20y%3D%22250%22%20width%3D%22200%22%20height%3D%22180%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22570%22%20y%3D%22250%22%20width%3D%22200%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22590%22%20y%3D%22275%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%9C%80%E6%96%B0%E6%96%87%E7%AB%A0%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 顶部导航栏：与首页保持一致，确保整体风格统一
- 文章标题：突出显示，使用较大字号和粗体
- 文章元信息：包含发布时间、分类和阅读量
- 文章内容：清晰的排版，适当的行高和段落间距，提高可读性
- 相关推荐：文章底部显示相关文章，增加用户浏览量
- 侧边栏：与首页保持一致，提供分类、最新文章等功能

#### 5.1.3 分类页面

**设计要点：**

- 顶部导航栏：与其他页面保持一致
- 分类标题：显示当前分类名称和文章数量
- 文章列表：与首页类似的文章卡片设计，但只显示当前分类的文章
- 分页控件：底部添加分页功能，便于浏览更多文章
- 侧边栏：与其他页面保持一致

#### 5.1.4 搜索结果页

**设计要点：**

- 搜索关键词提示：显示用户搜索的关键词和结果数量
- 搜索结果列表：与文章列表类似的设计，但突出显示匹配的关键词
- 无结果提示：当没有搜索结果时，提供友好的提示和建议
- 分页控件：底部添加分页功能
- 侧边栏：与其他页面保持一致

### 5.2 后台管理页面

#### 5.2.1 登录页面

![登录页面设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22500%22%3E%3Crect%20width%3D%22800%22%20height%3D%22500%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Crect%20x%3D%22250%22%20y%3D%22100%22%20width%3D%22300%22%20height%3D%22300%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2220%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%20text-anchor%3D%22middle%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0%E7%99%BB%E5%BD%95%3C%2Ftext%3E%3Crect%20x%3D%22280%22%20y%3D%22180%22%20width%3D%22240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22205%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23C0C4CC%22%3E%E7%94%A8%E6%88%B7%E5%90%8D%3C%2Ftext%3E%3Crect%20x%3D%22280%22%20y%3D%22240%22%20width%3D%22240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22300%22%20y%3D%22265%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23C0C4CC%22%3E%E5%AF%86%E7%A0%81%3C%2Ftext%3E%3Crect%20x%3D%22280%22%20y%3D%22300%22%20width%3D%22240%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22325%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E7%99%BB%E5%BD%95%3C%2Ftext%3E%3Ctext%20x%3D%22400%22%20y%3D%22370%22%20font-family%3D%22Arial%22%20font-size%3D%2212%22%20fill%3D%22%23909399%22%20text-anchor%3D%22middle%22%3E%C2%A9%202023%20%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%20All%20Rights%20Reserved.%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 简洁的登录表单：居中显示，包含用户名和密码输入框
- 登录按钮：使用主色调，突出显示
- 错误提示：输入错误时提供明确的错误提示
- 背景：简洁的浅色背景，突出登录表单

#### 5.2.2 后台首页（仪表盘）

![后台首页设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Crect%20width%3D%22200%22%20height%3D%22600%22%20fill%3D%22%23304156%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%2240%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0%3C%2Ftext%3E%3Crect%20x%3D%220%22%20y%3D%2280%22%20width%3D%22200%22%20height%3D%2250%22%20fill%3D%22%231f2d3d%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%3E%E4%BB%AA%E8%A1%A8%E7%9B%98%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22160%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E6%96%87%E7%AB%A0%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E8%B4%A1%E7%8C%AE%E8%80%85%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22310%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE%3C%2Ftext%3E%3Crect%20x%3D%22200%22%20y%3D%220%22%20width%3D%22600%22%20height%3D%2260%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22740%22%20y%3D%2235%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22end%22%3E%E7%AE%A1%E7%90%86%E5%91%98%20%7C%20%E9%80%80%E5%87%BA%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%2280%22%20width%3D%22180%22%20height%3D%22100%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%80%BB%E6%95%B0%3C%2Ftext%3E%3Ctext%20x%3D%22240%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E23%3C%2Ftext%3E%3Crect%20x%3D%22420%22%20y%3D%2280%22%20width%3D%22180%22%20height%3D%22100%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22440%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%88%86%E7%B1%BB%E6%80%BB%E6%95%B0%3C%2Ftext%3E%3Ctext%20x%3D%22440%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E3%3C%2Ftext%3E%3Crect%20x%3D%22620%22%20y%3D%2280%22%20width%3D%22180%22%20height%3D%22100%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22640%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B4%A1%E7%8C%AE%E8%80%85%E6%80%BB%E6%95%B0%3C%2Ftext%3E%3Ctext%20x%3D%22640%22%20y%3D%22150%22%20font-family%3D%22Arial%22%20font-size%3D%2224%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E2%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%22200%22%20width%3D%22580%22%20height%3D%22380%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22230%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E6%9C%80%E8%BF%91%E6%96%87%E7%AB%A0%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22250%22%20x2%3D%22800%22%20y2%3D%22250%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22280%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%981%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22280%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%20text-anchor%3D%22end%22%3E2023-01-01%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22300%22%20x2%3D%22800%22%20y2%3D%22300%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22330%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%982%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22330%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%20text-anchor%3D%22end%22%3E2023-01-02%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22350%22%20x2%3D%22800%22%20y2%3D%22350%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22380%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%983%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22380%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23909399%22%20text-anchor%3D%22end%22%3E2023-01-03%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 左侧菜单：深色背景，突出当前选中项
- 顶部导航栏：显示用户信息和退出按钮
- 数据概览卡片：显示文章、分类、贡献者等数量统计
- 最近文章列表：显示最近发布或编辑的文章
- 整体布局：清晰的信息层次，重要信息突出显示

#### 5.2.3 文章管理页面

![文章管理页面设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Crect%20width%3D%22200%22%20height%3D%22600%22%20fill%3D%22%23304156%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%2240%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E4%BB%AA%E8%A1%A8%E7%9B%98%3C%2Ftext%3E%3Crect%20x%3D%220%22%20y%3D%22130%22%20width%3D%22200%22%20height%3D%2250%22%20fill%3D%22%231f2d3d%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%22160%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%3E%E6%96%87%E7%AB%A0%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E8%B4%A1%E7%8C%AE%E8%80%85%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22310%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE%3C%2Ftext%3E%3Crect%20x%3D%22200%22%20y%3D%220%22%20width%3D%22600%22%20height%3D%2260%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22740%22%20y%3D%2235%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22end%22%3E%E7%AE%A1%E7%90%86%E5%91%98%20%7C%20%E9%80%80%E5%87%BA%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%2280%22%20width%3D%22560%22%20height%3D%2250%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22680%22%20y%3D%2290%22%20width%3D%2280%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%22720%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E6%96%B0%E5%A2%9E%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%22150%22%20width%3D%22560%22%20height%3D%22430%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22220%22%20y%3D%22150%22%20width%3D%22560%22%20height%3D%2240%22%20fill%3D%22%23F5F7FA%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23606266%22%3E%E6%A0%87%E9%A2%98%3C%2Ftext%3E%3Ctext%20x%3D%22440%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23606266%22%3E%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Ctext%20x%3D%22540%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23606266%22%3E%E5%8F%91%E5%B8%83%E6%97%B6%E9%97%B4%3C%2Ftext%3E%3Ctext%20x%3D%22680%22%20y%3D%22175%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20font-weight%3D%22bold%22%20fill%3D%22%23606266%22%3E%E6%93%8D%E4%BD%9C%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22190%22%20x2%3D%22780%22%20y2%3D%22190%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22220%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%981%3C%2Ftext%3E%3Ctext%20x%3D%22440%22%20y%3D%22220%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%8A%80%E6%9C%AF%3C%2Ftext%3E%3Ctext%20x%3D%22540%22%20y%3D%22220%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E2023-01-01%3C%2Ftext%3E%3Ctext%20x%3D%22660%22%20y%3D%22220%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E7%BC%96%E8%BE%91%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22220%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23F56C6C%22%3E%E5%88%A0%E9%99%A4%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22240%22%20x2%3D%22780%22%20y2%3D%22240%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22270%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%982%3C%2Ftext%3E%3Ctext%20x%3D%22440%22%20y%3D%22270%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E7%94%9F%E6%B4%BB%3C%2Ftext%3E%3Ctext%20x%3D%22540%22%20y%3D%22270%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E2023-01-02%3C%2Ftext%3E%3Ctext%20x%3D%22660%22%20y%3D%22270%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E7%BC%96%E8%BE%91%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22270%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23F56C6C%22%3E%E5%88%A0%E9%99%A4%3C%2Ftext%3E%3Cline%20x1%3D%22220%22%20y1%3D%22290%22%20x2%3D%22780%22%20y2%3D%22290%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%96%87%E7%AB%A0%E6%A0%87%E9%A2%983%3C%2Ftext%3E%3Ctext%20x%3D%22440%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%B5%84%E8%AE%AF%3C%2Ftext%3E%3Ctext%20x%3D%22540%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E2023-01-03%3C%2Ftext%3E%3Ctext%20x%3D%22660%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23409EFF%22%3E%E7%BC%96%E8%BE%91%3C%2Ftext%3E%3Ctext%20x%3D%22700%22%20y%3D%22320%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23F56C6C%22%3E%E5%88%A0%E9%99%A4%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%22540%22%20width%3D%22560%22%20height%3D%2240%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Crect%20x%3D%22450%22%20y%3D%22550%22%20width%3D%22100%22%20height%3D%2220%22%20fill%3D%22white%22%2F%3E%3Ctext%20x%3D%22500%22%20y%3D%22565%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22middle%22%3E%E5%88%86%E9%A1%B5%E6%8E%A7%E4%BB%B6%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 左侧菜单：与仪表盘页面保持一致，突出当前选中项
- 顶部操作栏：包含新增按钮，方便快速创建文章
- 表格布局：清晰展示文章列表，包含标题、分类、发布时间等信息
- 操作列：提供编辑、删除等快捷操作
- 分页控件：底部添加分页功能，便于浏览更多文章

#### 5.2.4 文章编辑页面

![文章编辑页面设计](data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%22600%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23F5F7FA%22%2F%3E%3Crect%20width%3D%22200%22%20height%3D%22600%22%20fill%3D%22%23304156%22%2F%3E%3Ctext%20x%3D%22100%22%20y%3D%2240%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E5%8D%9A%E5%AE%A2%E7%B3%BB%E7%BB%9F%E5%90%8E%E5%8F%B0%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E4%BB%AA%E8%A1%A8%E7%9B%98%3C%2Ftext%3E%3Crect%20x%3D%220%22%20y%3D%22130%22%20width%3D%22200%22%20height%3D%2250%22%20fill%3D%22%231f2d3d%22%2F%3E%3Ctext%20x%3D%2230%22%20y%3D%22160%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%3E%E6%96%87%E7%AB%A0%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22210%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E5%88%86%E7%B1%BB%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E8%B4%A1%E7%8C%AE%E8%80%85%E7%AE%A1%E7%90%86%3C%2Ftext%3E%3Ctext%20x%3D%2230%22%20y%3D%22310%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23bfcbd9%22%3E%E7%B3%BB%E7%BB%9F%E8%AE%BE%E7%BD%AE%3C%2Ftext%3E%3Crect%20x%3D%22200%22%20y%3D%220%22%20width%3D%22600%22%20height%3D%2260%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22740%22%20y%3D%2235%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%20text-anchor%3D%22end%22%3E%E7%AE%A1%E7%90%86%E5%91%98%20%7C%20%E9%80%80%E5%87%BA%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%2280%22%20width%3D%22560%22%20height%3D%2250%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2216%22%20font-weight%3D%22bold%22%20fill%3D%22%23303133%22%3E%E7%BC%96%E8%BE%91%E6%96%87%E7%AB%A0%3C%2Ftext%3E%3Crect%20x%3D%22680%22%20y%3D%2290%22%20width%3D%2280%22%20height%3D%2230%22%20rx%3D%224%22%20fill%3D%22%23409EFF%22%2F%3E%3Ctext%20x%3D%22720%22%20y%3D%22110%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22white%22%20text-anchor%3D%22middle%22%3E%E5%8F%91%E5%B8%83%3C%2Ftext%3E%3Crect%20x%3D%22220%22%20y%3D%22150%22%20width%3D%22560%22%20height%3D%22430%22%20fill%3D%22white%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22180%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E6%A0%87%E9%A2%98%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22190%22%20width%3D%22520%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22240%22%20y%3D%22260%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22270%22%20width%3D%22200%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Ctext%20x%3D%22260%22%20y%3D%22295%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E8%AF%B7%E9%80%89%E6%8B%A9%E5%88%86%E7%B1%BB%3C%2Ftext%3E%3Ctext%20x%3D%22240%22%20y%3D%22340%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3E%E5%86%85%E5%AE%B9%3C%2Ftext%3E%3Crect%20x%3D%22240%22%20y%3D%22350%22%20width%3D%22520%22%20height%3D%22200%22%20rx%3D%224%22%20fill%3D%22white%22%20stroke%3D%22%23DCDFE6%22%2F%3E%3Cline%20x1%3D%22240%22%20y1%3D%22380%22%20x2%3D%22760%22%20y2%3D%22380%22%20stroke%3D%22%23EBEEF5%22%2F%3E%3Ctext%20x%3D%22250%22%20y%3D%22370%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20fill%3D%22%23606266%22%3EB%20I%20U%20%E6%A0%87%E9%A2%98%20%E5%BC%95%E7%94%A8%20%E5%9B%BE%E7%89%87%20%E4%BB%A3%E7%A0%81%3C%2Ftext%3E%3C%2Fsvg%3E)

**设计要点：**

- 左侧菜单：与其他后台页面保持一致
- 顶部操作栏：包含发布按钮，方便快速保存和发布文章
- 表单布局：清晰的表单结构，包含标题、分类、内容等字段
- 富文本编辑器：提供丰富的文本编辑功能，支持图片、代码等内容的插入
- 整体布局：简洁明了，突出内容编辑区域

#### 5.2.5 分类管理页面

**设计要点：**

- 左侧菜单：与其他后台页面保持一致，突出当前选中项
- 表格布局：清晰展示分类列表，包含名称、文章数量等信息
- 操作列：提供编辑、删除等快捷操作
- 新增分类功能：提供添加新分类的入口

#### 5.2.6 贡献者管理页面

**设计要点：**

- 左侧菜单：与其他后台页面保持一致，突出当前选中项
- 表格布局：清晰展示贡献者列表，包含姓名、简介、头像等信息
- 操作列：提供编辑、删除等快捷操作
- 新增贡献者功能：提供添加新贡献者的入口

#### 5.2.7 系统设置页面

**设计要点：**

- 左侧菜单：与其他后台页面保持一致，突出当前选中项
- 表单布局：清晰的表单结构，包含网站标题、描述、Logo等设置项
- 保存按钮：方便快速保存设置
- 分组设置：将相关设置项分组显示，提高可用性

## 六、响应式设计

### 6.1 断点设置

为确保博客系统在各种设备上都能提供良好的用户体验，设置以下断点：

- 超小屏幕（手机）：< 576px
- 小屏幕（平板竖屏）：≥ 576px
- 中等屏幕（平板横屏）：≥ 768px
- 大屏幕（桌面显示器）：≥ 992px
- 超大屏幕（大桌面显示器）：≥ 1200px

### 6.2 前台页面响应式设计

#### 6.2.1 导航栏

- 大屏幕：水平导航栏，搜索框位于右侧
- 小屏幕：折叠为汉堡菜单，点击展开，搜索框位于折叠菜单内部

#### 6.2.2 布局结构

- 大屏幕：两栏布局，左侧文章列表，右侧侧边栏
- 中等屏幕：两栏布局，但宽度比例调整
- 小屏幕：单栏布局，侧边栏内容移至底部

#### 6.2.3 文章卡片

- 大屏幕：图文并排显示
- 小屏幕：图片在上，文字在下

### 6.3 后台页面响应式设计

#### 6.3.1 侧边菜单

- 大屏幕：始终展开显示
- 小屏幕：默认折叠，点击展开，展开时覆盖部分内容区域

#### 6.3.2 表格

- 大屏幕：完整显示所有列
- 小屏幕：隐藏次要列，保留重要列，或使用横向滚动

#### 6.3.3 表单

- 大屏幕：标签和输入框并排显示
- 小屏幕：标签在上，输入框在下，垂直排列

## 七、交互设计

### 7.1 前台交互

#### 7.1.1 搜索交互

- 输入关键词时实时提示
- 搜索结果页面高亮显示匹配的关键词
- 无结果时提供相关推荐

#### 7.1.2 文章列表交互

- 鼠标悬停时轻微放大或改变阴影效果
- 分页控件清晰显示当前页码和总页数
- 点击分类标签可快速筛选相关文章

#### 7.1.3 文章详情页交互

- 目录自动生成，支持锚点定位
- 代码块支持语法高亮和复制功能
- 图片支持点击放大查看

### 7.2 后台交互

#### 7.2.1 表单交互

- 实时表单验证，错误提示清晰明确
- 必填项标记明显
- 提交成功后给予明确反馈

#### 7.2.2 表格交互

- 支持排序、筛选功能
- 批量操作支持（如批量删除）
- 删除操作需二次确认

#### 7.2.3 编辑器交互

- 自动保存草稿功能
- 预览功能，可查看最终效果
- 上传图片支持拖拽和剪裁