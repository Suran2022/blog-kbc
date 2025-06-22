import request from '../utils/request';

/**
 * 获取贡献者列表
 * @returns {Promise}
 */
export function getContributors() {
  return request({
    url: '/contributors',
    method: 'get'
  });
}

/**
 * 获取贡献者详情
 * @param {number|string} id - 贡献者ID
 * @returns {Promise}
 */
export function getContributorById(id) {
  return request({
    url: `/contributors/${id}`,
    method: 'get'
  });
}

/**
 * 创建贡献者
 * @param {Object} data - 贡献者数据
 * @returns {Promise}
 */
export function createContributor(data) {
  return request({
    url: '/admin/contributors',
    method: 'post',
    data
  });
}

/**
 * 更新贡献者
 * @param {number|string} id - 贡献者ID
 * @param {Object} data - 贡献者数据
 * @returns {Promise}
 */
export function updateContributor(id, data) {
  return request({
    url: `/admin/contributors/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除贡献者
 * @param {number|string} id - 贡献者ID
 * @returns {Promise}
 */
export function deleteContributor(id) {
  return request({
    url: `/admin/contributors/${id}`,
    method: 'delete'
  });
}