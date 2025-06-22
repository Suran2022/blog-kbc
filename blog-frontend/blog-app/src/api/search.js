import request from '@/utils/request'

/**
 * 搜索文章
 * @param {Object} params 搜索参数
 * @param {string} params.keyword 搜索关键词
 * @param {string} params.tags 标签（可选）
 * @param {number} params.page 页码
 * @param {number} params.size 每页大小
 * @param {string} params.sortBy 排序字段
 * @param {string} params.sortDir 排序方向
 */
export function searchArticles(params) {
  return request({
    url: '/api/articles/search',
    method: 'get',
    params
  })
}

/**
 * 获取搜索建议
 * @param {string} keyword 关键词
 */
export function getSearchSuggestions(keyword) {
  return request({
    url: '/api/articles/search/suggestions',
    method: 'get',
    params: { keyword }
  })
}

/**
 * 获取热门搜索关键词
 */
export function getHotSearchKeywords() {
  return request({
    url: '/api/articles/search/hot-keywords',
    method: 'get'
  })
}