# 博客项目API接口设计

## 一、接口规范

### 1.1 基本信息

- 基础URL：`/api`
- 请求方式：遵循RESTful规范，使用HTTP动词表示操作类型
  - GET：获取资源
  - POST：创建资源
  - PUT：更新资源
  - DELETE：删除资源
- 数据格式：JSON
- 字符编码：UTF-8

### 1.2 请求头

```
Content-Type: application/json
Authorization: Bearer {token}  // 需要认证的接口
```

### 1.3 响应格式

```json
{
  "code": 200,          // 状态码
  "message": "成功",   // 状态描述
  "data": {}           // 响应数据
}
```

### 1.4 状态码

| 状态码 | 描述 |
| --- | --- |
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 1.5 分页参数

```
page: 页码，从1开始
size: 每页记录数
```

分页响应格式：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [],     // 数据列表
    "totalElements": 0, // 总记录数
    "totalPages": 0,   // 总页数
    "size": 10,        // 每页记录数
    "number": 1        // 当前页码
  }
}
```

## 二、前台API

### 2.1 文章相关

#### 2.1.1 获取文章列表

- 请求方式：GET
- 接口路径：`/api/articles`
- 请求参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页记录数，默认10 |
| categoryId | Long | 否 | 分类ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "文章摘要",
        "coverImage": "图片URL",
        "categoryId": 1,
        "categoryName": "分类名称",
        "createTime": "2023-01-01 12:00:00",
        "updateTime": "2023-01-01 12:00:00",
        "viewCount": 100
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 1
  }
}
```

#### 2.1.2 获取文章详情

- 请求方式：GET
- 接口路径：`/api/articles/{id}`
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 文章ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "title": "文章标题",
    "content": "文章内容，HTML格式",
    "summary": "文章摘要",
    "coverImage": "图片URL",
    "categoryId": 1,
    "categoryName": "分类名称",
    "createTime": "2023-01-01 12:00:00",
    "updateTime": "2023-01-01 12:00:00",
    "viewCount": 100,
    "relatedArticles": [
      {
        "id": 2,
        "title": "相关文章标题"
      }
    ]
  }
}
```

#### 2.1.3 搜索文章

- 请求方式：GET
- 接口路径：`/api/articles/search`
- 请求参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| keyword | String | 是 | 搜索关键词 |
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页记录数，默认10 |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "文章摘要",
        "coverImage": "图片URL",
        "categoryId": 1,
        "categoryName": "分类名称",
        "createTime": "2023-01-01 12:00:00",
        "updateTime": "2023-01-01 12:00:00",
        "viewCount": 100
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 1
  }
}
```

#### 2.1.4 获取最新文章列表

- 请求方式：GET
- 接口路径：`/api/articles/latest`
- 请求参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| limit | Integer | 否 | 获取条数，默认5 |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "title": "文章标题",
      "createTime": "2023-01-01 12:00:00"
    }
  ]
}
```

### 2.2 分类相关

#### 2.2.1 获取分类列表

- 请求方式：GET
- 接口路径：`/api/categories`
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "分类名称",
      "articleCount": 10
    }
  ]
}
```

### 2.3 贡献者相关

#### 2.3.1 获取贡献者列表

- 请求方式：GET
- 接口路径：`/api/contributors`
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "贡献者名称",
      "avatar": "头像URL",
      "description": "描述",
      "link": "链接"
    }
  ]
}
```

### 2.4 系统相关

#### 2.4.1 获取系统设置

- 请求方式：GET
- 接口路径：`/api/settings`
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "siteName": "博客名称",
    "logo": "Logo URL",
    "description": "站点描述",
    "keywords": "关键词",
    "footerInfo": "页脚信息"
  }
}
```

## 三、后台API

### 3.1 用户认证

#### 3.1.1 登录

- 请求方式：POST
- 接口路径：`/api/auth/login`
- 请求参数：

```json
{
  "username": "admin",
  "password": "password"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "nickname": "管理员",
      "avatar": "头像URL"
    }
  }
}
```

#### 3.1.2 获取当前用户信息

