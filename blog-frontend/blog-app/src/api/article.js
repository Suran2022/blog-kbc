import request from '@/utils/request';

/**
 * 获取文章列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @param {string} [params.keyword] - 关键词
 * @param {number} [params.category] - 分类ID
 * @param {number} [params.status] - 状态：0-草稿，1-已发布
 * @returns {Promise}
 */
export function getArticles(params) {
  return request({
    url: '/articles',
    method: 'get',
    params
  });
}

/**
 * 获取文章详情
 * @param {number|string} id - 文章ID
 * @returns {Promise}
 */
export function getArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  });
}

// 兼容旧的函数名
export const getArticleById = getArticle;

/**
 * 创建文章
 * @param {Object} data - 文章数据
 * @returns {Promise}
 */
export function createArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  });
}

/**
 * 更新文章
 * @param {number|string} id - 文章ID
 * @param {Object} data - 文章数据
 * @returns {Promise}
 */
export function updateArticle(id, data) {
  return request({
    url: `/articles/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除文章
 * @param {number|string} id - 文章ID
 * @returns {Promise}
 */
export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  });
}

/**
 * 根据分类获取文章列表
 * @param {number|string} categoryId - 分类ID
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @returns {Promise}
 */
export function getArticlesByCategory(categoryId, params) {
  return request({
    url: `/categories/${categoryId}/articles`,
    method: 'get',
    params
  });
}

/**
 * 搜索文章
 * @param {string} keyword - 关键词
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页条数
 * @returns {Promise}
 */
export function searchArticles(keyword, params) {
  return request({
    url: '/articles/search',
    method: 'get',
    params: { keyword, ...params }
  });
}

/**
 * 获取最新文章列表
 * @param {number} limit - 获取数量
 * @returns {Promise}
 */
export function getLatestArticles(limit = 5) {
  return request({
    url: '/articles/latest',
    method: 'get',
    params: { limit }
  });
}

/**
 * 获取热门文章列表
 * @param {number} limit - 获取数量
 * @returns {Promise}
 */
export function getPopularArticles(limit = 5) {
  return request({
    url: '/articles/popular',
    method: 'get',
    params: { limit }
  });
}

// 导出文章API对象
export const articleApi = {
  getArticles,
  getArticle,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
  searchArticles,
  getLatestArticles,
  getPopularArticles
};