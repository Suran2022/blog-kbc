import request from '@/utils/request';

/**
 * 获取分类列表
 * @returns {Promise}
 */
export function getCategories() {
  return request({
    url: '/api/categories',
    method: 'get'
  });
}

/**
 * 获取分类详情
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export function getCategoryById(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'get'
  });
}

/**
 * 创建分类
 * @param {Object} data - 分类数据
 * @param {string} data.name - 分类名称
 * @param {string} [data.description] - 分类描述
 * @returns {Promise}
 */
export function createCategory(data) {
  return request({
    url: '/api/categories',
    method: 'post',
    data
  });
}

/**
 * 更新分类
 * @param {number|string} id - 分类ID
 * @param {Object} data - 分类数据
 * @param {string} data.name - 分类名称
 * @param {string} [data.description] - 分类描述
 * @returns {Promise}
 */
export function updateCategory(id, data) {
  return request({
    url: `/api/categories/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除分类
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export function deleteCategory(id) {
  return request({
    url: `/api/categories/${id}`,
    method: 'delete'
  });
}

// 导出分类API对象
export const categoryApi = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
};