- 请求方式：GET
- 接口路径：`/api/auth/info`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "username": "admin",
    "nickname": "管理员",
    "avatar": "头像URL"
  }
}
```

#### 3.1.3 退出登录

- 请求方式：POST
- 接口路径：`/api/auth/logout`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

### 3.2 文章管理

#### 3.2.1 获取文章列表（后台）

- 请求方式：GET
- 接口路径：`/api/admin/articles`
- 请求头：需要Authorization
- 请求参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| page | Integer | 否 | 页码，默认1 |
| size | Integer | 否 | 每页记录数，默认10 |
| keyword | String | 否 | 搜索关键词 |
| categoryId | Long | 否 | 分类ID |
| status | Integer | 否 | 状态：0-草稿，1-已发布 |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "content": [
      {
        "id": 1,
        "title": "文章标题",
        "summary": "文章摘要",
        "coverImage": "图片URL",
        "categoryId": 1,
        "categoryName": "分类名称",
        "status": 1,
        "createTime": "2023-01-01 12:00:00",
        "updateTime": "2023-01-01 12:00:00",
        "viewCount": 100
      }
    ],
    "totalElements": 100,
    "totalPages": 10,
    "size": 10,
    "number": 1
  }
}
```

#### 3.2.2 获取文章详情（后台）

- 请求方式：GET
- 接口路径：`/api/admin/articles/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 文章ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "title": "文章标题",
    "content": "文章内容，HTML格式",
    "summary": "文章摘要",
    "coverImage": "图片URL",
    "categoryId": 1,
    "status": 1,
    "createTime": "2023-01-01 12:00:00",
    "updateTime": "2023-01-01 12:00:00"
  }
}
```

#### 3.2.3 创建文章

- 请求方式：POST
- 接口路径：`/api/admin/articles`
- 请求头：需要Authorization
- 请求参数：

```json
{
  "title": "文章标题",
  "content": "文章内容，HTML格式",
  "summary": "文章摘要",
  "coverImage": "图片URL",
  "categoryId": 1,
  "status": 0  // 0-草稿，1-已发布
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1
  }
}
```

#### 3.2.4 更新文章

- 请求方式：PUT
- 接口路径：`/api/admin/articles/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 文章ID |

- 请求参数：

```json
{
  "title": "文章标题",
  "content": "文章内容，HTML格式",
  "summary": "文章摘要",
  "coverImage": "图片URL",
  "categoryId": 1,
  "status": 1  // 0-草稿，1-已发布
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 3.2.5 删除文章

- 请求方式：DELETE
- 接口路径：`/api/admin/articles/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 文章ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

### 3.3 分类管理

#### 3.3.1 获取分类列表（后台）

- 请求方式：GET
- 接口路径：`/api/admin/categories`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "分类名称",
      "articleCount": 10,
      "createTime": "2023-01-01 12:00:00",
      "updateTime": "2023-01-01 12:00:00"
    }
  ]
}
```

#### 3.3.2 创建分类

- 请求方式：POST
- 接口路径：`/api/admin/categories`
- 请求头：需要Authorization
- 请求参数：

```json
{
  "name": "分类名称"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1
  }
}
```

#### 3.3.3 更新分类

- 请求方式：PUT
- 接口路径：`/api/admin/categories/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 分类ID |

- 请求参数：

```json
{
  "name": "分类名称"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 3.3.4 删除分类

- 请求方式：DELETE
- 接口路径：`/api/admin/categories/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 分类ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

### 3.4 贡献者管理

#### 3.4.1 获取贡献者列表（后台）

- 请求方式：GET
- 接口路径：`/api/admin/contributors`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "贡献者名称",
      "avatar": "头像URL",
      "description": "描述",
      "link": "链接",
      "createTime": "2023-01-01 12:00:00",
      "updateTime": "2023-01-01 12:00:00"
    }
  ]
}
```

#### 3.4.2 创建贡献者

- 请求方式：POST
- 接口路径：`/api/admin/contributors`
- 请求头：需要Authorization
- 请求参数：

```json
{
  "name": "贡献者名称",
  "avatar": "头像URL",
  "description": "描述",
  "link": "链接"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1
  }
}
```

#### 3.4.3 更新贡献者

- 请求方式：PUT
- 接口路径：`/api/admin/contributors/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 贡献者ID |

- 请求参数：

```json
{
  "name": "贡献者名称",
  "avatar": "头像URL",
  "description": "描述",
  "link": "链接"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

#### 3.4.4 删除贡献者

- 请求方式：DELETE
- 接口路径：`/api/admin/contributors/{id}`
- 请求头：需要Authorization
- 路径参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| id | Long | 是 | 贡献者ID |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

### 3.5 系统设置管理

#### 3.5.1 获取系统设置（后台）

- 请求方式：GET
- 接口路径：`/api/admin/settings`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "siteName": "博客名称",
    "logo": "Logo URL",
    "description": "站点描述",
    "keywords": "关键词",
    "footerInfo": "页脚信息"
  }
}
```

#### 3.5.2 更新系统设置

- 请求方式：PUT
- 接口路径：`/api/admin/settings`
- 请求头：需要Authorization
- 请求参数：

```json
{
  "siteName": "博客名称",
  "logo": "Logo URL",
  "description": "站点描述",
  "keywords": "关键词",
  "footerInfo": "页脚信息"
}
```

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": null
}
```

### 3.6 文件上传

#### 3.6.1 上传图片

- 请求方式：POST
- 接口路径：`/api/admin/upload/image`
- 请求头：需要Authorization，Content-Type: multipart/form-data
- 请求参数：

| 参数名 | 类型 | 必填 | 描述 |
| --- | --- | --- | --- |
| file | File | 是 | 图片文件 |

- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "url": "图片URL"
  }
}
```

### 3.7 统计数据

#### 3.7.1 获取控制台统计数据

- 请求方式：GET
- 接口路径：`/api/admin/statistics/dashboard`
- 请求头：需要Authorization
- 响应示例：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "articleCount": 100,
    "categoryCount": 10,
    "viewCount": 1000,
    "latestArticles": [
      {
        "id": 1,
        "title": "文章标题",
        "createTime": "2023-01-01 12:00:00"
      }
    ]
  }
}
```

## 四、错误码说明

| 错误码 | 描述 | 说明 |
| --- | --- | --- |
| 10001 | 用户名或密码错误 | 登录失败 |
| 10002 | 账号已被锁定 | 登录失败 |
| 10003 | 无效的token | 认证失败 |
| 10004 | token已过期 | 认证失败 |
| 20001 | 文章不存在 | 获取文章详情失败 |
| 20002 | 文章标题已存在 | 创建/更新文章失败 |
| 30001 | 分类不存在 | 获取分类详情失败 |
| 30002 | 分类名称已存在 | 创建/更新分类失败 |
| 30003 | 分类下存在文章，无法删除 | 删除分类失败 |
| 40001 | 贡献者不存在 | 获取贡献者详情失败 |
| 50001 | 上传文件类型不支持 | 上传文件失败 |
| 50002 | 上传文件大小超出限制 | 上传文件失败 |

## 五、安全设计

### 5.1 认证机制

- 采用JWT（JSON Web Token）进行身份认证
- token有效期为24小时
- 请求头中携带Authorization: Bearer {token}进行认证

### 5.2 权限控制

- 前台API：无需认证，所有用户可访问
- 后台API：需要认证，只有管理员可访问

### 5.3 安全防护

- 密码加密：使用BCrypt加密算法
- XSS防护：对输入输出进行HTML转义
- CSRF防护：使用token验证
- SQL注入防护：使用参数化查询
- 请求限流：IP级别限流，防止恶意请求

## 六、接口测试

### 6.1 测试环境

- 测试环境URL：`http://localhost:8080`
- 测试账号：
  - 用户名：admin
  - 密码：admin123

### 6.2 测试工具

- Postman：用于API测试
- JUnit：用于单元测试

### 6.3 测试用例

| 接口 | 测试项 | 预期结果 |
| --- | --- | --- |
| 登录 | 正确用户名密码 | 返回token |
| 登录 | 错误用户名密码 | 返回错误信息 |
| 获取文章列表 | 默认参数 | 返回第一页文章列表 |
| 获取文章列表 | 指定分类 | 返回指定分类的文章列表 |
| 获取文章详情 | 存在的文章ID | 返回文章详情 |
| 获取文章详情 | 不存在的文章ID | 返回错误信息 |
| 创建文章 | 有效参数 | 创建成功 |
| 创建文章 | 标题为空 | 返回错误信息 |

## 七、接口文档生成

使用Swagger自动生成API文档，访问地址：`http://localhost:8080/swagger-ui.html`

## 八、版本控制

- 当前版本：v1.0
- 版本命名规则：vX.Y.Z
  - X：主版本号，不兼容的API修改
  - Y：次版本号，向下兼容的功能性新增
  - Z：修订号，向下兼容的问题修正